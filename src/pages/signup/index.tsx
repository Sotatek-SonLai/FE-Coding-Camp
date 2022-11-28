import { Typography, Button, Card, Form, Input, notification } from "antd";
import Link from "next/link";
import React, { useState } from "react";
import { signUp } from "../../service/api/user.service";

const { Text, Title } = Typography;
type NotificationType = "success" | "error";
const SignUp = () => {
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  const openNotification = (
    type: NotificationType,
    message: string,
    description: string
  ) => {
    api[type]({
      message,
      description,
    });
  };

  const onFinish = async (formData: any) => {
    try {
      console.log("Success:", formData);
      setLoading(true);
      const { email, password } = formData;
      await signUp({ email, password });
      openNotification(
        "success",
        "Congratulations!",
        "Your registration has been sucessful"
      );
      setLoading(false);
    } catch (error: any) {
      console.log("Faild to sign up: ", error?.response?.data?.error);
      openNotification(
        "error",
        "Fail to sign up",
        error?.response?.data?.error?.message
      );
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={{ height: "100vh", padding: "150px" }}>
      {contextHolder}
      <Card style={{ width: 400, margin: "auto" }}>
        <Title level={2} style={{ marginBottom: "30px" }}>
          Sign up
        </Title>

        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirm-password"
            rules={[
              {
                required: true,
                message: "Please input your confirm password!",
              },
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              size="large"
              type="primary"
              htmlType="submit"
              style={{ width: "100%", marginTop: "10px" }}
            >
              Sign up
            </Button>
          </Form.Item>
          <Text>
            Already have an account? <Link href="/login"> Sign in</Link>
          </Text>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;
