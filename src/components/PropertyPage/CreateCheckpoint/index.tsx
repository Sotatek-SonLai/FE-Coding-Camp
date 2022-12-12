import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { Button, Form, Input, message, Modal, Typography, Upload } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useState } from "react";
import mainProgram from "../../../programs/MainProgram";
import { getProvider } from "../../../programs/utils";
import CheckpointService from "../../../service/checkpoint.service";
import TransactionModal from "../../common/TransactionModal";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd/es/upload/interface";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { toBase64 } from "../../../utils/utility";

const { Title, Text } = Typography;

const CreateCheckpoint = ({ propertyInfo, onDone }: any) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wallet = useAnchorWallet();
  const { publicKey, sendTransaction } = useWallet();
  const [tx, setTx] = useState<any>("");
  const [isShownModalTx, setIsShownModalTx] = useState<boolean>(false);
  const { connection } = useConnection();
  const [balance, setBalance] = useState("");

  const validateTokenAddress = async (tokenAddress: string) => {
    if (!publicKey) {
      message.error("Please connect your wallet");
      return;
    }
    try {
      const tokenPublicKey = new anchor.web3.PublicKey(tokenAddress);

      const tokenOwnerAccount = await getAssociatedTokenAddress(
        tokenPublicKey,
        publicKey
      );

      let tokenAccountInfo = await connection.getTokenAccountBalance(
        tokenOwnerAccount
      );

      setBalance(tokenAccountInfo.value.uiAmountString || "");
      return true;
    } catch (error) {
      setBalance("");
      return false;
    }
  };

  const [reportFile, setReportFile] = useState<UploadFile[]>([]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setReportFile([]);
  };

  const onFinish = async (values: any) => {
    try {
      const provider = getProvider(wallet);

      if (!propertyInfo || !provider || !publicKey) return;

      setLoading(true);
      const program = new mainProgram(provider);
      const [txToBase64, err, dividend_distributor]: any =
        await program.createDividendCheckpoint(
          values.amount,
          propertyInfo?.assetBasket,
          propertyInfo?.bigGuardian,
          values.tokenAddress
        );

      if (err) {
        setLoading(false);
        message.error("Failed to create devidend checkpoint!");
        return;
      }

      const [res, error]: any =
        await CheckpointService.sendSerializedTransaction(
          propertyInfo._id,
          txToBase64
        );
      if (error) return;

      const tx = await sendTransaction(
        Transaction.from(Buffer.from(res.data, "base64")),
        program._provider.connection,
        {
          skipPreflight: true,
          maxRetries: 5,
        }
      );
      console.log(tx);
      console.log("started await");

      setTx(tx);

      const statusCheckInterval = 300;
      const timeout = 90000;
      let isBlockhashValid = true;
      const sleep = (ms: any) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };

      const isBlockhashExpired = async (initialBlockHeight: any) => {
        let currentBlockHeight =
          await program._provider.connection.getBlockHeight();
        console.log(currentBlockHeight);
        return currentBlockHeight > initialBlockHeight;
      };

      const inititalBlock = (
        await program._provider.connection.getSignatureStatus(tx)
      ).context.slot;

      let done = false;
      let transactionTimeout = false;

      setTimeout(() => {
        if (done) {
          return;
        }
        done = true;
        CheckpointService.updateCheckpoint;
        transactionTimeout = true;
        console.log("Timed out for txid", tx);
        console.log(
          `${
            isBlockhashValid
              ? "Blockhash not yet expired."
              : "Blockhash has expired."
          }`
        );
      }, timeout);

      while (!done && isBlockhashValid) {
        const confirmation =
          await program._provider.connection.getSignatureStatus(tx);

        if (
          confirmation.value &&
          (confirmation.value.confirmationStatus === "confirmed" ||
            confirmation.value.confirmationStatus === "finalized")
        ) {
          console.log(
            `Confirmation Status: ${confirmation.value.confirmationStatus}, ${tx}`
          );
          done = true;
          //Run any additional code you'd like with your txId (e.g. notify user of succesful transaction)
        } else {
          console.log(
            `Confirmation Status: ${
              confirmation.value?.confirmationStatus || "not yet found."
            }`
          );
        }
        isBlockhashValid = !(await isBlockhashExpired(inititalBlock));
        await sleep(statusCheckInterval);
      }

      if (done && !transactionTimeout) {
        handleCancel();
        setIsShownModalTx(true);
        const [res] = await CheckpointService.updateCheckpoint({
          dividend_distributor: dividend_distributor.publicKey,
          evaluation_id: propertyInfo._id,
          token_address: values.tokenAddress,
          description: values.description,
          // reportFile: await Promise.all(
          //   reportFile.map(async (file: any, index: number) => {
          //     console.log({ file });
          //     return {
          //       name: file.name,
          //       data: await toBase64(file),
          //     };
          // })
          // ),

          reportFile: {
            name: reportFile[0].name,
            data: await toBase64(reportFile[0]),
          },
        });
        onDone();
      }

      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      console.log({ err });
      message.error("Failed to create devidend checkpoint!");
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    console.log("tx: ", tx);
  }, [tx]);

  const propPaper: UploadProps = {
    beforeUpload: (file, fileList) => {
      setReportFile([file]);
      return false;
    },
    onRemove: (file) => {
      setReportFile([]);
    },
    defaultFileList: [],
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Create Checkpoint
      </Button>

      <Modal
        title="Create checkpoint"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <Form
          form={form}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="horizontal"
        >
          <Form.Item
            label="Token Address"
            name="tokenAddress"
            rules={[
              { required: true, message: "This field cannot be empty." },
              {
                validator: async (_, value) => {
                  return (await validateTokenAddress(value))
                    ? Promise.resolve()
                    : Promise.reject("Token address does not exist");
                },
              },
            ]}
            style={{ marginBottom: 10 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Deposit Amount"
            name="amount"
            rules={[{ required: true, message: "This field cannot be empty." }]}
            style={{ marginBottom: 10 }}
          >
            <Input />
          </Form.Item>
          {balance && (
            <Text style={{ color: "var(--text-color)" }}>
              Available Balance: {balance}
            </Text>
          )}

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "This field cannot be empty." }]}
            style={{ marginBottom: 10 }}
          >
            <TextArea rows={5} />
          </Form.Item>
          <Form.Item
            label="Report File"
            name="report"
            rules={[
              {
                validator: (_, value) =>
                  reportFile?.length > 0
                    ? Promise.resolve()
                    : Promise.reject(new Error("File upload cannot be empty.")),
              },
            ]}
          >
            <Upload
              customRequest={({ file, onSuccess }: any) => {
                onSuccess("ok");
              }}
              fileList={reportFile}
              {...propPaper}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <br />
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{ width: "100%" }}
            loading={loading}
          >
            Deposit
          </Button>
        </Form>
      </Modal>

      <TransactionModal
        close={() => setIsShownModalTx(false)}
        title="Successfully dividend!"
        tx={tx}
        isShown={isShownModalTx}
        closable={true}
      />
    </>
  );
};

export default CreateCheckpoint;
