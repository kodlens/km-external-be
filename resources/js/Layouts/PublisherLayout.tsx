import { useState, PropsWithChildren, ReactNode } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined, MinusSquareOutlined,
  UserOutlined, FormOutlined, CreditCardOutlined, LockOutlined
} from '@ant-design/icons';

import { Button, ConfigProvider, Layout, Menu, MenuProps, theme } from 'antd';
import PanelSideBarLogo from '@/Components/PanelSideBarLogo';
const { Header, Sider, Content } = Layout;


export default function PublisherLayout(
  { user, children }: PropsWithChildren<{ user: any, header?: ReactNode }>) {

  const { post } = useForm();

  //destruct object permissions
  const { permissions } = usePage<PageProps>().props;

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    post(route('logout'));
  }

  type MenuItem = Required<MenuProps>['items'][number];
  const navigationItems = () => {

    const items: MenuItem[] = [];

    items.push(
      {
        key: 'publisher.dashboard.index',
        icon: <UserOutlined />,
        label: 'Dashboard',
        onClick: () => router.visit('/publisher/dashboard')
      },
      {
        type: 'divider',
      },
      {
        key: 'publisher.posts.index',
        icon: <FormOutlined />,
        label: 'Posts',
        onClick: () => router.visit('/publisher/posts')
      },
      // {
      //   key: 'publisher.posts-publish',
      //   icon: <CreditCardOutlined />,
      //   label: 'Publish',
      //   onClick: () => router.visit('/publisher/post-publish')
      // },
      // {
      //   key: 'publisher.posts-unpublish',
      //   icon: <MinusSquareOutlined />,
      //   label: 'Unpublish',
      //   onClick: () => router.visit('/publisher/post-unpublish')
      // },
      {
        type: 'divider'
      },
      {
        key: 'my-account.index',
        icon: <UserOutlined />,
        label: 'My Account',
        onClick: () => router.visit('/my-account')

      },
      {
        key: 'change-password.index',
        icon: <LockOutlined />,
        label: 'Change Password',
        onClick: () => router.visit('/change-password')

      },
    );

    // items.push({
    // 	key: 'panel.publisher-dashboard',
    //     icon: <UserOutlined />,
    //     label: 'Dashboard',
    //     onClick: () => router.visit('/panel/publisher/dashboard')
    // });

    // if (paramPermissions.includes('posts.index')) {
    // 	items.push({
    //         type: 'divider',
    //     },
    //     {
    //         key: 'posts.index',
    //         icon: <FormOutlined />,
    //         label: 'Posts',
    //         onClick: ()=> router.visit('/panel/posts')
    //     });
    // }

    // if (paramPermissions.includes('trashes.index')) {

    // }

    return items;
  }


  return (

    <>
      <Layout>
        <Sider trigger={null} collapsible
          breakpoint='md'
          onBreakpoint={(b) => setCollapsed(b)}
          collapsed={collapsed} width={300} style={{ background: "#084c7f" }}>
          <PanelSideBarLogo />
          <ConfigProvider theme={{
            token: {
              colorText: 'white'
            }
          }}>
            <Menu
              mode="inline"
              style={{
                background: "#084c7f",
                color: 'white',
              }}
              defaultSelectedKeys={[`${route().current()}`]}
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
                <Button className='' onClick={handleLogout}>Logout</Button>
              </div>

            </div>
          </Header>
          <Content
            style={{
              margin: 0,
              padding: 0,
              height: 'calc(100vh - 64px)',
              overflow: 'auto',
              background: "#dce6ec",
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
