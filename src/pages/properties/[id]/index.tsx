import {
  Row,
  Col,
  Typography,
  Divider,
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
import { DATE_FORMAT } from "../../../constants";

const { Title, Text } = Typography;
interface DataType {
  name: string;
  value: string;
}

const PortalPage: NextPageWithLayout = () => {
  const [assetInfo, setAssetInfo] = useState<any>({});
  const [checkpoints, setCheckpoints] = useState<any>([]);
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
    if (id) {
      fetchGetDetail();
      fetchGetCheckpoints();
    }
  }, [id]);

  const fetchGetDetail = async () => {
    if (id) {
      const [res]: any = await EvaluationService.getDetail(id);
      if (!res?.error) {
        setAssetInfo(res);
      } else {
        message.error(res?.error?.message);
      }
    }
  };

  const fetchGetCheckpoints = async () => {
    if (id) {
      const [res]: any = await EvaluationService.getAllCheckpoints(id);
      if (!res?.error) {
        setCheckpoints(res?.data);
      } else {
        message.error(res?.error?.message);
      }
    }
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
            <Title level={4}>Description</Title>{" "}
          </Divider>
          <Descriptions column={1} colon={false} bordered={true}>
            <Descriptions.Item
              label={<span className="description-label">NFT Name</span>}
            >
              <span className="description-value">{assetInfo?.nftName}</span>
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="description-label">Address</span>}
            >
              <span className="description-value">{assetInfo?.address}</span>
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="description-label">email</span>}
            >
              <span className="description-value">{assetInfo?.email}</span>
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className="description-label">phone</span>}
            >
              <span className="description-value">{assetInfo?.phone}</span>
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
        </Col>
      </Row>
      <br />
      <Row gutter={[30, 0]}>
        <Col span={10}>
          <Divider orientation="left">
            <Title level={4}>Legal Papers</Title>
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
            <Title level={4}>Project Images</Title>
          </Divider>
          {assetInfo.projectImages ? (
            <CarouselCustom imagesData={assetInfo.projectImages} />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Col>
      </Row>
      <Row gutter={[30, 0]}>
        <Col span={10}>
          <Divider orientation="left">
            <Title level={4}>Attributes</Title>
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
        <Col span={14}>
          <Divider orientation="left" orientationMargin={50}>
            <Title level={4}>Token Info</Title>
          </Divider>
          <Row gutter={[30, 0]}>
            <div style={{ marginLeft: 30 }}>
              <Descriptions
                layout="vertical"
                colon={false}
                column={3}
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
                  label={
                    <span className="description-label">Token Symbol</span>
                  }
                >
                  <Text strong className="description-value">
                    {assetInfo.tokenSymbol}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span className="description-label">
                      Token Total Supply
                    </span>
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
                  label={
                    <span className="description-label">Listing Date</span>
                  }
                >
                  <Text strong className="description-value">
                    {moment(assetInfo.updatedAt).format(DATE_FORMAT)}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Row>
        </Col>
      </Row>
      <Divider orientation="left">
        <Title level={4}>Checkpoint List</Title>
      </Divider>
      <CreateCheckpoint
        onDone={() => fetchGetCheckpoints()}
        propertyInfo={assetInfo}
      />
      <br /> <br />
      <CheckpointTable data={checkpoints} />
    </div>
  );
};

export default PortalPage;

PortalPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};
