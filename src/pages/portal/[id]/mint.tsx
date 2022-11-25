import React, {ReactElement, useEffect, useState} from "react";
import {Typography, Button, Divider, Form, Empty, Input, Upload, message, Row, Col, Image as Img, Space, Carousel} from 'antd';
const {Title} = Typography;
import type {RcFile, UploadFile, UploadProps} from 'antd/es/upload/interface';
import {ArrowRightOutlined} from '@ant-design/icons';
import Link from "next/link"

import {useAnchorWallet, useWallet} from "@solana/wallet-adapter-react";
import EvaluationService from "../../../service/evaluation.service";
import {getProvider} from "../../../programs/utils";
import mainProgram from "../../../programs/MainProgram";
import {Transaction} from "@solana/web3.js";
import {awaitTimeout, getUrl} from "../../../utils/utility";
import MainLayout from "../../../components/Main-Layout";
import PortalPage from "../index";
import {NextPageWithLayout} from "../../_app";
import {useRouter} from "next/router";
import {configCarousel} from "../../properties/[id]";
import TransactionModal from "../../../components/common/TransactionModal";
import AssetInfo from "../../../components/PortalEvaluationPage/AssetInfo";

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

    const [tx, setTx] = useState<any>('')
    const [isShownModalTx, setIsShownModalTx] = useState<boolean>(false)

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
                const [txToBase64, err, metadataAddress]: any = await program.mintNft(assetInfo?.assetUrl, assetInfo?.bigGuardian)
                if (!err) {
                    const [resUMetaDt]: any = await EvaluationService.updateAssetMetadata(assetInfo?._id, metadataAddress)
                    console.log('resUMetaDt', resUMetaDt)
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

                    setTx(tx)
                    setIsShownModalTx(true)

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
                            // router.push(`/portal/${assetInfo?._id}/tokenize`).then()
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
            <TransactionModal close={() => setIsShownModalTx(false)} tx={tx}  isShown={isShownModalTx}>
                <Link href={`/portal/${assetInfo?._id}/frac`}>
                    <Button type='primary'><ArrowRightOutlined/> Tokenize nft</Button>
                </Link>
            </TransactionModal>

            <Row className='justify-center'>
                <Col xxl={12} md={20} xs={24}>
                    <div className='box'>
                        <Title level={2} style={{textAlign: 'center'}}>Request Mint NFT</Title>
                        <br/>

                        <AssetInfo assetInfo={assetInfo}/>

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
