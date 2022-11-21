import React, {useState} from "react";
import {Typography, Button, Divider, Form, Input, Upload, message, Row, Col, Image as Img, Space} from 'antd';

const {Title} = Typography;
import type {RcFile, UploadFile, UploadProps} from 'antd/es/upload/interface';
import type {UploadChangeParam} from 'antd/es/upload';
import {LoadingOutlined, PlusOutlined, UploadOutlined} from '@ant-design/icons';
import {onChangePrice, validateEmpty, validateIsNumber} from "../../../utils/validate.util";

import {useWallet} from "@solana/wallet-adapter-react";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};


const TokenizeNftPage: React.FC<any> = (props) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm()


    const onFinish = (values: any) => {
        console.log('Success:', values);

    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <>
            <Row>
                <Col span={12} offset={6}>
                    <div className='box'>
                        <Title level={2} style={{textAlign: 'center'}}>Request Tokenize NFT</Title>
                        <br/>
                        <Form
                            form={form}
                            labelCol={{span: 24}}
                            wrapperCol={{span: 24}}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            layout='horizontal'
                        >
                            <div className="flex justify-center">
                                <Img
                                    width={150}
                                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                />
                            </div>
                            <br/>

                            <Divider orientation="center" orientationMargin="0">Information</Divider>

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
                                        onChangePrice(e.target.value, form, "initialPrice")
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Initial Price"
                                name="initialPrice"
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
                                        onChangePrice(e.target.value, form, "initialPrice")
                                    }}
                                />
                            </Form.Item>

                            <Divider orientation="center" orientationMargin="0"></Divider>

                            <div className="flex justify-center">
                                <Button type="primary" htmlType="submit">
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

export default TokenizeNftPage
