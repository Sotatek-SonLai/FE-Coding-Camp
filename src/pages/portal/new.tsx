import React, { ReactElement, useState } from "react";
import {
  Typography,
  Button,
  Divider,
  Form,
  Input,
  Upload,
  message,
  Row,
  Col,
  Image as CutomImg,
} from "antd";

const { Title } = Typography;
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import type { UploadChangeParam } from "antd/es/upload";
import {
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { toBase64 } from "../../utils/utility";
import EvaluationService, {
  IBodyEvaluation,
} from "../../service/evaluation.service";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import MainLayout from "../../components/Main-Layout";
import PortalPage from "./index";
import ObjectID from "bson-objectid";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const NewLandPage: NextPageWithLayout = (props) => {
  const [loading, setLoading] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [projectImgList, setProjectImgList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const router = useRouter();
  const [attr, setAttr] = useState<any>([
    {
      id: ObjectID(24).toHexString(),
      key: "",
      value: "",
    },
  ]);

  const addAttr = () => {
    setAttr([...attr, { id: ObjectID(24).toHexString(), key: "", value: "" }]);
  };

  const onRemoveAttr = (id: string) => {
    const _attr = attr.filter((item: any) => item.id !== id);
    setAttr(_attr);
  };

  const propPaper: UploadProps = {
    onChange({ file, fileList }) {
      if (file.status !== "uploading") {
        console.log(file, fileList);
      }
    },
    defaultFileList: [],
  };

  const onFinish = async (values: any) => {
    try {
      console.log("values", values);
      setLoading(true);
      let attributes: any = [];
      Object.entries(values).forEach(([key, val]) => {
        if (key.startsWith("key")) {
          const [, index] = key.split("key");
          attributes.push({
            key: values[`key${index}`],
            value: values[`value${index}`],
          });
        }
      });

      const formData: any = {
        address: values.address,
        externalUrl: values.externalUrl,
        youtubeUrl: values.youtubeUrl,
        description: values.description,
        avatar: {
          name: "logo.png",
          data: await toBase64(values.avatar.file.originFileObj),
        },
        attributes,
        certificates: await Promise.all(
          values.certificates.fileList.map(
            async (file: any, index: number) => ({
              name: `Certificate ${index + 1}`,
              data: await toBase64(file.originFileObj),
            })
          )
        ),
        projectImages: await Promise.all(
          values.projectImages.fileList.map(
            async (file: any, index: number) => ({
              name: `Image ${index + 1}`,
              data: await toBase64(file.originFileObj),
            })
          )
        ),
      };
      console.log({ formData });

      const [res]: any = await EvaluationService.createLand(formData);
      console.log("res", res);
      if (!res?.error) {
        router.push("/portal").then();
        message.success("Create evaluation successfully");
      } else {
        message.error(res?.error?.message);
      }
      setLoading(false);
    } catch (err: any) {
      console.log({ err });
      setLoading(false);
      message.error("Something error");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoadingFile(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoadingFile(false);
        setImageUrl(url);
      });
    }
  };

  const onChangeProjectImages: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setProjectImgList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
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
      {loadingFile ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
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
            <Form
              form={form}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Divider orientation="center" orientationMargin="0">
                Basic Information
              </Divider>
              <Form.Item
                label="Avatar"
                name="avatar"
                rules={[{ required: true, message: "Please upload avatar!" }]}
              >
                <Upload
                  customRequest={({ file, onSuccess }: any) => {
                    onSuccess("ok");
                  }}
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <CutomImg
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Input placeholder="Input Address" />
              </Form.Item>

              <Form.Item
                label="Project Description"
                name="description"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Input.TextArea placeholder="Input Description" rows={6} />
              </Form.Item>

              <Form.Item
                label="external url"
                name="externalUrl"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="youtube url"
                name="youtubeUrl"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Input />
              </Form.Item>

              <Divider orientation="center" orientationMargin="0">
                Attribute
              </Divider>

              {attr.map((item: any) => (
                <Row key={item.id} gutter={15}>
                  <Col span={11}>
                    <Form.Item
                      label=""
                      name={`key[${item.id}]`}
                      rules={[
                        {
                          required: true,
                          message: "This field cannot be empty.",
                        },
                      ]}
                    >
                      <Input prefix={<span>Key: </span>} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label=""
                      name={`value[${item.id}]`}
                      rules={[
                        {
                          required: true,
                          message: "This field cannot be empty.",
                        },
                      ]}
                    >
                      <Input prefix={<span>value: </span>} />
                    </Form.Item>
                  </Col>
                  <Col span={1}>
                    <CloseOutlined
                      style={{ marginTop: 10, cursor: "pointer" }}
                      onClick={() => onRemoveAttr(item.id)}
                    />
                  </Col>
                </Row>
              ))}
              <div>
                <Button onClick={addAttr} type="primary">
                  {" "}
                  <PlusOutlined /> Add new
                </Button>
              </div>

              <Divider orientation="center" orientationMargin="0">
                Project Images
              </Divider>

              <Form.Item
                label="Images"
                name="projectImages"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Upload
                  listType="picture-card"
                  fileList={projectImgList}
                  onChange={onChangeProjectImages}
                  onPreview={onPreview}
                >
                  {projectImgList.length < 5 && "+ Upload"}
                </Upload>
              </Form.Item>

              <Divider orientation="center" orientationMargin="0">
                Legal Papers
              </Divider>

              <Form.Item
                label="Docs"
                name="certificates"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Upload
                  customRequest={({ file, onSuccess }: any) => {
                    onSuccess("ok");
                  }}
                  {...propPaper}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>

              <Divider orientation="center" orientationMargin="0"></Divider>

              <div className="flex justify-center">
                <Button loading={loading} type="primary" htmlType="submit">
                  Submit Land
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default NewLandPage;

NewLandPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};
