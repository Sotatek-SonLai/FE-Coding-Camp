import React, {ReactElement, useEffect, useState} from "react";
import {Typography, Button, Divider, Form, Empty, Input, Upload, message, Row, Col, Image as Img, Space, Carousel} from 'antd';
import type {RcFile} from 'antd/es/upload/interface';
import {onChangePrice} from "../../../utils/validate.util";
import {useAnchorWallet, useWallet} from "@solana/wallet-adapter-react";
import EvaluationService from "../../../service/evaluation.service";
import {getProvider} from "../../../programs/utils";
import mainProgram from "../../../programs/MainProgram";
import {getUrl} from "../../../utils/utility";
import MainLayout from "../../../components/Main-Layout";
import {NextPageWithLayout} from "../../_app";
import {useRouter} from "next/router";
import TransactionModal from "../../../components/common/TransactionModal";
import {Transaction} from "@solana/web3.js";
const {Title} = Typography;

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
    const router = useRouter()
    const [tx, setTx] = useState<any>('')
    const [isShownModalTx, setIsShownModalTx] = useState<boolean>(false)

    useEffect(() => {
        (async () => {
            if (router?.query?.id) {
                const [res]: any = await EvaluationService.getDetail(router?.query?.id)
                if (!res?.error) {
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

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        try {
            const provider = getProvider(wallet);
            if (provider && publicKey) {
                setLoading(true)
                const [res]: any = await EvaluationService.frac( assetInfo?._id, {
                    tokenName: values.tokenName,
                    tokenSymbol: values.tokenSymbol,
                    tokenSupply: values.tokenSupply.replace(/,/g, "")
                })
                console.log({res})
                const program = new mainProgram(provider)
                const [txToBase64, err]: any = await program.fractionalToken('', '', '')


                if(!err){
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

                        const result: any = await program._provider.connection.sendRawTransaction(txToBase64);
                        console.log('result value: ', result?.value)
                        // confirmationStatus : "confirmed"
                        if (result?.value?.confirmationStatus === 'confirmed') {
                            message.success('Tokenize nft successfully')
                            clearInterval(flagInterval)

                            setLoading(false)
                            // router.push(`/portal/${assetInfo?._id}/tokenize`).then()
                        }
                    }, 1000)
                    setLoading(false)

                }

                setLoading(false)
            }
        } catch (error: any) {
            console.log({error})
            error?.message && message.error(error?.message)
            setLoading(false)
        }

    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <>
            <TransactionModal close={() => setIsShownModalTx(false)} tx={tx} isShown={isShownModalTx}/>
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