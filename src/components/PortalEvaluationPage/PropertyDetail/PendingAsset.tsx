import React from "react";
import { Affix, Button, Col, Divider, Row, Tag, Typography } from "antd";
import AssetInfo from "../AssetInfo";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const PendingAsset: React.FC<{ assetInfo: any }> = ({ assetInfo }) => {
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
          {assetInfo.status === "PASSED" && (
            <div className="box">
              <Divider orientation="left" orientationMargin={0}>
                <Text style={{ fontSize: 20 }}>
                  Your property is waiting for approval
                </Text>{" "}
              </Divider>
              <Row gutter={[20, 0]}>
                <Col span={12}>
                  <Button block size="middle" type="primary" ghost>
                    EDIT
                  </Button>
                </Col>
                <Col span={12}>
                  <Button block size="middle" type="primary" ghost danger>
                    Cancel
                  </Button>
                </Col>
              </Row>
              <Divider
                orientation="left"
                orientationMargin={0}
                style={{ marginTop: 40 }}
              >
                <Text style={{ fontSize: 20 }}>Contact this property</Text>
              </Divider>
              <Row>
                <Col span={12}>
                  <PhoneOutlined />
                  <Text> (708) 919-2291</Text>
                </Col>
                <Col span={12}>
                  <MailOutlined />
                  <Text> peter.parker@zylker.com</Text>
                </Col>
              </Row>
            </div>
          )}
        </Affix>
      </Col>
    </Row>
  );
};

export default PendingAsset;
