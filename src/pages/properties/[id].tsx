import {
  Table,
  Tabs,
  Button,
  Space,
  Row,
  Col,
  Typography,
  Divider,
  Avatar,
  Carousel,
  Form,
  Input,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import React, { ReactElement, useEffect, useState } from "react";
import { AssetType } from "../../types";
import Link from "next/link";
const { Title } = Typography;
import style from "./style.module.scss";
import MainLayout from "../../components/Main-Layout";
import NewLandPage from "../portal/new";
import { NextPageWithLayout } from "../_app";
import { useRouter } from "next/router";
import EvaluationService from "../../service/evaluation.service";
import { getUrl } from "../../utils/utility";

export const configCarousel = {
  arrows: true,
  slidesToShow: 5,
  infinite: false,
  slidesToScroll: 5,
  responsive: [
    {
      breakpoint: 1440,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 1016,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 699,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
  nextArrow: (
    <div>
      <img src="/icons/arrow-right.svg" alt="" />
    </div>
  ),
  prevArrow: (
    <div>
      <img src="/icons/arrow-left.svg" alt="" />
    </div>
  ),
};
const PortalPage: NextPageWithLayout = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = router?.query;
  const [assetInfo, setAssetInfo] = useState<any>(null);

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    (async () => {
      if (id) {
        const [res]: any = await EvaluationService.getDetail(router?.query?.id);
        if (!res?.error) {
          setAssetInfo(res);
        } else {
          message.error(res?.error?.message);
        }
      }
    })();
  }, [id]);

  return (
    <div className={style.assetDetailContainer}>
      <Row gutter={[20, 0]}>
        <Col span={8}>
          <div className="box info--left">
            <div className="info--left__general">
              <Avatar className="logo" src={getUrl(assetInfo?.avatar)} />
              <p className="token--name">Token Name: {assetInfo?.tokenName}</p>
              <p className="address">Address: {assetInfo?.address}</p>
              <p className="address">ID: {assetInfo?.ID}</p>
            </div>
            <Divider orientation="left">Buy </Divider>
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
                label="Buy Amount(1 USDT = 20 ABC)"
                name="amount"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Input />
              </Form.Item>
              <p className="available--balance">
                Available Balance: 97,420,234.49 USDC
              </p>
              <div className="you--receive">
                <p className="key">You Receive</p>
                <p className="value">0.05 ABC</p>
              </div>
              <div className="actions">
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "50%" }}
                >
                  Buy
                </Button>
              </div>
            </Form>
            <Divider orientation="left">Claim </Divider>
            <div className="you--receive">
              <p className="key">Your Monthly Reward</p>
              <p className="value">100 USDT</p>
            </div>
            <div className="actions">
              <Button type="primary" htmlType="submit" style={{ width: "50%" }}>
                Claim
              </Button>
            </div>
          </div>
        </Col>
        <Col span={16}>
          <div className="box info--right">
            <Row>
              <Col span={8}>
                <p className="key">Token Total Supply</p>
                <p className="value">{assetInfo?.tokenSupply}</p>
              </Col>
              <Col span={8}>
                <p className="key">Token Listing Price</p>
                <p className="value">$0.05</p>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <p className="key">Token Listing Date</p>
                <p className="value">30/1/2022</p>
              </Col>
              <Col span={8}>
                <p className="key">Total Token Remain</p>
                <p className="value">10,000,000</p>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <p className="key">Claim Reward Date</p>
                <p className="value">5/1 monthly</p>
              </Col>
              <Col span={8}>
                <p className="key">Reward Monthly</p>
                <p className="value">10.000 USDT</p>
              </Col>
            </Row>
            <Divider orientation="left">Project Description </Divider>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <Divider orientation="left">Project Images:</Divider>
            <div className="rowSlide">
              <div className="slide">
                <Carousel {...configCarousel}>
                  {assetInfo?.projectImages.map((item: any, index: number) => {
                    return (
                      <img
                        className="logo"
                        src={getUrl(item)}
                        style={{ width: 100, height: 100 }}
                        key={index}
                      />
                    );
                  })}
                </Carousel>
              </div>
            </div>
            <Divider orientation="left">Leagal Papers::</Divider>
            <div className="rowSlide">
              <div className="slide">
                <Carousel {...configCarousel}>
                  {assetInfo?.certificates.map((item: any, index: number) => {
                    return (
                      <img
                        className="logo"
                        src={getUrl(item)}
                        style={{ width: 100, height: 100 }}
                        key={index}
                      />
                    );
                  })}
                </Carousel>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PortalPage;

PortalPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};
