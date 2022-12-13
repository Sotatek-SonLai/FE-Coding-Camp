import { Router, useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Typography,
  Divider,
  Form,
  Input,
  Descriptions,
  message,
  Avatar,
  Tooltip,
} from "antd";
import EvaluationService from "../../service/evaluation.service";
import ActivityHistory from "../../components/CheckpointPage/ActivityHistory";
import MainLayout from "../../components/Main-Layout";
import { getUrl } from "../../utils/utility";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import CheckpointService from "../../service/checkpoint.service";
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
import { getProvider } from "../../programs/utils";
import mainProgram from "../../programs/MainProgram";
import TransactionModal from "../../components/common/TransactionModal";
import Link from "next/link";
import * as anchor from "@project-serum/anchor";
import { getAssociatedTokenAddress } from "@solana/spl-token";

let flagInterval: NodeJS.Timeout;

const { Title, Text } = Typography;

const CheckpointDetail = () => {
  const [assetInfo, setAssetInfo] = useState<any>({});
  const router = useRouter();
  const { propertyId, checkpointId } = router.query;
  const [form] = Form.useForm();
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState("");
  const [checkpointDetail, setCheckpointDetail] = useState<any>();
  const wallet = useAnchorWallet();
  const [tx, setTx] = useState<any>("");
  const [isShownModalTx, setIsShownModalTx] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      console.log("propertyId: ", propertyId, checkpointId);
      if (!propertyId || !checkpointId) return;

      const [res]: any = await EvaluationService.getDetail(propertyId);

      const [checkpointDetail] = await CheckpointService.getCheckpointDetail(
        checkpointId
      );
      console.log("checkpointDetail: ", checkpointDetail);
      if (checkpointDetail && publicKey) {
        const tokenPublicKey = new anchor.web3.PublicKey(
          checkpointDetail.data.fractionalizeTokenMint
        );

        const tokenOwnerAccount = await getAssociatedTokenAddress(
          tokenPublicKey,
          publicKey
        );

        let tokenAccountInfo = await connection.getTokenAccountBalance(
          tokenOwnerAccount
        );

        console.log({ tokenAccountInfo });

        setBalance(tokenAccountInfo.value.uiAmountString || "");
      }

      if (!res?.error) {
        setAssetInfo(res);
        setCheckpointDetail(checkpointDetail.data);
      } else {
        message.error(res?.error?.message);
      }
    })();
    return () => {
      clearInterval(flagInterval);
    };
  }, [propertyId, checkpointId]);

  const onFinish = async (values: any) => {
    console.log("Success:", values);

    try {
      const provider = getProvider(wallet);

      if (provider && publicKey) {
        setLoading(true);
        const program = new mainProgram(provider);
        const [txToBase64, err]: any = await program.lockEscrow(
          checkpointDetail.checkpoint.locker,
          checkpointDetail.fractionalizeTokenMint
        );
        console.log({ checkpointDetail });
        console.log("err: ", err);
        if (!err) {
          console.log({ txToBase64 });

          const tx = await sendTransaction(
            Transaction.from(Buffer.from(txToBase64, "base64")),
            program._provider.connection,
            {
              skipPreflight: true,
              maxRetries: 5,
            }
          );

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
            setIsShownModalTx(true);
          }
        }
        setLoading(false);
      } else {
        message.error("Please connect your wallet");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <TransactionModal
        close={() => setIsShownModalTx(false)}
        title="Successfully tokenized!"
        tx={tx}
        isShown={isShownModalTx}
      >
        <Link href="/properties">
          <Button block type="primary">
            Go to properties list <ArrowRightOutlined />
          </Button>
        </Link>
      </TransactionModal>
      <Button
        type="ghost"
        shape="circle"
        size="large"
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 20 }}
        onClick={() => router.back()}
      />
      <Row gutter={[30, 0]}>
        <Col span={16}>
          <div className="box">
            <Divider orientation="left" orientationMargin={50}>
              <Title level={2}>Active History</Title>
            </Divider>
            <ActivityHistory />
          </div>
        </Col>
        <Col span={8}>
          <div
            className="box"
            style={{
              padding: "30px 40px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Tooltip title="View Property Details" placement="right">
                <Avatar
                  src={getUrl(assetInfo?.avatar)}
                  size={74}
                  onClick={() => router.push(`/properties/${propertyId}`)}
                />
              </Tooltip>
              <Text style={{ color: "var(--text-color)", marginTop: 10 }}>
                Token name: {assetInfo.tokenName}
              </Text>
              <Text style={{ color: "var(--text-color)", marginTop: 5 }}>
                Address: {assetInfo.address}
              </Text>
            </div>
            <Divider orientation="left" />
            <Row style={{ margin: "30px 0px" }}>
              <Col span={12}>
                <Text strong style={{ fontSize: 15 }}>
                  Total Deposit
                </Text>
                <br />
                <Text
                  style={{ color: "#1890ff", fontSize: 25, fontWeight: 500 }}
                >
                  {checkpointDetail?.checkpoint
                    ? checkpointDetail.checkpoint.totalDistributionAmount /
                      10 ** checkpointDetail.checkpoint.decimal
                    : 0}
                </Text>
              </Col>
              <Col span={12}>
                <Text strong style={{ fontSize: 15 }}>
                  Your Deposit
                </Text>
                <br />
                <Text
                  style={{ color: "#28b373", fontSize: 25, fontWeight: 500 }}
                >
                  50,000 T4
                </Text>
              </Col>
            </Row>
            <Descriptions layout="horizontal" column={1}>
              <Descriptions.Item
                label={
                  <Text style={{ color: "var(--text-color)" }}>
                    Checkpoint ID
                  </Text>
                }
              >
                <Text style={{}}>#{checkpointDetail?.checkpoint?._id}</Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Text style={{ color: "var(--text-color)" }}>
                    Checkpoint Deposit end at:
                  </Text>
                }
              >
                <Text style={{}}>November 30, 2022 at 06:55pm</Text>
              </Descriptions.Item>
            </Descriptions>
            <br />
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
                label="Lock Escrow"
                name="amount"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Input />
              </Form.Item>
              <Text style={{ color: "var(--text-color)" }}>
                {`Available Balance: ${balance}`}
              </Text>
              <br />
              <br />
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                Lock
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default CheckpointDetail;

CheckpointDetail.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};
