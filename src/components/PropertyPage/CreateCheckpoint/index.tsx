import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { Button, Form, Input, Modal, Typography } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import mainProgram from "../../../programs/MainProgram";
import { getProvider } from "../../../programs/utils";
import CheckpointService from "../../../service/checkpoint.service";
import TransactionModal from "../../common/TransactionModal";

const { Title, Text } = Typography;

const CreateCheckpoint = ({ propertyInfo }: any) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wallet = useAnchorWallet();
  const { publicKey, sendTransaction } = useWallet();
  const [tx, setTx] = useState<any>("");
  const [isShownModalTx, setIsShownModalTx] = useState<boolean>(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    try {
      const provider = getProvider(wallet);

      if (!propertyInfo || !provider || !publicKey) return;

      setLoading(true);
      const program = new mainProgram(provider);
      const [txToBase64, err]: any = await program.createDividentCheckpoint(
        propertyInfo?.assetBasket,
        propertyInfo?.bigGuardian
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

      if (done) {
        setIsModalOpen(false);
        setIsShownModalTx(true);
        const [res] = await CheckpointService.updateCheckpoint({
          dividend_distributor: values.amount,
          evaluation_id: propertyInfo._id,
        });
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
            label="Buy Amount"
            name="amount"
            rules={[{ required: true, message: "This field cannot be empty." }]}
            style={{ marginBottom: 10 }}
          >
            <Input />
          </Form.Item>
          <Text style={{ color: "var(--text-color)" }}>
            Available Balance: 97,420,234.49 USDC
          </Text>

          <br />
          <br />
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "This field cannot be empty." }]}
            style={{ marginBottom: 10 }}
          >
            <TextArea />
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
