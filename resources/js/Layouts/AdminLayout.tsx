import { useState, PropsWithChildren } from 'react';
import { Link, router, useForm } from '@inertiajs/react';

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    FilePptOutlined,
    UserOutlined, ProfileOutlined,
    FormOutlined,
    BarsOutlined,
    DashboardOutlined
} from '@ant-design/icons';

import { Button, ConfigProvider, Layout, Menu, MenuProps } from 'antd';
import PanelSideBarLogo from '@/Components/PanelSideBarLogo';
import { LogOut } from 'lucide-react';
const { Header, Sider, Content } = Layout;

const siderStyle: React.CSSProperties = {

    background: "#084c7f",

};

export default function AdminLayout(
    { user, children }: PropsWithChildren<{ user: any }>) {

    const { post } = useForm();

    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        post(route('logout'));
    }

    type MenuItem = Required<MenuProps>['items'][number];

    const navigationItems = () => {

        const items: MenuItem[] = [];

        items.push({
            key: 'admin.dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => router.visit('/admin/dashboard')
        },
            {
                key: 'admin.sections',
                icon: <ProfileOutlined />,
                label: 'Sections',
                onClick: () => router.visit('/admin/sections')

            },
            {
                key: 'admin.categories',
                icon: <BarsOutlined />,
                label: 'Categories',
                onClick: () => router.visit('/admin/categories')
            },
            {
                type: 'divider',
            },
            {
                key: 'page-sections',
                icon: <FilePptOutlined />,
                label: 'Page Sections',
                // onClick: () => router.visit('/admin/pages')
                children: [
                    {
                        key: 'admin.page-sections.banners',
                        label: 'Banners',
                        onClick: () => router.visit('/admin/page-sections/banners'),
                    },
                    {
                        key: 'admin.page-sections.magazines',
                        label: 'Magazines',
                        onClick: () => router.visit('/admin/page-sections/magazines'),
                    },
                    {
                        key: 'admin.page-sections.dostvs',
                        label: 'DOSTv',
                        onClick: () => router.visit('/admin/page-sections/dostvs'),
                    },
                    {
                        key: 'admin.page-sections.videos',
                        label: 'Videos',
                        onClick: () => router.visit('/admin/page-sections/videos'),
                    },
                ],
            },
            {
                type: 'divider',
            },

            {
                key: 'posts',
                icon: <FormOutlined />,
                label: 'Posts',
                children: [
                    {
                        key: 'admin.posts.articles',
                        label: 'Article',
                        onClick: () => router.visit('/admin/posts'),
                    },
                    {
                        key: 'admin.posts.featureds',
                        label: 'Featured Post',
                        onClick: () => router.visit('/admin/post-featured'),
                    },
                    {
                        key: 'admin.posts.archives',
                        label: 'Archive',
                        onClick: () => router.visit('/admin/post-archives'),
                    },

                ],
            },
            {
                type: 'divider'
            },

            // {
            //     key: 'roles.index',
            //     icon: <IdcardOutlined />,
            //     label: 'Roles',
            //     onClick: ()=> router.visit('/admin/roles')
            // },
            // {
            //     key: 'permissions.index',
            //     icon: <HddOutlined />,
            //     label: 'Permissions',
            //     onClick: ()=> router.visit('/admin/permissions')
            // },
            // {
            //     key: 'role-has-permissions.index',
            //     icon: <FileJpgOutlined />,
            //     label: 'Role Permissions',
            //     onClick: ()=> router.visit('/admin/role-has-permissions')
            // },
            {
                key: 'admin.users',
                icon: <UserOutlined />,
                label: 'Users',
                onClick: () => router.visit('/admin/users')
            });

        // if (paramPermissions.includes('sections.index')) {
        // 	items.push(
        //     );
        // }

        // if (paramPermissions.includes('categories.index')) {
        // 	items.push( );
        // }

        // if (paramPermissions.includes('posts.index')) {
        // 	items.push();
        // }

        // if (paramPermissions.includes('trashes.index')) {
        // 	items.push();
        // }


        // if (paramPermissions.includes('roles.index')) {
        // 	items.push();
        // }

        // if (paramPermissions.includes('permissions.index')) {
        // 	items.push(
        //     );
        // }
        // if (paramPermissions.includes('role-has-permissions.index')) {
        // 	items.push(
        //     );
        // }

        // if (paramPermissions.includes('users.index')) {
        // 	items.push(
        //     ;
        // }

        return items;
    }


    return (
        <>
            <Layout>
                <Sider trigger={null}
                    style={siderStyle}
                    collapsible
                    collapsed={collapsed} width={300}
                    breakpoint='md'
                    onBreakpoint={(broken) => {
                        setCollapsed(broken)
                    }}>
                    <PanelSideBarLogo />
                    <ConfigProvider
                        theme={{
                            token: {
                                /* here is your global tokens */
                                colorText: 'white',
                                colorBgBase: '#084c7f',
                                //colorBgTextHover : 'red' //bg color when hovering the menu
                                //colorBgElevated: 'red' //can be use also as bg color in mobile sub link
                                colorLinkActive: 'red'
                                
                            },
                        }}
                        >
                        <Menu
                            mode="inline"
                            style={{
                                background: "#084c7f",
                                color: 'white',
                            }}
                            defaultSelectedKeys={[`${route().current()?.split('.')?.slice(0, -1).join('.')}`]}
                            defaultOpenKeys={[]}
                            items={
                                navigationItems()
                            }
                        />
                    </ConfigProvider>

                    
                </Sider>
                <Layout>
                    <Header
                        className='border'
                        style={{ padding: 0, background: 'white' }}
                    >
                        <div className='flex items-center'>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                            <div className='ml-auto mr-4 flex items-center gap-4'>
                                <Link href=''>{user.lname} {user.fname[0]}.</Link>
                                <Button 
                                    danger 
                                    onClick={handleLogout} 
                                    icon={<LogOut size={16}/>}>
                                </Button>
                            </div>

                        </div>
                    </Header>
                    <Content
                        style={{
                            margin: 0,
                            padding: 0,
                            height: '100vh',
                            background: "#dce6ec",
                            overflow: 'auto',
                            borderRadius: 0,
                        }}
                    >
                        <main className='py-4'>{children}</main>
                    </Content>
                </Layout>
            </Layout>
        </>


    );
}
