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

const encoderPalette = {
  bg: '#F5F7FA',
  surface: '#FFFFFF',
  sidebar: '#0F172A',
  sidebarHover: '#1E293B',
  sidebarSubtle: '#334155',
  primary: '#0EA5A4',
  primaryHover: '#0B8B8A',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  danger: '#B91C1C',
  dangerSoft: '#FEF2F2',
  dangerBorder: '#FCA5A5',
};


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
        label: 'Informations',
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
          collapsed={collapsed} width={300} style={{ background: encoderPalette.sidebar }}>
          <PanelSideBarLogo />
          <ConfigProvider theme={{
            token: {
              colorText: '#FFFFFF',
              colorBgBase: encoderPalette.sidebar,
              colorPrimary: encoderPalette.primary,
            },
            components: {
              Menu: {
                darkItemBg: encoderPalette.sidebar,
                darkSubMenuItemBg: encoderPalette.sidebar,
                darkItemHoverBg: encoderPalette.sidebarHover,
                darkItemSelectedBg: encoderPalette.primary,
                darkItemSelectedColor: '#FFFFFF',
                darkItemColor: '#CBD5E1',
                darkItemHoverColor: '#FFFFFF',
                darkGroupTitleColor: encoderPalette.sidebarSubtle,
                itemBorderRadius: 10,
                itemHeight: 42,
                itemMarginInline: 10,
                itemMarginBlock: 6,
                itemPaddingInline: 14,
                subMenuItemBorderRadius: 8,
              },
            },
          }}>
            <Menu
              theme="dark"
              mode="inline"
              inlineIndent={18}
              style={{
                background: encoderPalette.sidebar,
                color: '#FFFFFF',
                fontSize: 14,
                paddingTop: 8,
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
            style={{
              padding: 0,
              background: encoderPalette.surface,
              borderColor: encoderPalette.border,
            }}
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
                  color: encoderPalette.text,
                }}
              />


              <div className='ml-auto mr-4 flex items-center gap-4'>
                <Link href='' style={{ color: encoderPalette.textMuted }}>{user.lname} {user.fname[0]}.</Link>
                 <Button
                  style={{
                    borderColor: encoderPalette.dangerBorder,
                    color: encoderPalette.danger,
                    background: encoderPalette.dangerSoft,
                  }}
                  onClick={handleLogout}
                >
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
              background: encoderPalette.bg,
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
