# Jindrich 网站技术归档文件

**版本：** v2.0
**更新日期：** 2026年3月4日
**仓库地址：** https://github.com/olavininfo/jindrich.git

---

## 1. 技术架构总览

```
┌──────────────────────────────────────────────────────────┐
│                    Cloudflare CDN                         │
│                                                          │
│  ┌─────────────────────┐    ┌──────────────────────────┐ │
│  │  Cloudflare Pages   │    │   Cloudflare Worker      │ │
│  │  (静态网站前端)      │───▶│  jindrich-contact-api    │ │
│  │  Auto-deploy GitHub │    │  POST /                  │ │
│  └─────────────────────┘    └──────────┬───────────────┘ │
│                                        │                  │
│  ┌─────────────────────┐               ▼                  │
│  │ Cloudflare Turnstile│    ┌──────────────────────────┐ │
│  │ 人机验证             │    │    Resend API             │ │
│  └─────────────────────┘    │    邮件投递服务            │ │
│                              └──────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

- **前端**：纯 HTML5 + CSS3 + JavaScript，零框架依赖
- **托管**：Cloudflare Pages，自动从 GitHub `main` 分支部署
- **后端**：Cloudflare Worker (Serverless)，处理表单提交
- **邮件**：Resend API，从 `website@jindrich.com.cn` 发送至 `info@jindrich.com.cn`
- **安全**：Cloudflare Turnstile 人机验证

## 2. 项目文件结构

```
jindrich/
├── index.html                    # 首页
├── about.html                    # 关于我们
├── contact.html                  # 联系我们（含在线表单）
├── css/
│   └── style.css                 # 全局样式（含表单样式 + 响应式）
├── js/
│   ├── main.js                   # 全局交互（导航栏、动画、滚动）
│   ├── i18n.js                   # 中英双语翻译字典
│   └── contact-form.js           # 表单验证 + Turnstile + 提交逻辑
├── images/
│   ├── logo.svg                  # 品牌 Logo
│   ├── hero-*.png                # Hero 背景图
│   ├── food-*.png                # 食品行业配图
│   ├── beverage-*.png            # 饮料行业配图
│   ├── dairy-*.png               # 乳品行业配图
│   ├── biopharma-*.png           # 生物医药配图
│   └── engineering-*.png         # 工程服务配图
├── services/
│   ├── food.html                 # 食品工程详情
│   ├── beverage.html             # 饮料工程详情
│   ├── dairy.html                # 乳品工程详情
│   └── biopharma.html            # 生物医药详情
├── worker/
│   ├── index.js                  # Cloudflare Worker 后端脚本
│   └── wrangler.toml             # Worker 配置文件
├── cloudflare_deployment_guide.md # Cloudflare Pages 部署指南
├── Phase_1_Completion_Report.md   # 第一阶段完成报告
├── Phase_2_Completion_Report.md   # 第二阶段完成报告
└── Technical_Archive.md           # 本文件
```

## 3. 部署架构

### 3.1 前端部署 (Cloudflare Pages)

| 项目 | 值 |
| --- | --- |
| Pages 项目名 | `jindrich` |
| 关联仓库 | `olavininfo/jindrich` |
| 生产分支 | `main` |
| 部署方式 | GitHub Push → 自动构建部署 |

### 3.2 后端部署 (Cloudflare Worker)

| 项目 | 值 |
| --- | --- |
| Worker 名称 | `jindrich-contact-api` |
| API 地址 | `https://jindrich-contact-api.intechwell.workers.dev/` |
| 部署方式 | Cloudflare Dashboard 手动粘贴代码 |

### 3.3 环境变量 (Worker Secrets)

| 变量名 | 用途 |
| --- | --- |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile 服务端验证密钥 |
| `RESEND_API_KEY` | Resend 邮件 API 密钥 |

### 3.4 Cloudflare Turnstile

| 项目 | 值 |
| --- | --- |
| Site Key (前端) | `0x4AAAAAACmCQX6kwn3mDd8c` |
| Secret Key (后端) | 存储于 Worker 环境变量 |

## 4. 数据流

```
用户填写表单 → 前端校验 → Turnstile 人机验证 → 提交至 Worker API
    → Worker 二次验证 Turnstile Token
    → Worker 校验企业邮箱域名
    → Worker 调用 Resend API 发送 HTML 邮件
    → 返回结果至前端 → 显示成功/失败反馈
```

## 5. 安全措施

1. **Turnstile 双重验证**：前端获取 Token + 后端二次验证
2. **企业邮箱限制**：前端 + 后端双重拦截 40+ 个公共邮箱域名
3. **XSS 防护**：Worker 对所有用户输入做 HTML 实体转义
4. **CORS 策略**：仅允许 POST 和 OPTIONS 请求
5. **密钥隔离**：Turnstile Secret 和 Resend API Key 存储于 Worker Secrets，不暴露在前端代码中

## 6. 维护指南

### 更新前端页面

1. 本地修改代码
2. `git commit` + `git push` 到 `main` 分支
3. Cloudflare Pages 自动部署（通常 1-2 分钟完成）

### 更新 Worker 后端

1. 修改 `worker/index.js`
2. 登录 Cloudflare Dashboard → Workers & Pages → `jindrich-contact-api` → Edit code
3. 粘贴新代码 → Save and Deploy

### 修改收件邮箱

修改 `worker/index.js` 中的 `to` 字段：
```javascript
to: ['new-email@jindrich.com.cn'],
```

### 修改 Turnstile Site Key

修改 `js/contact-form.js` 中 `renderTurnstile()` 函数的 `sitekey` 参数。

## 7. 版本历史

| 版本 | 日期 | 说明 |
| --- | --- | --- |
| v1.0 | 2026-03-03 | 第一阶段：静态网站开发（首页、关于、联系、4个服务页） |
| v2.0 | 2026-03-04 | 第二阶段：联系表单升级 + Cloudflare Worker + Turnstile + Resend |

---
*本文件为项目技术归档，保存于项目根目录下。*
