import { Table, Tabs, Button, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { ReactElement, useState } from "react";
import {
    passedAssetColumns,
    PassedAssetDataType,
    requestAssetColumns,
    RequestAssetDataType,
} from "../../components/PortalEvaluationPage/AssestTable";
import Link from "next/link";
import EvaluationService from "../../service/evaluation.service";
import MainLayout from "../../components/Main-Layout";
import { NextPageWithLayout } from "../_app";
const { Title } = Typography;

const requestAssetData: RequestAssetDataType[] = [
    {
        id: "1",
        propertyInfo: "https://joeschmoe.io/api/v1/random",
        name: "ABC",
        totalSupply: 100000,
        tokenPrice: 0.0001,
        status: "pending",
        action: "Fractionalize",
        detail: "Detail",
    },
    {
        id: "2",
        propertyInfo: "https://joeschmoe.io/api/v1/random",
        name: "Trinh Thi Thu Trang Trinh Thi Thu Trang Trinh Thi Thu Trang",
        totalSupply: 1000000000,
        tokenPrice: 0.001,
        status: "rejected",
        action: "Fractionalize",
        detail: "Detail",
    },
];

const passedAssetData: PassedAssetDataType[] = [
    {
        id: "1",
        propertyInfo: "https://joeschmoe.io/api/v1/random",
        name: "ABC",
        totalSupply: 100000,
        tokenPrice: 0.0001,
        status: "fractionalize",
        payRewardDate: "",
        action: "Listing",
        detail: "Detail",
    },
    {
        id: "2",
        propertyInfo: "https://joeschmoe.io/api/v1/random",
        name: "Trinh Thi Thu Trang Trinh Thi Thu Trang Trinh Thi Thu Trang",
        totalSupply: 1000000000,
        tokenPrice: 0.001,
        status: "listed",
        payRewardDate: "11/11/2022",
        action: "Deposit",
        detail: "Detail",
    },
];

const PortalPage:NextPageWithLayout = (props: any) => {
    const { requestAssetData } = props;
    const items = [
        {
            label: "Request Asset",
            key: "request_asset",
            children: (
                <>
                    {requestAssetData && (
                        <Table
                            dataSource={requestAssetData}
                            columns={requestAssetColumns}
                            rowKey="id"
                            pagination={{ pageSize: 6 }}
                        />
                    )}
                </>
            ),
        },
        {
            label: "Passed Asset",
            key: "passed_asset",
            children: (
                <Table
                    dataSource={passedAssetData}
                    columns={passedAssetColumns}
                    rowKey="id"
                />
            ),
        },
    ];

    return (
        <div>
            <Title level={2}>Portfolio</Title>
            <div>
                <Space style={{ width: "100%" }} direction="vertical" align="end">
                    <Link href="/portal/new" passHref>
                        <Button type="primary" icon={<PlusOutlined />}>
                            Create New Land
                        </Button>
                    </Link>
                </Space>
            </div>
            <Tabs items={items} />
        </div>
    );
};

PortalPage.getLayout = (page: ReactElement) => {
    return <MainLayout>{page}</MainLayout>;
};

export default PortalPage;

export async function getStaticProps(context: any) {
    const [res]: any = await EvaluationService.getLand();
    return {
        props: {
            requestAssetData: res,
        }, // will be passed to the page component as props
    };
}
