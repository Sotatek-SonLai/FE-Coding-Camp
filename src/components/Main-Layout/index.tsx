import React, {useState} from "react";
import {AppProps} from "next/app";

import {LaptopOutlined, NotificationOutlined, UserOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Breadcrumb, Layout, Menu, Button, Modal} from 'antd';

import dynamic from 'next/dynamic'

const DynamicCustomWallet = dynamic(() => import('./CustomWallet'), {
  ssr: false,
})

const {Header, Content, Sider} = Layout;


const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
    (icon, index) => {
        const key = String(index + 1);

        return {
            key: `sub${key}`,
            icon: React.createElement(icon), 
            label: `subnav ${key}`,

            children: new Array(4).fill(null).map((_, j) => {
                const subKey = index * 4 + j + 1;
                return {
                    key: subKey,
                    label: `option${subKey}`,
                };
            }),
        };
    },
);

const MainLayout: React.FC<any> = ({Component, ...props}) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const showModalConnect = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <Layout>
                <Header className="header">
                    <div className="logo">
                        <img src="/logo.png" alt=""/>
                    </div>
                    <div className="connect-wrap">
                        <DynamicCustomWallet />
                    </div>
                </Header>
                <Layout>
                    <Sider width={200} className="site-layout-background">
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{height: '100%', borderRight: 0}}
                            items={items2}
                        />
                    </Sider>
                    <Layout style={{padding: '0 24px 24px'}}>
                        <Content
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                            <div className="wrapper">
                                <Component {...props}/>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>

            <Modal
                title="Connect Wallet"
                open={isModalOpen}
                maskClosable={true}
                onCancel={() => setIsModalOpen(false)}
                footer={null}>
                <div>.....</div>
            </Modal>
        </>
    )
}

export default MainLayout
