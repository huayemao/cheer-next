export interface HomeConfig {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    searchButton: string;
    learnMoreButton: string;
    stats: {
      subjects: string;
      courses: string;
      classrooms: string;
    };
  };
  features: {
    title: string;
    subtitle: string;
    items: {
      icon: string;
      title: string;
      description: string;
    }[];
    additionalTitle: string;
    additionalItems: string[];
    freeText: string;
    freeDescription: string;
  };
  departments: {
    title: string;
    subtitle: string;
    professionCount: string;
    viewProfession: string;
    viewAll: string;
  };
  search: {
    title: string;
    subtitle: string;
    cardTitle: string;
    cardDescription: string;
    placeholder: string;
  };
  // 广告轮播配置
  ads: {
    // 是否在首页显示广告轮播
    showOnHomepage: boolean;
  };
}

export const homeConfig: HomeConfig = {
  hero: {
    title: "绮课",
    subtitle: "中南大学专属课程表查询平台",
    description: "为学生、教师提供便捷的课程信息查询服务，支持学生课表、教师课表、教室课表快速查找，提供完整的课程、开课数据和优异的用户体验",
    searchButton: "立即查询",
    learnMoreButton: "了解更多",
    stats: {
      subjects: "9000+",
      courses: "10万+",
      classrooms: "1000+"
    }
  },
  // 广告轮播配置
  ads: {
    // 默认在首页显示广告轮播
    showOnHomepage: true
  },
  features: {
    title: "为什么选择绮课",
    subtitle: "专为中南大学师生打造的课程表查询工具，提供便捷、准确的课表服务",
    items: [
      {
        icon: "Smartphone",
        title: "响应式设计",
        description: "完美适配手机、平板、电脑等各种设备，随时随地查看课表"
      },
      {
        icon: "Smartphone",
        title: "优异用户体验",
        description: "精心设计的界面和交互，让查询和浏览课程信息变得轻松愉悦"
      },
      {
        icon: "Zap",
        title: "快速查询",
        description: "输入学号或姓名即可秒查课表，无需等待。（注：为提高使用门槛，防止数据被滥用，绮课暂不支持模糊搜索）"
      },
      {
        icon: "Shield",
        title: "数据准确",
        description: "完整的课程、开课数据，确保信息的准确性和完整性"
      },
      {
        icon: "Users",
        title: "多维度查询",
        description: "支持学生课表、教师课表、教室课表三种查询模式，还可以按院系专业浏览所有课程"
      },
      {
        icon: "Check",
        title: "丰富拓展功能",
        description: "后续将添加院系数据分析和选课相关报表功能，为学习和教学提供更多支持"
      }
    ],
    additionalTitle: "更多贴心功能",
    additionalItems: [
      "支持周末显示切换",
      "时间/序号显示模式切换",
      "深色/浅色主题支持",
      "课程详情一键查看"
    ],
    freeText: "完全免费",
    freeDescription: "为中南大学师生提供永久免费的课表查询服务"
  },
  departments: {
    title: "按院系浏览",
    subtitle: "通过院系结构查找课程表，了解各院系专业设置",
    professionCount: "个专业",
    viewProfession: "查看专业列表",
    viewAll: "查看全部院系"
  },
  search: {
    title: "快速查询课表",
    subtitle: "输入学号、姓名、教室或专业名称，快速查找课程信息",
    cardTitle: "搜索课程表",
    cardDescription: "支持学生、教师、教室、专业四种查询方式",
    placeholder: "输入学号、姓名或教室名称..."
  }
};