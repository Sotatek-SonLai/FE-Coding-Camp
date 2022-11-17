import React, {useState} from "react";
import { Typography, Button, Divider, Form, Input, Upload, message, Row, Col } from 'antd';
const { Title } = Typography;
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { UploadChangeParam } from 'antd/es/upload';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import {onChangePrice, validateEmpty, validateIsNumber} from "../../utils/validate.util";
import {web3} from '@project-serum/anchor'
import {
    createAssociatedTokenAccountInstruction,
    createInitializeMintInstruction,
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
    MINT_SIZE,
} from "@solana/spl-token"
import {useWallet} from "@solana/wallet-adapter-react";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

const NewLandPage: React.FC<any> = (props) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const [projectImgList, setProjectImgList] = useState<UploadFile[]>([]);
    const {getFieldDecorator} = props

    const propPaper: UploadProps = {
        onChange({ file, fileList }) {
            if (file.status !== 'uploading') {
                console.log(file, fileList);
            }
        },
        defaultFileList: [],
    };

    const onFinish = (values: any) => {
        console.log('Success:', values);

    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as RcFile, url => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const onChangeProjectImages: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setProjectImgList(newFileList);
    };


    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as RcFile);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const [form] = Form.useForm()
    const { publicKey, wallet, disconnect } = useWallet();
    const test = async () => {
        if(!wallet) return
        const wallet2 = publicKey?.toBase58()
        console.log({wallet2})
        // console.log('connection', connection)
        if(web3){
            const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
            console.log({connection})
        }

        // const mintKey = anchor.web3.Keypair.generate();
        // const nftTokenAccount = await getAssociatedTokenAddress(mintKey.publicKey, assetOwner.publicKey);


    }


    return (
        <>
            <Title level={2}>Request Form To NFT Your LAND</Title>
            <div className='box'>
                <Form
                    form={form}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Row gutter={[40,20]}>
                        <Col span={12}>
                            <Form.Item
                                label="Avatar"
                                name="avatar"
                                rules={[{ required: true, message: 'Please upload avatar!' }]}
                            >
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                >
                                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                </Upload>
                            </Form.Item>
                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[{ required: true, message: 'This field cannot be empty.' }]}
                            >
                                <Input placeholder='Input Address'/>
                            </Form.Item>

                            <Form.Item
                                label="Token Name"
                                name="tokenName"
                                rules={[{ required: true, message: 'This field cannot be empty.' }]}
                            >
                                <Input placeholder='Input Token Name'/>
                            </Form.Item>

                            <Form.Item
                                required={true}
                                label="Total Supply"
                                name="totalSupply"
                                rules={[
                                    {
                                        validator: async (_, value) => {
                                            await validateEmpty(value);
                                        }
                                    }
                                ]}
                            >
                                <Input
                                    onChange={ async (e: any) => {
                                        onChangePrice(e.target.value, form, "totalSupply")
                                    }}
                                    placeholder='Input Total Supply'/>
                            </Form.Item>

                            <Form.Item
                                required={true}
                                label="Token Price"
                                name="tokenPrice"
                                rules={[
                                    {
                                        validator: async (_, value) => {
                                            await validateEmpty(value);
                                        }
                                    }
                                ]}
                            >
                                <Input
                                    onChange={ async (e: any) => {
                                        onChangePrice(e.target.value, form, "tokenPrice")
                                    }}
                                    placeholder='Input Token Price'/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>

                            <Form.Item
                                label="Project Description"
                                name="description"
                                rules={[{ required: true, message: 'This field cannot be empty.' }]}
                            >
                                <Input.TextArea placeholder='Input Description' rows={6} />
                            </Form.Item>

                            <Divider orientation="center" orientationMargin="0">Project Images</Divider>
                            <Form.Item
                                label="Images"
                                name="projectImages"
                                rules={[{ required: true, message: 'This field cannot be empty.' }]}
                            >
                                <Upload
                                    listType="picture-card"
                                    fileList={projectImgList}
                                    onChange={onChangeProjectImages}
                                    onPreview={onPreview}
                                >
                                    {projectImgList.length < 5 && '+ Upload'}
                                </Upload>
                            </Form.Item>
                            <Divider orientation="center" orientationMargin="0">Legal Papers</Divider>
                            <Form.Item
                                label="Docs"
                                name="LegalPapers"
                                rules={[{ required: true, message: 'This field cannot be empty.' }]}
                            >
                                <Upload {...propPaper}>
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit Land
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    )
}

export default NewLandPage
