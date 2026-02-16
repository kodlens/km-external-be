import { useState, PropsWithChildren, ReactNode } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import { User } from '@/types';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  FormOutlined, UserOutlined, LockOutlined
} from '@ant-design/icons';

import { Button, ConfigProvider, Layout, Menu, MenuProps } from 'antd';
import PanelSideBarLogo from '@/Components/PanelSideBarLogo';
import { ListPlus, LogOut, Newspaper } from 'lucide-react';
const { Header, Sider, Content } = Layout;


export default function EncoderLayout(
  { user, children }: PropsWithChildren<{ user: User, header?: ReactNode }>) {

  const { post } = useForm();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    post(route('logout'));
  }

  type MenuItem = Required<MenuProps>['items'][number];
  const navigationItems = () => {
    //dynamic rendering is disabled for the meantime :(
    const items: MenuItem[] = [];
    items.push({
        key: 'encoder.dashboard.index',
        icon: <HomeOutlined />,
        label: 'Dashboard',
        onClick: () => router.visit('/encoder/dashboard')
      },
      {
        key: 'encoder.infos',
        icon: <FormOutlined />,
        label: 'Infomations',
        children: [
          {
            key: 'encoder.infos.index',
            label: 'Articles',
            icon: <Newspaper size={15} />,
            onClick: () => router.visit('/encoder/infos'),
          },
          {
            key: 'encoder.infos.create',
            label: 'New Post/Article',
            icon: <ListPlus size={15} />,
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
              colorText: 'white',
              colorBgBase: '#084c7f',
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
                 <Button className='' danger onClick={handleLogout}>
                  <LogOut size={15} />
                </Button>
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
