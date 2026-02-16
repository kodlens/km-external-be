import {
  BarsOutlined,
  DashboardOutlined,
  FormOutlined,
  HomeOutlined,
  LockOutlined,
  ProfileOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { router } from '@inertiajs/react'
import type { MenuProps } from 'antd'
import { ListPlus, Newspaper } from 'lucide-react'

type SidebarRole = 'admin' | 'encoder' | 'publisher'

type SidebarConfig = {
  items: MenuProps['items']
  defaultOpenKeys: string[]
}

const accountItems: MenuProps['items'] = [
  {
    key: 'my-account.index',
    icon: <UserOutlined />,
    label: 'My Account',
    onClick: () => router.visit('/my-account'),
  },
  {
    key: 'change-password.index',
    icon: <LockOutlined />,
    label: 'Change Password',
    onClick: () => router.visit('/change-password'),
  },
]

const menuByRole: Record<SidebarRole, SidebarConfig> = {
  encoder: {
    defaultOpenKeys: ['encoder.infos'],
    items: [
      {
        key: 'encoder.dashboard.index',
        icon: <HomeOutlined />,
        label: 'Dashboard',
        onClick: () => router.visit('/encoder/dashboard'),
      },
      {
        key: 'encoder.infos',
        icon: <FormOutlined />,
        label: 'Informations',
        children: [
          {
            key: 'encoder.infos.index',
            label: 'Information',
            icon: <Newspaper size={15} />,
            onClick: () => router.visit('/encoder/infos'),
          },
          {
            key: 'encoder.infos.create',
            label: 'New Information',
            icon: <ListPlus size={15} />,
            onClick: () => router.visit('/encoder/infos/create'),
          },
        ],
      },
      { type: 'divider' },
      ...accountItems,
    ],
  },
  publisher: {
    defaultOpenKeys: [],
    items: [
      {
        key: 'publisher.dashboard.index',
        icon: <UserOutlined />,
        label: 'Dashboard',
        onClick: () => router.visit('/publisher/dashboard'),
      },
      { type: 'divider' },
      {
        key: 'publisher.infos',
        icon: <FormOutlined />,
        label: 'Informations',
        onClick: () => router.visit('/publisher/infos'),
        children: [
          {
            key: 'encoder.infos.index',
            label: 'Information',
            icon: <Newspaper size={15} />,
            onClick: () => router.visit('/encoder/infos'),
          },
          {
            key: 'encoder.infos.create',
            label: 'New Information',
            icon: <ListPlus size={15} />,
            onClick: () => router.visit('/encoder/infos/create'),
          },
        ],
      },
      { type: 'divider' },
      ...accountItems,
    ],
  },
  admin: {
    defaultOpenKeys: ['admin.infos'],
    items: [
      {
        key: 'admin.dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        onClick: () => router.visit('/admin/dashboard'),
      },
      {
        key: 'admin.subjects',
        icon: <ProfileOutlined />,
        label: 'Subjects',
        onClick: () => router.visit('/admin/subjects'),
      },
      {
        key: 'admin.subject-headings',
        icon: <BarsOutlined />,
        label: 'Subject Headings',
        onClick: () => router.visit('/admin/subject-headings'),
      },
      { type: 'divider' },
      {
        key: 'admin.infos',
        icon: <FormOutlined />,
        label: 'Posts',
        children: [
          {
            key: 'admin.infos.index',
            label: 'Posts/Articles',
            onClick: () => router.visit('/admin/infos'),
          },
          {
            key: 'admin.infos.create',
            label: 'New Post/Article',
            onClick: () => router.visit('/admin/infos/create'),
          },
          {
            key: 'admin.infos.archive',
            label: 'Archives',
            onClick: () => router.visit('/admin/post-archives'),
          },
          {
            key: 'admin.infos.trash',
            label: 'Trashes',
            onClick: () => router.visit('/admin/post-trashes'),
          },
        ],
      },
      { type: 'divider' },
      {
        key: 'admin.users',
        icon: <UserOutlined />,
        label: 'Users',
        onClick: () => router.visit('/admin/users'),
      },
    ],
  },
}

export const getSidebarMenuConfig = (role?: string): SidebarConfig => {
  const normalizedRole = (role ?? '').toLowerCase() as SidebarRole
  if (!menuByRole[normalizedRole]) {
    return { items: [], defaultOpenKeys: [] }
  }

  return menuByRole[normalizedRole]
}

export const getSidebarSelectedKeys = (role?: string, currentRoute?: string | null): string[] => {
  if (!currentRoute) {
    return []
  }

  const normalizedRole = (role ?? '').toLowerCase()

  if (normalizedRole === 'encoder') {
    if (currentRoute === 'encoder.infos.create') {
      return ['encoder.infos.create']
    }
    if (currentRoute.startsWith('encoder.infos')) {
      return ['encoder.infos.index']
    }
  }

  if (normalizedRole === 'publisher' && currentRoute.startsWith('publisher.infos')) {
    return ['publisher.posts.index']
  }

  if (normalizedRole === 'admin') {
    const segments = currentRoute.split('.')
    if (segments.length > 2) {
      return [segments.slice(0, -1).join('.')]
    }
  }

  return [currentRoute]
}
