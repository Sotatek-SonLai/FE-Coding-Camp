import { Button, message } from "antd";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import EvaluationService from "../../../service/evaluation.service";
import MainLayout from "../../../components/Main-Layout";
import { NextPageWithLayout } from "../../_app";
import PropertyDetail from "../../../components/PropertyDetail";
import { ArrowLeftOutlined } from "@ant-design/icons";

let flagInterval: NodeJS.Timeout;

const DetailNftPage: NextPageWithLayout = () => {
  const [assetInfo, setAssetInfo] = useState<any>({});
  const router = useRouter();
  const id = router?.query?.id;
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

  console.log({ assetInfo });

  return (
    <>
      <Button
        type="ghost"
        shape="circle"
        size="large"
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 20 }}
        onClick={() => router.back()}
      />
      <PropertyDetail assetInfo={assetInfo} type={assetInfo.status} />
    </>
  );
};

export default DetailNftPage;

DetailNftPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

{
  /* 

            <div className="box" style={{ marginTop: 20 }}>
            <Divider orientation="left">Buy ABC (1 USDT = 20 ABC) </Divider>
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
                style={{ marginBottom: 5 }}
              >
                <Input />
              </Form.Item>
              <p style={{ fontSize: 14, color: "var(--text-color)" }}>
                Available Balance: 97,420,234.49 USDC
              </p>
              <ReceiveInfo>
                <p style={{ color: "var(--text-color)" }}>You Receive</p>
                <p style={{ fontSize: 15, fontWeight: 600 }}>0.05 ABC</p>
              </ReceiveInfo>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Buy
              </Button>
            </Form>
       */
}
