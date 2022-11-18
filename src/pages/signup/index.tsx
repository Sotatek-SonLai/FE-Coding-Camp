import { Typography, Button, Card, Form, Input } from "antd";
import Router from "next/router";
import React from "react";
import UserService from "../../service/user.service";

const { Text, Link, Title } = Typography;

const SignUp = () => {
  const onFinish = async (formData: any) => {
    console.log("Success:", formData);
    await UserService.signUp(formData);

    Router.push("/login");
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Card style={{ width: 400, margin: "150px auto" }}>
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
            { required: true, message: "Please input your confirm password!" },
          ]}
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
            Sign up
          </Button>
        </Form.Item>
        <Text>
          Already have an account? <Link href="/login"> Sign in</Link>
        </Text>
      </Form>
    </Card>
  );
};

export default SignUp;
