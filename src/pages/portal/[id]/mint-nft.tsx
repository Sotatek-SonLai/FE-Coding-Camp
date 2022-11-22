import React, {useEffect, useState} from "react";
import {Typography, Button, Divider, Form, Input, Upload, message, Row, Col, Image as Img, Space} from 'antd';

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
import {awaitTimeout} from "../../../utils/utility";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};


const NewLandPage: React.FC<any> = (props) => {
    const {publicKey, connected, sendTransaction} = useWallet()
    const wallet = useAnchorWallet();
    const {assetData} = props.pageProps
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm()

    // useEffect(() =>{
    //
    // })

    const mint = async () => {
        try {
            const provider = getProvider(wallet);
            if (provider && publicKey) {
                const program = new mainProgram(provider)
                const [txToBase64, err]: any = await program.getSerializedTx(publicKey)
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



                    // setInterval(async () => {
                    //     const result = await program._provider.connection.getSignatureStatus(tx, {
                    //         searchTransactionHistory: true,
                    //     });
                    //     console.log('sldlsdksd',  result.value)
                    //     // confirmationStatus : "confirmed"
                    // }, 1000)

                }
            }
        } catch (err: any) {
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
            <Button onClick={mint}>Mint</Button>
            <Row>
                <Col span={12} offset={6}>
                    <div className='box'>
                        <Title level={2} style={{textAlign: 'center'}}>Request Mint NFT</Title>
                        <br/>

                        <div className="flex justify-center">
                            <Img
                                width={150}
                                src={`${assetData?.avatar.host}${assetData?.avatar.url}`}
                            />
                        </div>

                        <Form
                            form={form}
                            labelCol={{span: 24}}
                            wrapperCol={{span: 24}}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            layout='horizontal'
                        >
                            <br/>

                            <Divider orientation="center" orientationMargin="0">Information</Divider>

                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[{required: true, message: 'This field cannot be empty.'}]}
                            >
                                <Input placeholder='Input Address'/>
                            </Form.Item>

                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{required: true, message: 'This field cannot be empty.'}]}
                            >
                                <Input placeholder='Input Name'/>
                            </Form.Item>


                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[{required: true, message: 'This field cannot be empty.'}]}
                            >
                                <Input.TextArea placeholder='Input Description' rows={6}/>
                            </Form.Item>

                            <Form.Item
                                label="external url"
                                name="externalUrl"
                                rules={[{required: true, message: 'This field cannot be empty.'}]}
                            >
                                <Input/>
                            </Form.Item>


                            <Form.Item
                                label="animation url"
                                name="animationUrl"
                                rules={[{required: true, message: 'This field cannot be empty.'}]}
                            >
                                <Input/>
                            </Form.Item>


                            <Form.Item
                                label="youtube url"
                                name="youtubeUrl"
                                rules={[{required: true, message: 'This field cannot be empty.'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label="Attribute"
                                name="attribute"
                                rules={[{required: true, message: 'This field cannot be empty.'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Divider orientation="center" orientationMargin="0"></Divider>

                            <div className="flex justify-center">
                                <Button type="primary" htmlType="submit">
                                    Mint NFT
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default NewLandPage

export async function getStaticPaths(context: any) {
    const [res]: any = await EvaluationService.getDetail(context?.params?.id)
    return {
        paths: [{params: {id: res?._id}}, {params: {id: '2'}}],
        fallback: false, // can also be true or 'blocking'
    }
}

export async function getStaticProps(context: any) {
    console.log('-----------------', context)
    const [res]: any = await EvaluationService.getDetail(context?.params?.id)
    return {
        props: {
            assetData: res
        }, // will be passed to the page component as props
    }
}
