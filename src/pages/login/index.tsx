import React from "react";
import Router from "next/router";
import { Typography, Button, Card, Form, Input } from "antd";
import UserService from "../../service/user.service";

const { Text, Link, Title } = Typography;

const Login = () => {
  const onFinish = async (formData: any) => {
    console.log("Success:", formData);

    await UserService.login({
      email: formData.email,
      password: formData.password,
    });

    Router.push("/dashboard");
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Card style={{ width: 400, margin: "150px auto" }}>
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
  );
};

export default Login;
