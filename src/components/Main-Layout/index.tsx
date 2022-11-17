import React, {useEffect, useState} from "react";
import {AppProps} from "next/app";

import {HomeOutlined, PicLeftOutlined, ProjectOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Breadcrumb, Layout, Menu, Button, Modal} from 'antd';

type MenuItem = Required<MenuProps>['items'][number];
import dynamic from 'next/dynamic'
import Link from "next/link";
import {useRouter} from "next/router";

const DynamicCustomWallet = dynamic(() => import('./CustomWallet'), {
    ssr: false,
})

const {Header, Content, Sider} = Layout;

function getItem(
    label: React.ReactNode,
    to: string | null,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label: to ? <Link href={to}>{label}</Link> : label,
        type,
    } as MenuItem;
}

const items: MenuProps['items'] = [
    getItem('Dashboard', '/dashboard', '1', <HomeOutlined/>),
    getItem('Portal Evaluation', '/portal', '2', <PicLeftOutlined/>),
    getItem('Property List', '/properties', '3', <ProjectOutlined/>),
];


const MainLayout: React.FC<any> = ({Component, ...props}) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<any[]>([])
    const { pathname } = useRouter();
    console.log(items)

    useEffect(() => {
        // setDefaultSelectedKeys([(active?.key.toString() || '')])
    }, [pathname])

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
                        <DynamicCustomWallet/>
                    </div>
                </Header>
                <Layout>
                    <Sider width={200} className="site-layout-background">
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['2']}
                            defaultOpenKeys={['sub2-1']}
                            style={{height: '100%', borderRight: 0}}
                            items={items}
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
