import React from "react";
import {
  Affix,
  Button,
  Col,
  Descriptions,
  Divider,
  Row,
  Tag,
  Typography,
} from "antd";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import AssetInfo from "../AssetInfo";

const { Title, Text } = Typography;
const TokenizedAsset: React.FC<{ assetInfo: any }> = ({ assetInfo }) => {
  return (
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
          <AssetInfo assetInfo={assetInfo} />
        </div>
      </Col>

      <Col span={8}>
        <Affix offsetTop={80}>
          <div className="box">
            <Divider
              orientation="left"
              orientationMargin={0}
              style={{ marginBottom: 0 }}
            >
              <Title style={{ marginBottom: 0 }} level={2}>
                $215,900
              </Title>
            </Divider>

            <Text style={{ color: " var(--text-color)" }}>
              Approved on November 30, 2022 at 06:55pm
            </Text>
            <Descriptions
              layout="vertical"
              colon={false}
              column={2}
              style={{ marginTop: 30 }}
            >
              <Descriptions.Item
                label={<span className="description-label">Token Name</span>}
              >
                <Text strong className="description-value">
                  {assetInfo.tokenName}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={<span className="description-label">Token Symbol</span>}
              >
                <Text strong className="description-value">
                  {assetInfo.tokenSymbol}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="description-label">Token Total Supply</span>
                }
              >
                <Text strong className="description-value">
                  {assetInfo.tokenSupply}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="description-label">Token Listing Price</span>
                }
              >
                <Text strong className="description-value">
                  $0.05
                </Text>
              </Descriptions.Item>
            </Descriptions>

            <Button
              style={{
                backgroundColor: "#87d068",
                color: "white",
                margin: "30px 0px 15px",
              }}
              block
              size="middle"
            >
              LIST NFT
            </Button>

            <Button block size="middle" type="primary" ghost danger>
              Cancel
            </Button>
            <Divider
              orientation="left"
              orientationMargin={0}
              style={{ marginTop: 40 }}
            >
              <Text style={{ fontSize: 20 }}>Contact this property</Text>
            </Divider>
            <Row style={{ color: " var(--text-color)" }}>
              <Col span={12}>
                <PhoneOutlined />
                <Text style={{ color: " var(--text-color)" }}>
                  {" "}
                  (708) 919-2291
                </Text>
              </Col>
              <Col span={12}>
                <MailOutlined />
                <Text style={{ color: " var(--text-color)" }}>
                  {" "}
                  peter.parker@zylker.com
                </Text>
              </Col>
            </Row>
          </div>
        </Affix>
      </Col>
    </Row>
  );
};

export default TokenizedAsset;
