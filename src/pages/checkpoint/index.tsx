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
import { ArrowLeftOutlined } from "@ant-design/icons";
import CheckpointService from "../../service/checkpoint.service";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

let flagInterval: NodeJS.Timeout;

const { Title, Text } = Typography;

const CheckpointDetail = () => {
  const [assetInfo, setAssetInfo] = useState<any>({});
  const router = useRouter();
  const { propertyId, checkpointId } = router.query;
  const [form] = Form.useForm();
  const wallet = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);
  const [checkpointDetail, setCheckpointDetail] = useState<any>({});

  useEffect(() => {
    (async () => {
      console.log("propertyId: ", propertyId, checkpointId);
      if (!propertyId || !checkpointId) return;

      const [res]: any = await EvaluationService.getDetail(propertyId);
      console.log("res: ", res);
      const [checkpointDetail] = await CheckpointService.getCheckpointDetail(
        checkpointId
      );
      console.log("checkpointDetail: ", checkpointDetail);
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

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
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
                  {checkpointDetail?.checkpoint?.totalDistributionAmount}
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
                label="Deposite Escrow"
                name="amount"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Input />
              </Form.Item>
              <Text style={{ color: "var(--text-color)" }}>
                {`Available Balance: `}
              </Text>
              <br />
              <br />
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ width: "100%" }}
              >
                Deposit
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
