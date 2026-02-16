import { useState, PropsWithChildren, ReactNode } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { PageProps, User } from '@/types';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CreditCardOutlined,
  HomeOutlined, DeleteOutlined,
  FormOutlined, UserOutlined, LockOutlined
} from '@ant-design/icons';

import { Button, ConfigProvider, Layout, Menu, MenuProps } from 'antd';
import PanelSideBarLogo from '@/Components/PanelSideBarLogo';
const { Header, Sider, Content } = Layout;


export default function EncoderLayout(
  { user, children }: PropsWithChildren<{ user: User, header?: ReactNode }>) {

  const { post } = useForm();

  //destruct object permissions
  const { permissions } = usePage<PageProps>().props;

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    post(route('logout'));
  }

  type MenuItem = Required<MenuProps>['items'][number];
  const navigationItems = () => {
    //dynamic rendering is disabled for the meantime :(
    const items: MenuItem[] = [];
    items.push({
        key: 'encoder.dashboard',
        icon: <HomeOutlined />,
        label: 'Dashboard',
        onClick: () => router.visit('/encoder/dashboard')
      },
      {
        key: 'encoder.infos',
        icon: <FormOutlined />,
        label: 'Posts',
        children: [
          {
            key: 'encoder.infos.index',
            label: 'Info',
            onClick: () => router.visit('/encoder/infos'),
          },
          {
            key: 'encoder.infos.create',
            label: 'New Info',
            onClick: () => router.visit('/encoder/infos/create'),
          },

        ],
      },
      // {
      //     key: 'posts.publish',
      //     icon: <CreditCardOutlined />,
      //     label: 'Published',
      //     onClick: ()=> router.visit('/encoder/post-publish')
      // },
      // {
      //     key: 'trashes.index',
      //     icon: <DeleteOutlined />,
      //     label: 'Trashes',
      //     onClick: ()=> router.visit('/encoder/post-trashes')

      // },
      {
        type: 'divider'
      },
      {
        key: 'encoder.my-account.index',
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


    return items;
  }


  return (

    <>
      <Layout>
        <Sider trigger={null} collapsible
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
              defaultOpenKeys={['encoder.infos']}
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
