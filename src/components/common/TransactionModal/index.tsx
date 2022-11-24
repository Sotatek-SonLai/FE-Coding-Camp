import React from "react";
import {Button, Modal, Typography} from 'antd';
import {AppProps} from "next/app";

const {Paragraph, Text, Title, Link } = Typography

const TransactionModal: React.FC<any> = ({isShown, tx, close, children}) => {
    return (
        <Modal maskClosable={true} onCancel={close} title="Transaction ID" open={isShown} footer={null}>
            <Link  href={`https://solana.fm/address/${tx}?cluster=devnet-solana`} target='_blank' rel="noreferrer">
                <Title level={3}>
                    <Paragraph copyable style={{color: "#1890ff"}}>{tx}</Paragraph>
                </Title>
            </Link>
            {children}
        </Modal>
    )
}

export default TransactionModal
