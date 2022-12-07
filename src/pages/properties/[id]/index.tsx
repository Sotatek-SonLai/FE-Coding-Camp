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
import CreateCheckpoint from "../../../components/PropertyPage/CreateCheckpoint";

const { Title, Text } = Typography;
interface DataType {
  name: string;
  value: string;
}

let flagInterval: NodeJS.Timeout;

const PortalPage: NextPageWithLayout = () => {
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
        const [checkpoints]: any = await EvaluationService.getAllCheckpoints(
          id
        );
        console.log("checkpoints: ", checkpoints);
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
          <Divider orientation="left">Attributes</Divider>

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
                <a href={getUrl(item)}>
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
      </Row>
      <br /> <br /> <br />
      <Row>
        <Col span={21}>
          <Divider orientation="left" orientationMargin={50}>
            <Title level={2}>Checkpoint List</Title>
          </Divider>
        </Col>
        <Col span={3}>
          <CreateCheckpoint propertyInfo={assetInfo} />
        </Col>
      </Row>
      <CheckpointTable />
    </div>
  );
};

export default PortalPage;

PortalPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};
