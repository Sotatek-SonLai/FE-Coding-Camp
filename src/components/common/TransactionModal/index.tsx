import React from "react";
import { Button, Modal, Typography } from "antd";
import { CheckCircleTwoTone, CheckOutlined } from "@ant-design/icons";

const { Paragraph, Text, Title, Link } = Typography;

const TransactionModal: React.FC<any> = ({ isShown, tx, close, children }) => {
  return (
    <Modal
      width={450}
      onCancel={close}
      open={isShown}
      footer={null}
      closable={false}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          margin: "20px 0px",
        }}
      >
        <Button
          style={{
            backgroundColor: "#4affc578",
            borderColor: "#4affc578",
            cursor: "default",
          }}
          shape="circle"
          type="primary"
          size="large"
          icon={<CheckOutlined style={{ fontSize: 20, color: "#00d97e" }} />}
        />

        <Text style={{ fontSize: 16, fontWeight: 500 }}>
          Successfully tokenized!
        </Text>
      </div>
      <Link
        href={`https://solana.fm/tx/${tx}?cluster=devnet-solana`}
        target="_blank"
        rel="noreferrer"
      >
        <Text strong>
          <Paragraph copyable style={{ color: "#1890ff", textAlign: "center" }}>
            3DNtj3kzZJqf1scNKCjdwPx9ucUCAoYiJsnnyEPgmrHt2WpUzQgvpbJypta2Ldf3D8ipVaTQ5Fapi1nPc4S7A2Yu
          </Paragraph>
        </Text>
      </Link>
      <br />
      {children}
    </Modal>
  );
};

export default TransactionModal;
