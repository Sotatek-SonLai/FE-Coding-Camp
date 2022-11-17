import React, {useState} from "react";
import { Typography, Button, Divider, Form, Input, Upload, message } from 'antd';
const { Title } = Typography;
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { UploadChangeParam } from 'antd/es/upload';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

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

const NewLandPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const [projectImgList, setProjectImgList] = useState<UploadFile[]>([]);

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

    return (
        <>
            <Title level={2}>Request Form To NFT Your LAND</Title>
            <div className='box'>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
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
                        label="Total Supply"
                        name="totalSupply"
                        rules={[{ required: true, message: 'This field cannot be empty.' }]}
                    >
                        <Input placeholder='Input Total Supply'/>
                    </Form.Item>

                    <Form.Item
                        label="Token Price"
                        name="tokenPrice"
                        rules={[{ required: true, message: 'This field cannot be empty.' }]}
                    >
                        <Input placeholder='Input Token Price'/>
                    </Form.Item>

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
