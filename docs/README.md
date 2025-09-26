<div align="center">

# 🌸 绮课（qike.site）


<img src="https://img.shields.io/badge/中南大学-课程表查询平台-blue?style=for-the-badge&logo=education" alt="中南大学课程表查询平台"/>

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fqike.site&style=flat-square&logo=globe)](https://qike.site)
[![GitHub](https://img.shields.io/badge/GitHub-huayemao/cheer--next-181717?style=flat-square&logo=github)](https://github.com/huayemao/cheer-next)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![QQ群](https://img.shields.io/badge/QQ群-1157682866-1EBAFC?style=flat-square&logo=tencentqq)](https://qm.qq.com/q/dSso71mByM)

**专为中南大学师生打造的课程表查询平台** ✨

[🚀 立即使用](https://qike.site) · [📊 数据发现](https://qike.site/discovery) · [📚 课程查询](https://qike.site/subjects) · [💬 反馈建议](https://qm.qq.com/q/dSso71mByM)

</div>

---

## 📖 网站简介

> 🎯 **绮课（qike.site）** 为学生、教师提供便捷的课程信息查询服务，支持学生课表、教师课表、教室课表快速查找，提供完整的课程、开课数据和优异的用户体验。

<div align="center">

<table>
<tr>
<td>📊 <strong>9,186</strong> 门课程</td>
<td>📅 <strong>130,017</strong> 开课记录</td>
<td>📍 <strong>1,002</strong> 上课地点</td>
</tr>
</table>

</div>

### 🌟 核心特色
- 🔍 **多维度查询** - 支持学生、教师、教室、专业四种查询模式
- 📱 **响应式设计** - 完美适配手机、平板、电脑等各种设备  
- ⚡ **快速搜索** - 模糊搜索，输入部分信息即可秒查课表
- 🎨 **用户友好** - 精心设计的界面和交互体验
- 🆓 **完全免费** - 为中南大学师生提供永久免费服务

---

## ⚡ 主要功能

<details>
<summary>🔍 <strong>快速查询课表</strong></summary>

- ✅ 支持通过学号、姓名、教室、专业名称等多种方式查找课程信息
- ✅ 支持模糊搜索，输入部分信息即可秒查课表
- ✅ 查询范围涵盖学生课表、教师课表、教室课表、专业课表

</details>

<details>
<summary>🏛️ <strong>按院系浏览</strong></summary>

- 📚 可通过院系结构查找课程表
- 🎓 了解各院系专业设置及课程安排
- 📊 支持院系级别的数据统计和分析

</details>

<details>
<summary>🎯 <strong>特色服务入口</strong></summary>

- 📊 [**数据发现**](https://qike.site/discovery) - 课程数据的可视化分析与探索
- 🔍 [**课程查询**](https://qike.site/subjects) - 浏览和查询所有课程及其详细信息
- 📈 后续将添加院系数据分析和选课相关报表功能

</details>

### 🎨 界面预览

<!-- 实际截图展示区域 -->
<div align="center">

**桌面端界面**
<img src="./images/desktop-screenshot.webp" alt="绮课桌面端截图" width="800"/>

<!-- 移动端界面展示-->
**移动端界面**
<table>
<tr>
<td><img src="./images/mobile-home.webp" alt="移动端首页" width="250"/></td>
<td><img src="./images/mobile-search.webp" alt="移动端搜索" width="250"/></td>
<td><img src="./images/mobile-schedule.webp" alt="移动端课表" width="250"/></td>
</tr>
<tr>
<td align="center">首页界面</td>
<td align="center">搜索界面</td>
<td align="center">课表展示</td>
</tr>
</table>


</div>


### 🛠️ 更多贴心功能

<div align="center">

| 功能 | 描述 |
|:----:|:-----|
| 🗓️ | 支持周末显示切换 |
| ⏰ | 时间/序号显示模式切换 |
| 🌙 | 深色/浅色主题支持 |
| 📖 | 课程详情一键查看 |

</div>

---


## 开始开发

### 环境要求

- Node.js 18+
- pnpm 9+（默认推荐使用 pnpm 作为包管理器）

> 如果你使用 windows 操作系统上进行开发，使用 pnpm 执行 build 等命令时，可能会遇到权限问题等，可通过在系统设置的开发者选项中启用[开发者人员模式](https://learn.microsoft.com/zh-cn/windows/apps/get-started/enable-your-device-for-development)等方式解决。或者也可以考虑使用 yarn 来安装依赖。

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

在项目根目录下创建 `.env` 文件，配置必要的环境变量，如数据库连接字符串、API 密钥等。

```env
# 数据库连接字符串
DATABASE_URL=mysql://root:password@localhost:3306/cheer_next
```

### 同步数据库 schema

```bash
pnpm run prisma db push
```

### 初始化数据库

<!-- TODO:制作课表测试数据样本，并编写 seed 脚本 -->

> 此步骤将自动导入非课表数据，你还将需要课表数据才能运行项目，如果你是中南大学的学生，可以联系作者提供测试数据以供开发调试。

```bash
pnpm run db:seed
```

### 运行开发服务器

```bash
pnpm run dev
```

### 构建项目

```bash
pnpm run build
```

### 构建后启动项目

```bash
pnpm run start
```

## 📜 版权声明

<div align="center">

![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**© 2025 绮课 (qike.site). All rights reserved.**

<blockquote>
⚠️ <strong>免责声明</strong><br>
本站数据仅供参考，不可替代中南大学教务系统，请以官方教务系统信息为准。
</blockquote>

---

<h3>🎯 用心服务每一位中南人！</h3>

![Stars](https://img.shields.io/github/stars/huayemao/cheer-next?style=social)
![Forks](https://img.shields.io/github/forks/huayemao/cheer-next?style=social)

<p>
<strong>喜欢这个项目吗？给我们一个 ⭐ Star 吧！</strong>
</p>

</div>