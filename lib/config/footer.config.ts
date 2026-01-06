export interface FooterLink {
  href: string;
  label: string;
}

export interface FriendlyLink {
  href: string;
  label: string;
}

export interface FooterConfig {
  brand: {
    name: string;
    description: string;
    slogan: string;
  };
  quickLinks: FooterLink[];
  friendlyLinks: FriendlyLink[];
  copyright: string;
  platformName: string;
}

export const footerConfig: FooterConfig = {
  brand: {
    name: '绮课',
    description: '绮课是专为中南大学师生打造的课程表查询平台，致力于提供便捷、准确的课表查询服务。',
    slogan: '用心服务每一位中南人'
  },
  quickLinks: [
    {
      href: '/',
      label: '首页'
    },
    {
      href: '/search/student',
      label: '学生课表查询'
    },
    {
      href: '/search/teacher',
      label: '教师课表查询'
    },
    {
      href: '/search/location',
      label: '教室课表查询'
    },
    {
      href: '/search/profession',
      label: '专业课表查询'
    },
    {
      href: '/blog',
      label: '博客'
    },
    {
      href: '/discovery',
      label: '数据发现'
    },
    {
      href: '/subjects',
      label: '课程查询'
    }
  ],
  friendlyLinks: [
    {
      href: 'https://huayemao.run',
      label: '花野猫的数字花园'
    },
  ],
  copyright: '© {year} 绮课. All rights reserved.',
  platformName: '中南大学课程表查询平台'
};