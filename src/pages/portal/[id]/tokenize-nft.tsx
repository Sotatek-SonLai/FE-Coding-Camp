import React, {ReactElement, useEffect, useState} from "react";
import {Typography, Button, Divider, Form, Empty, Input, Upload, message, Row, Col, Image as Img, Space, Carousel} from 'antd';

const {Title} = Typography;
import type {RcFile, UploadFile, UploadProps} from 'antd/es/upload/interface';
import type {UploadChangeParam} from 'antd/es/upload';
import {LoadingOutlined, PlusOutlined, UploadOutlined} from '@ant-design/icons';
import {onChangePrice, validateEmpty, validateIsNumber} from "../../../utils/validate.util";

import {useAnchorWallet, useWallet} from "@solana/wallet-adapter-react";
import EvaluationService from "../../../service/evaluation.service";
import * as anchor from "@project-serum/anchor";
import {getProvider} from "../../../programs/utils";
import mainProgram from "../../../programs/MainProgram";
import {Transaction} from "@solana/web3.js";
import {awaitTimeout, getUrl} from "../../../utils/utility";
import MainLayout from "../../../components/Main-Layout";
import PortalPage from "../index";
import {NextPageWithLayout} from "../../_app";
import {configCarousel} from "../../properties/utils";
import {useRouter} from "next/router";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

let flagInterval: NodeJS.Timeout

const MintNftPage: NextPageWithLayout = (props: any) => {
    console.log('assetData', props)
    const {assetData} = props
    const {publicKey, connected, sendTransaction} = useWallet()
    const wallet = useAnchorWallet();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm()
    const [assetInfo] = useState<any>(assetData)
    console.log('assetInfo', assetInfo)
    const router = useRouter()

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        try {
            const provider = getProvider(wallet);
            if (provider && publicKey) {
                const program = new mainProgram(provider)
                const [txToBase64, err]: any = await program.fractionalToken('', '', '')

            }
        } catch (e: any) {

        }

    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <>
            <Row className='justify-center'>
                <Col xxl={12} md={20} xs={24}>
                    <div className='box'>
                        <Title level={2} style={{textAlign: 'center'}}>Tokenize NFT</Title>
                        <br/>

                        <div className="flex justify-center">
                            <Img
                                width={150}
                                src={getUrl(assetInfo?.avatar)}
                            />
                        </div>

                        <br/>

                        <Divider orientation="center" orientationMargin="0"></Divider>

                        <Form
                            form={form}
                            labelCol={{span: 24}}
                            wrapperCol={{span: 24}}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Token Name"
                                name="tokenName"
                                rules={[{required: true, message: 'This field cannot be empty.'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label="Token Symbol"
                                name="tokenSymbol"
                                rules={[{required: true, message: 'This field cannot be empty.'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label="Token Supply"
                                name="tokenSupply"
                                rules={[{required: true, message: 'This field cannot be empty.'}]}
                            >
                                <Input
                                    onChange={async (e: any) => {
                                        onChangePrice({val: e.target.value, form, fieldName: "tokenSupply"})
                                    }}
                                />
                            </Form.Item>

                            <br/>

                            <Divider orientation="center" orientationMargin="0"></Divider>

                            <div className="flex justify-center">
                                <Button loading={loading} type="primary" htmlType="submit">
                                    Tokenize
                                </Button>
                            </div>
                        </Form>

                    </div>
                </Col>
            </Row>
        </>
    )
}

export default MintNftPage

MintNftPage.getLayout = (page: ReactElement) => {
    return <MainLayout>{page}</MainLayout>;
};


export async function getStaticPaths(context: any) {
    const [res]: any = await EvaluationService.getDetail(context?.params?.id)
    return {
        paths: [{params: {id: '637b4f7607cfae931087352f'}}, {params: {id: '2'}}],
        fallback: 'blocking', // can also be true or 'blocking'
    }
}

export async function getStaticProps(context: any) {
    const [res]: any = await EvaluationService.getDetail(context?.params?.id)
    return {
        props: {
            assetData: res
        }, // will be passed to the page component as props
    }
}
