import React, { ReactElement, useEffect, useState } from "react";
import {
  Typography,
  Button,
  Divider,
  Form,
  Empty,
  Input,
  Upload,
  message,
  Row,
  Col,
  Image as Img,
  Space,
  Carousel,
} from "antd";

const { Title } = Typography;
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { ArrowRightOutlined, CloseOutlined } from "@ant-design/icons";
import Link from "next/link";

import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import EvaluationService from "../../../service/evaluation.service";
import { getProvider } from "../../../programs/utils";
import mainProgram from "../../../programs/MainProgram";
import { Transaction } from "@solana/web3.js";
import { awaitTimeout, getUrl } from "../../../utils/utility";
import MainLayout from "../../../components/Main-Layout";
import PortalPage from "../index";
import { NextPageWithLayout } from "../../_app";
import { useRouter } from "next/router";
import { configCarousel } from "../../properties/[id]";
import TransactionModal from "../../../components/common/TransactionModal";
import AssetInfo from "../../../components/PortalEvaluationPage/AssetInfo";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

let flagInterval: NodeJS.Timeout;

const MintNftPage: NextPageWithLayout = (props: any) => {
  const { publicKey, connected, sendTransaction } = useWallet();
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [assetInfo, setAssetInfo] = useState<any>(null);
  console.log("assetInfo", assetInfo);
  const router = useRouter();

  const [tx, setTx] = useState<any>("");
  const [isShownModalTx, setIsShownModalTx] = useState<boolean>(false);
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

  const mint = async () => {
    try {
      setLoading(true);
      const provider = getProvider(wallet);
      if (provider && publicKey) {
        const program = new mainProgram(provider);
        const [txToBase64, err, metadataAddress, mintKey]: any =
          await program.mintNft(assetInfo?.assetUrl, assetInfo?.bigGuardian);
        if (!err) {
          const [resUMetaDt]: any = await EvaluationService.updateAssetMetadata(
            assetInfo?._id,
            {
              assetMetadata: metadataAddress,
              mintKey: mintKey.publicKey.toBase58(),
            }
          );
          console.log("resUMetaDt", resUMetaDt);
          const [res]: any = await EvaluationService.mintNft(txToBase64, id);
          const tx = await sendTransaction(
            Transaction.from(Buffer.from(res, "base64")),
            program._provider.connection,
            {
              skipPreflight: true,
              maxRetries: 5,
            }
          );
          console.log(tx);
          console.log("started await");

          setTx(tx);

          // flagInterval = setInterval(async () => {
          //     const result: any = await program._provider.connection.getSignatureStatus(tx, {
          //         searchTransactionHistory: true,
          //     });
          //     console.log('result value: ', result.value)
          //     // confirmationStatus : "confirmed"
          //     if (result?.value?.confirmationStatus === 'confirmed') {
          //         message.success('Mint nft successfully')
          //         clearInterval(flagInterval)
          //
          //         setLoading(false)
          //         // router.push(`/portal/${assetInfo?._id}/tokenize`).then()
          //     }
          // }, 1000)
          // setLoading(false)

          //

          const statusCheckInterval = 300;
          const timeout = 90000;
          let isBlockhashValid = true;
          const sleep = (ms: any) => {
            return new Promise((resolve) => setTimeout(resolve, ms));
          };

          const isBlockhashExpired = async (initialBlockHeight: any) => {
            let currentBlockHeight =
              await program._provider.connection.getBlockHeight();
            console.log(currentBlockHeight);
            return currentBlockHeight > initialBlockHeight;
          };

          const inititalBlock = (
            await program._provider.connection.getSignatureStatus(tx)
          ).context.slot;
          let done = false;
          setTimeout(() => {
            if (done) {
              return;
            }
            done = true;
            console.log("Timed out for txid", tx);
            console.log(
              `${
                isBlockhashValid
                  ? "Blockhash not yet expired."
                  : "Blockhash has expired."
              }`
            );
          }, timeout);

          while (!done && isBlockhashValid) {
            const confirmation =
              await program._provider.connection.getSignatureStatus(tx);

            if (
              confirmation.value &&
              (confirmation.value.confirmationStatus === "confirmed" ||
                confirmation.value.confirmationStatus === "finalized")
            ) {
              console.log(
                `Confirmation Status: ${confirmation.value.confirmationStatus}, ${tx}`
              );
              done = true;
              //Run any additional code you'd like with your txId (e.g. notify user of succesful transaction)
            } else {
              console.log(
                `Confirmation Status: ${
                  confirmation.value?.confirmationStatus || "not yet found."
                }`
              );
            }
            isBlockhashValid = !(await isBlockhashExpired(inititalBlock));
            await sleep(statusCheckInterval);
          }

          if (done) {
            setIsShownModalTx(true);
          }
        }
      }
    } catch (err: any) {
      setLoading(false);
      console.log({ err });
    }
  };

  const onFinish = async (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <TransactionModal
        close={() => setIsShownModalTx(false)}
        tx={tx}
        isShown={isShownModalTx}
      >
        <Link href={`/portal/${assetInfo?._id}/frac`}>
          <Button type="primary">
            <ArrowRightOutlined /> Tokenize nft
          </Button>
        </Link>
      </TransactionModal>

      <Row className="justify-center">
        <Col xxl={12} md={20} xs={24}>
          <div className="box">
            <Title level={2} style={{ textAlign: "center" }}>
              New LAND
            </Title>
            <CloseOutlined
              style={{
                fontSize: 20,
                cursor: "pointer",
                position: "absolute",
                top: 30,
                right: 30,
              }}
              onClick={() => router.push("/portal")}
            />
            <br />
            <br />

            <AssetInfo assetInfo={assetInfo} />

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
  );
};

export default MintNftPage;

MintNftPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};
