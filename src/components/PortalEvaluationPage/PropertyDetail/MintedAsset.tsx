import React from "react";
import { Affix, Button, Col, Divider, Row, Tag, Typography } from "antd";
import AssetInfo from "../AssetInfo";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import Link from "next/link";
import ButtonDeleteDetail from "../../common/button/ButtonDeleteDetail";
import ContactInfo from "./ContactInfo"

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
          <ButtonDeleteDetail id={assetInfo?._id}/>
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

export default MintedAsset;
