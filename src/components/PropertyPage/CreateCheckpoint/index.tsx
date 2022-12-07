import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { Button, Form, Input, Modal, Typography, Upload } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import mainProgram from "../../../programs/MainProgram";
import { getProvider } from "../../../programs/utils";
import CheckpointService from "../../../service/checkpoint.service";
import TransactionModal from "../../common/TransactionModal";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd/es/upload/interface";
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
  // const wallet = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);

  const getUserSOLBalance = async (
    publicKey: PublicKey,
    connection: Connection
  ) => {
    let balance = await connection.getBalance(publicKey);
    setBalance(balance);
  };

  useEffect(() => {
    if (wallet?.publicKey) {
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet?.publicKey, connection]);
  const [reportFile, setReportFile] = useState<UploadFile[]>([]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields()
    setReportFile([])
  };

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    try {
      const provider = getProvider(wallet);

      if (!propertyInfo || !provider || !publicKey) return;

      setLoading(true);
      const program = new mainProgram(provider);
      const [txToBase64, err, dividend_distributor]: any =
        await program.createDividendCheckpoint(
          propertyInfo?.assetBasket,
          propertyInfo?.bigGuardian,
          values.tokenAddress
        );

      if (err) {
        setLoading(false);
        return;
      }

      const [res]: any = await CheckpointService.sendSerializedTransaction(
        propertyInfo._id,
        txToBase64
      );
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
      setTimeout(() => {
        if (done) {
          return;
        }
        done = true;
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
      console.log("1");
      if (done) {
        console.log("2");
        handleCancel();
        setIsShownModalTx(true);
        const [res] = await CheckpointService.updateCheckpoint({
          dividend_distributor: dividend_distributor,
          evaluation_id: propertyInfo._id,
          token_address: values.tokenAddress,
          description: values.description,
          report: await Promise.all(
            values?.report.fileList.map(async (file: any, index: number) => {
              return {
                name: file.name,
                data: await toBase64(file.originFileObj),
              };
            })
          ),
        });
        onDone();
        console.log("res: ", res);
      }
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      console.log({ err });
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
            label="Deposit Amount"
            name="amount"
            rules={[{ required: true, message: "This field cannot be empty." }]}
            style={{ marginBottom: 10 }}
          >
            <Input />
          </Form.Item>
          <Text style={{ color: "var(--text-color)" }}>
            Available Balance: {balance / LAMPORTS_PER_SOL} SOL
          </Text>

          <Form.Item
            label="Token Address"
            name="tokenAddress"
            rules={[{ required: true, message: "This field cannot be empty." }]}
            style={{ marginBottom: 10 }}
          >
            <Input />
          </Form.Item>
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
            // rules={[{ required: true, message: "This field cannot be empty." }]}
            rules={[
              {
                validator: (_, value) => 
                   reportFile?.length > 0
                    ? Promise.resolve()
                    : Promise.reject(new Error("File upload cannot be empty."))
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
