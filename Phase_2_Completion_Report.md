# Jindrich (常州锦谦) 网站第二阶段完成报告

**更新日期：** 2026年3月4日
**项目状态：** 第二阶段（联系表单功能开发与 Cloudflare Worker 部署）已完成并上线。

## 1. 本阶段目标

将"联系我们"页面从纯文本信息展示升级为功能完善的**在线留言表单**，实现客户线索的自动化收集与邮件通知，同时集成 Cloudflare Turnstile 人机验证以防垃圾提交。

## 2. 核心成果

### 2.1 前端：交互式留言表单

- **表单字段**：
  - 姓名（英文模式 First Name / Last Name 分离，中文模式合并为单一"姓名"字段）
  - 企业邮箱（自动拦截 Gmail、QQ、Outlook 等 40+ 个公共邮箱域名）
  - 国家/地区（190+ 国家下拉列表，选择后自动填入对应国际区号）
  - 电话号码（含国际区号格式校验）
  - 留言内容（最少 10 字符）
- **表单验证**：
  - **即时验证 (blur)**：邮箱字段在用户输入完移开焦点后立刻校验，有效邮箱显示绿色边框，无效邮箱显示红色错误提示。
  - **提交验证**：点击"发送"时对所有必填字段做完整性校验，逐字段显示错误信息。
- **人机验证**：集成 Cloudflare Turnstile Widget，根据当前网站语言动态渲染（英文 → 英文 UI，中文 → 中文 UI）。
- **双语支持**：表单所有标签、占位符、错误提示和成功/失败反馈均支持中英文切换，翻译键统一维护于 `i18n.js`。

### 2.2 后端：Cloudflare Worker API

- **Worker 名称**：`jindrich-contact-api`
- **部署地址**：`https://jindrich-contact-api.intechwell.workers.dev/`
- **技术实现**：
  1. 接收前端 POST 请求（JSON 格式）
  2. 服务端二次校验 Turnstile Token（调用 Cloudflare siteverify API）
  3. 服务端二次校验企业邮箱（拦截公共邮箱域名）
  4. 通过 Resend API 发送格式化 HTML 邮件至指定收件箱
  5. CORS 跨域支持（允许前端域名访问）
  6. XSS 防护（所有用户输入做 HTML 实体转义）

### 2.3 邮件通知

- **发件人**：`Jindrich Website <website@jindrich.com.cn>`
- **收件人**：`info@jindrich.com.cn`
- **邮件格式**：专业 HTML 模板，含姓名、邮箱、国家、电话、语言和留言详情
- **Reply-To**：自动设置为客户提交的邮箱地址，方便直接回复

## 3. 修改文件清单

| 文件 | 操作 | 说明 |
| --- | --- | --- |
| `contact.html` | 重写 | 新增表单 UI 结构、Turnstile 容器、成功/失败反馈面板 |
| `js/contact-form.js` | 新增 | 前端校验逻辑、国家区号联动、Turnstile 动态渲染、异步提交 |
| `js/i18n.js` | 扩展 | 新增 30+ 个表单相关的中英翻译键 |
| `css/style.css` | 扩展 | 新增表单布局、输入框、下拉菜单、错误提示、按钮动画、响应式适配 |
| `worker/index.js` | 新增 | Cloudflare Worker 后端脚本 |
| `worker/wrangler.toml` | 新增 | Worker 配置文件 |

## 4. 环境配置（已部署）

| 配置项 | 值 | 存储位置 |
| --- | --- | --- |
| Turnstile Site Key | `0x4AAAAAACmCQX6kwn3mDd8c` | 前端代码 |
| Turnstile Secret Key | `0x4AAAA...8e5M` | Worker 环境变量 (Secret) |
| Resend API Key | `re_Eksg...SQhe` | Worker 环境变量 (Secret) |
| Worker URL | `https://jindrich-contact-api.intechwell.workers.dev/` | 前端代码 |

## 5. 页面布局

采用左右双栏布局：
- **左侧**：标题 "Get In Touch" + 副标题 + 完整表单
- **右侧**：电话和地址联系卡片
- **移动端**：自动堆叠为单栏

## 6. 前提条件

> ⚠️ Resend 需要完成 `jindrich.com.cn` 域名验证（DNS 的 SPF/DKIM 记录），否则邮件可能被拦截或无法发出。

## 7. 下一步规划（第三阶段预留）

1. **项目案例页面 (Case Studies)**：展示已完成的工程项目案例
2. **更多语种支持**：通过 `i18n.js` 字典扩展其他语言
3. **表单数据持久化**：可考虑增加 Cloudflare D1 数据库存储提交记录

---
*本报告已在项目根目录下归档完毕。*
