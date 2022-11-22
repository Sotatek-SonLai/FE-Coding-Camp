import { Table, Tabs, Button, Space, Row, Col, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import React from "react";
import { AssetType } from "../../types";
import Link from "next/link";
const { Title } = Typography;

const PortalPage = () => {
  return (
    <div>
      <Row>
        <Col span={8}>
          <img src="https://joeschmoe.io/api/v1/random" />
        </Col>
        <Col span={16}>
          <div>
            <span></span>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PortalPage;
