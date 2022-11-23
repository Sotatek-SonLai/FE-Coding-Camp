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
import {useRouter} from "next/router";
import {configCarousel} from "../../properties/[id]";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

let flagInterval: NodeJS.Timeout

const MintNftPage: NextPageWithLayout = (props: any) => {
    const {publicKey, connected, sendTransaction} = useWallet()
    const wallet = useAnchorWallet();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm()
    const [assetInfo, setAssetInfo] = useState<any>(null)
    console.log('assetInfo', assetInfo)
    const router = useRouter()

    useEffect(() => {
        (async () => {
            if(router?.query?.id){
                const [res]: any = await EvaluationService.getDetail(router?.query?.id)
                if(!res?.error){
                    setAssetInfo(res)
                } else {
                    message.error(res?.error?.message)
                }
            }
        })()
        return () => {
            clearInterval(flagInterval)
        }
    }, [router?.query?.id])

    const mint = async () => {
        try {
            setLoading(true)
            const provider = getProvider(wallet);
            if (provider && publicKey) {
                const program = new mainProgram(provider)
                const [txToBase64, err]: any = await program.getSerializedTx(assetInfo?.assetUrl, assetInfo?.bigGuardian)
                if (!err) {
                    const [res]: any = await EvaluationService.mintNft(txToBase64)
                    const tx = await sendTransaction(
                        Transaction.from(
                            Buffer.from(res, "base64")
                        ),
                        program._provider.connection,
                        {
                            skipPreflight: true,
                            maxRetries: 5,

                        },
                    );
                    console.log(tx);
                    console.log('started await')


                    flagInterval = setInterval(async () => {
                        const result: any = await program._provider.connection.getSignatureStatus(tx, {
                            searchTransactionHistory: true,
                        });
                        console.log('result value: ', result.value)
                        // confirmationStatus : "confirmed"
                        if (result?.value?.confirmationStatus === 'confirmed') {
                            message.success('Mint nft successfully')
                            clearInterval(flagInterval)

                            setLoading(false)
                            router.push(`/portal/${assetInfo?._id}/tokenize-nft`).then()
                        }
                    }, 1000)
                    setLoading(false)

                }
            }
        } catch (err: any) {
            setLoading(false)
            console.log({err})
        }
    }

    const onFinish = async (values: any) => {
        console.log('Success:', values);

    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Row className='justify-center'>
                <Col xxl={12} md={20} xs={24}>
                    <div className='box'>
                        <Title level={2} style={{textAlign: 'center'}}>Request Mint NFT</Title>
                        <br/>

                        <div className="flex justify-center">
                            <Img
                                width={150}
                                src={getUrl(assetInfo?.avatar)}
                            />
                        </div>

                        <br/>

                        <Divider orientation="center" orientationMargin="0">Information</Divider>

                        <Title level={4}>Address: {assetInfo?.address}</Title>
                        <Title level={4}>description: {assetInfo?.description}</Title>
                        <Title level={4}>External Url: {assetInfo?.externalUrl}</Title>
                        <Title level={4}>Youtube Url: {assetInfo?.youtubeUrl}</Title>

                        <Divider orientation="center" orientationMargin="0">Attributes</Divider>
                        {(assetInfo?.attributes && assetInfo?.attributes.length) ? <table className='tbl' style={{width: '100%'}}>
                            <tr>
                                <th>key</th>
                                <th>value</th>
                            </tr>
                            {assetInfo?.attributes.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td>{item.key}</td>
                                    <td>{item.value}</td>
                                </tr>
                            ))}
                        </table> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
                        <Divider orientation="center" orientationMargin="0">Product Images</Divider>
                        <div className="rowSlide">
                            <div className="slide">
                                {(assetInfo?.productImages && assetInfo?.productImages.length) ? <Carousel {...configCarousel}>
                                    {assetInfo?.productImages?.map((item: any, index: any) => {
                                        return (
                                            <img
                                                className="logo"
                                                src={getUrl(item)}
                                                style={{width: 100, height: 100}}
                                                key={index}
                                            />
                                        );
                                    })}
                                </Carousel> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
                            </div>
                        </div>
                        <br/>
                        <Divider orientation="center" orientationMargin="0">Legal Paper</Divider>
                        <div className="rowSlide">
                            <div className="slide">
                                {(assetInfo?.certificates && assetInfo?.certificates.length) ? <Carousel {...configCarousel}>
                                    {assetInfo?.certificates.map((item: any, index: any) => {
                                        return (
                                            <img
                                                className="logo"
                                                src={getUrl(item)}
                                                style={{width: 100, height: 100}}
                                                key={index}
                                            />
                                        );
                                    })}
                                </Carousel> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
                            </div>
                        </div>

                        <Divider orientation="center" orientationMargin="0"></Divider>

                        <div className="flex justify-center">
                            <Button type="primary" onClick={mint} loading={loading}>
                                Mint NFT
                            </Button>
                        </div>
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
