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
import ContactInfo from "./ContactInfo"

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
        <ContactInfo assetInfo={assetInfo} />
      </Col>
    </Row>
  );
};

export default TokenizedAsset;
