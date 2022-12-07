import React from "react";
import { Affix, Button, Col, Divider, Row, Tag, Typography } from "antd";
import AssetInfo from "../AssetInfo";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import Link from "next/link";
import ButtonDeleteDetail from "../../common/button/ButtonDeleteDetail";

const { Title, Text } = Typography;
const MintedAsset: React.FC<{ assetInfo: any }> = ({ assetInfo }) => {
  return (
    <Row gutter={[20, 0]}>
      <Col span={16}>
        <div className="box">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
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
            <ButtonDeleteDetail id={assetInfo?._id} />
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
            <Link href={`/portal/${assetInfo._id}/frac`}>
              <Button
                style={{
                  backgroundColor: "#87d068",
                  color: "white",
                  margin: "30px 0px 15px",
                }}
                block
                size="middle"
              >
                TOKENIZE NFT
              </Button>
            </Link>
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

export default MintedAsset;
