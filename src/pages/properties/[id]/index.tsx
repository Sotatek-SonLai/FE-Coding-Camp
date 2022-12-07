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
  Empty,
  Table,
} from "antd";
import React, { ReactElement, useEffect, useState } from "react";
import MainLayout from "../../../components/Main-Layout";
import { NextPageWithLayout } from "../../_app";
import { useRouter } from "next/router";
import EvaluationService from "../../../service/evaluation.service";
import { getUrl } from "../../../utils/utility";
import CarouselCustom from "../../../components/common/CarouselCustom";
import CheckpointTable from "../../../components/PropertyPage/CheckpointTable";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";

const { Title, Text } = Typography;
interface DataType {
  name: string;
  value: string;
}

let flagInterval: NodeJS.Timeout;

const PortalPage: NextPageWithLayout = () => {
  const [form] = Form.useForm();
  const [assetInfo, setAssetInfo] = useState<any>({});
  const router = useRouter();
  const id = router?.query?.id;

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "key",
    },
    {
      title: "Value",
      dataIndex: "value",
    },
  ];

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

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const DescriptionsItem = (label: string, value: string) => {
    return (
      <Descriptions.Item
        label={<span className="description-label">{label}</span>}
      >
        <Text strong className="description-value">
          {value}
        </Text>
      </Descriptions.Item>
    );
  };

  return (
    <div className="box">
      <Row gutter={[30, 0]}>
        <Col span={10}>
          <div
            style={{
              backgroundImage: `url(${getUrl(assetInfo.avatar)})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              height: "100%",
              borderRadius: 10,
            }}
          ></div>
        </Col>
        <Col span={14}>
          <Divider orientation="left" style={{ marginTop: 0 }}>
            <Title level={5}>Description</Title>{" "}
          </Divider>
          <Descriptions column={1} colon={false} bordered={true}>
            <Descriptions.Item
              label={<span className="description-label">Address</span>}
            >
              <span className="description-value">{assetInfo?.address}</span>
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="description-label">Description</span>}
            >
              <span className="description-value">
                {assetInfo?.description}
              </span>
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="description-label">External Url</span>}
            >
              <a
                className="description-value"
                rel="noreferrer"
                href={assetInfo?.externalUrl}
                target="_blank"
              >
                {assetInfo?.externalUrl}
              </a>
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="description-label">Youtube Url</span>}
            >
              <a
                className="description-value"
                rel="noreferrer"
                href={assetInfo?.youtubeUrl}
                target="_blank"
              >
                {assetInfo?.youtubeUrl}
              </a>
            </Descriptions.Item>
          </Descriptions>
          <Divider orientation="left">
            Attributes
          </Divider>

          {assetInfo?.attributes && assetInfo?.attributes.length ? (
            <Table
              columns={columns}
              dataSource={assetInfo?.attributes}
              bordered
              pagination={false}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Col>
      </Row>
      <br />
      <Row gutter={[30, 0]}>
        <Col span={10}>
          <Divider orientation="left">
            <Title level={5}>Legal Papers</Title>
          </Divider>
          {!!assetInfo?.certificates && assetInfo?.certificates?.length > 0 ? (
            assetInfo?.certificates.map((item: any, index: number) => (
              <div className="file__container" key={index}>
                <p>{item?.name}</p>
                <a href={getUrl(item)} rel="noreferrer" target="_blank">
                  <img src="https://ovenuedev.sotatek.works/images/icon/asset/download.svg" />
                </a>
              </div>
            ))
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Col>
        <Col span={14}>
          <Divider orientation="left">
            <Title level={5}>Project Images</Title>
          </Divider>
          {assetInfo.projectImages ? (
            <CarouselCustom imagesData={assetInfo.projectImages} />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Col>
      </Row>
      <Divider orientation="left" orientationMargin={50}>
        <Title level={2}>Token Info</Title>
      </Divider>
      <Row gutter={[30, 0]}>
        <Col span={14}>
          <div>
            <Descriptions
              layout="vertical"
              colon={false}
              column={3}
              style={{ marginTop: 30 }}
              className="description-large"
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
                  {assetInfo.tokenSupply?.toLocaleString("en")}
                </Text>
              </Descriptions.Item>
              {/* <Descriptions.Item
                label={
                  <span className="description-label">Token Listing Price</span>
                }
              >
                <Text strong className="description-value">
                  $0.05
                </Text>
              </Descriptions.Item> */}
              <Descriptions.Item
                label={<span className="description-label">Listing Date</span>}
              >
                <Text strong className="description-value">
                  {moment(assetInfo.updatedAt).format("DD/MM/YYYY")}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Col>
        <Col span={10}>
          <div
            style={{
              borderRadius: 8,
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              border: "rgba(149, 157, 165, 0.2) solid 1px",
              padding: "30px 35px",
              marginTop: 20,
            }}
          >
            <Divider orientation="left">
              Buy {assetInfo?.tokenSymbol} (1 USDT = 20 {assetInfo?.tokenSymbol}
              ){" "}
            </Divider>
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
                style={{ marginBottom: 10 }}
              >
                <Input />
              </Form.Item>
              <Text style={{ color: "var(--text-color)" }}>
                Available Balance: 97,420,234.49 USDC
              </Text>
              <br />
              <br />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text style={{ color: "var(--text-color)" }}>You Receive</Text>
                <Text strong>0.05 ABC</Text>
              </div>
              <br />
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ width: "100%" }}
              >
                Buy
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
      <br /> <br /> <br />
      <Divider orientation="left" orientationMargin={50}>
        <Title level={2}>Checkpoint List</Title>
      </Divider>
      <CheckpointTable />
    </div>
  );
};

export default PortalPage;

PortalPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};
