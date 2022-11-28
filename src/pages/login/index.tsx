import React, { useState } from "react";
import Router, { useRouter } from "next/router";
import { Typography, Button, Card, Form, Input, notification } from "antd";
import { login } from "../../service/api/user.service";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken } from "../../store/auth/auth.slice";
import Cookies from "js-cookie";
import Link from "next/link";

const { Text, Title } = Typography;

type NotificationType = "success" | "error";

const Login = () => {
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();
  const router = useRouter();
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

      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      console.log("response.data.data: ", response.data.data);
      const { accessToken, refreshToken, user } = response.data.data;

      // store access token in memory and refresh token in cookies
      Cookies.set("refreshToken", refreshToken);
      Cookies.set("walletAddress", user?.wallet_address);
      dispatch(setAccessToken(accessToken));
      setLoading(false);
      router.push("/");
    } catch (error: any) {
      console.log("Faild to sign in: ", error?.response?.data?.error);
      openNotification(
        "error",
        "Fail to sign in",
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
          Sign in
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
          <Form.Item>
            <Button
              loading={loading}
              size="large"
              type="primary"
              htmlType="submit"
              style={{ width: "100%", marginTop: "10px" }}
            >
              Submit
            </Button>
          </Form.Item>
          <Text>
            Need an account? <Link href="/signup"> Sign up</Link>
          </Text>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
