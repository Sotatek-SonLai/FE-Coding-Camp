import React from "react";
import { Affix, Button, Col, Divider, Row, Tag, Typography } from "antd";
import Link from "next/link";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import moment from "moment";
import { DATE_TIME_FORMAT } from "../../../constants"

const { Title, Text } = Typography;

const ContactInfo: React.FC<{ assetInfo: any }> = ({ assetInfo }) => {
  return (
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
          Approved on {moment(assetInfo?.updatedAt).format(DATE_TIME_FORMAT)}
        </Text>
        <Link href={`/portal/${assetInfo._id}/frac`}>
          <Button
            style={{
              backgroundColor: "#87d068",
              color: "white",
              margin: "30px 0px 0px 0px",
            }}
            block
            size="middle"
          >
            TOKENIZED NFT
          </Button>
        </Link>
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
            <Text style={{ color: " var(--text-color)" }}> {assetInfo?.phone}</Text>
          </Col>
          <Col span={12}>
            <MailOutlined />
            <Text style={{ color: " var(--text-color)" }}>
              {" "}{assetInfo?.email}
            </Text>
          </Col>
        </Row>
      </div>
    </Affix>
  );
};

export default ContactInfo;