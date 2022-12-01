import { message, Tag } from "antd";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import EvaluationService from "../../../service/evaluation.service";
import { Row, Col, Typography, Divider, Descriptions } from "antd";
import MainLayout from "../../../components/Main-Layout";
import { NextPageWithLayout } from "../../_app";
import AssetInfo from "../../../components/PortalEvaluationPage/AssetInfo";

let flagInterval: NodeJS.Timeout;

const { Title } = Typography;

const DetailNftPage: NextPageWithLayout = () => {
  const [assetInfo, setAssetInfo] = useState<any>({});
  const router = useRouter();
  const id = router?.query?.id;
  useEffect(() => {
    (async () => {
      if (id) {
        const [res]: any = await EvaluationService.getDetail(id);
        if (!res?.error) {
          setAssetInfo(res);
        } else {
          message.error(res?.error?.message);
        }
      }
    })();
    return () => {
      clearInterval(flagInterval);
    };
  }, [id]);

  console.log({ assetInfo });

  return (
    <div>
      {assetInfo?.status === "TOKENIZED" && (
        <Row gutter={[20, 0]}>
          <Col span={16}>
            <div className="box">
              <div style={{ display: "flex", gap: 30 }}>
                <Title level={3}>LAND INFO</Title>

                <div>
                  <Tag
                    style={{ padding: "5px 10px", fontWeight: 500 }}
                    color="#108ee9"
                  >
                    {assetInfo.status}
                  </Tag>
                </div>
              </div>
              <Divider />

              <Row>
                <div style={{ width: "100%" }}>
                  <AssetInfo assetInfo={assetInfo} />
                </div>
              </Row>
            </div>
          </Col>

          <Col span={8}>
            <div className="box">
              <Descriptions
                layout="vertical"
                colon={false}
                column={2}
                title={
                  <Divider orientation="left" orientationMargin={0}>
                    <Title level={3}>Token Infomation</Title>{" "}
                  </Divider>
                }
              >
                <Descriptions.Item
                  label={
                    <span className="description-label">
                      Token Total Supply
                    </span>
                  }
                >
                  <span className="description-value">
                    {assetInfo.tokenSupply}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span className="description-label">
                      Token Listing Price
                    </span>
                  }
                >
                  <span className="description-value">$0.05</span>
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span className="description-label">Token Name</span>}
                >
                  <span className="description-value">
                    {assetInfo.tokenName}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span className="description-label">Token Symbol</span>
                  }
                >
                  <span className="description-value">
                    {assetInfo.tokenSymbol}
                  </span>
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* <div className="box" style={{ marginTop: 20 }}>
            <Divider orientation="left">Buy ABC (1 USDT = 20 ABC) </Divider>
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
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
                style={{ marginBottom: 5 }}
              >
                <Input />
              </Form.Item>
              <p style={{ fontSize: 14, color: "var(--text-color)" }}>
                Available Balance: 97,420,234.49 USDC
              </p>
              <ReceiveInfo>
                <p style={{ color: "var(--text-color)" }}>You Receive</p>
                <p style={{ fontSize: 15, fontWeight: 600 }}>0.05 ABC</p>
              </ReceiveInfo>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Buy
              </Button>
            </Form>
          </div> */}
          </Col>
        </Row>
      )}
      {(assetInfo.status === "PASSED" || assetInfo.status === "PENDING") && (
        <div className="box">
          <div style={{ display: "flex", gap: 30 }}>
            <Title level={3}>LAND INFO</Title>

            <div>
              <Tag
                style={{ padding: "5px 10px", fontWeight: 500 }}
                color="#108ee9"
              >
                {assetInfo.status}
              </Tag>
            </div>
          </div>

          <Divider />
          <AssetInfo assetInfo={assetInfo} />
        </div>
      )}
    </div>
  );
};

export default DetailNftPage;

DetailNftPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};
