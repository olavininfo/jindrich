# Cloudflare Pages 部署指南

您的代码已经成功推送到 GitHub 仓库 (https://github.com/olavininfo/jindrich)。接下来，只需要在 Cloudflare 简单设置几步，即可实现自动部署和永久免费的极速访问。

## 步骤 1：登录 Cloudflare 并在侧边栏选择 Pages

1. 登录您的 [Cloudflare 账号](https://dash.cloudflare.com/)。
2. 在左侧导航菜单（侧边栏）中，找到 **Workers & Pages** 并点击。
3. 在新页面的标签页中选择 **Pages**。

## 步骤 2：连接 GitHub

1. 点击蓝色的 **Connect to Git (连接到 Git)** 按钮。
2. 系统会引导您授权 Cloudflare 访问您的 GitHub 账号。点击授权并绑定。
3. 授权成功后，您会看到一个包含您 GitHub 仓库的列表。
4. 选择我们刚刚推送的仓库：`olavininfo/jindrich`。
5. 点击 **Begin setup (开始设置)**。

## 步骤 3：配置构建设置 (非常重要)

在项目设置页面，您需要核对以下信息（部分是默认填好的）：

- **Project name (项目名称)**：可以保持默认的 `jindrich`。
- **Production branch (生产分支)**：默认是 `main`，保持不变。
- **Framework preset (框架预设)**：选择 `None` (无)。
- **Build command (构建命令)**：**留空** (什么都不要填，由于我们是纯静态 HTML 网站，不需要构建)。
- **Build output directory (构建输出目录)**：**留空** 或者填 `/` 或者 `./`（什么都不填通常是最稳妥的），这意味着整个根目录都是网站文件。

> ⚠️**注意**：不需要任何 Build command，因为这不是 React 或 Vue 项目。框架预设务必选 `None`。

## 步骤 4：保存并部署

1. 检查无误后，点击页面底部的 **Save and Deploy (保存并部署)** 按钮。
2. 此时屏幕会显示一个正在转圈的部署进度条，大概几秒到十几秒即可完成。
3. 完成后，会出现一个 `*.pages.dev` 的免费二级域名（例如：`jindrich.pages.dev`），点击该链接即可访问您的网站！

---

## ✅ 如何绑定自定义域名 (www.jindrich.com.cn)

当您的 `.pages.dev` 测试域名确认访问无误后：

1. 在当前项目面板中，点击顶部菜单的 **Custom domains (自定义域)** 标签。
2. 点击 **Set up a custom domain (设置自定义域)**。
3. 输入您的域名：`www.jindrich.com.cn`，然后再接着输入 `jindrich.com.cn`（建议带 `www` 和不带 `www` 的都绑定上）。
4. Cloudflare 会自动引导您添加 DNS CNAME 记录。如果您的域名本身就是通过 Cloudflare 解析的，直接点击确认自动添加即可；如果在国内服务器购买的，请前往阿里云/腾讯云后台根据 Cloudflare 的提示添加两根 CNAME 记录。

## 🚀 后续更新说明 (CI/CD 自动部署)

设置完成以后，您**永远不需要再手动上传文件**到任何 FTP 或是服务器了。
当网站未来需要修改文字或图片时，只要将修改后的代码 `Push` 到这个 GitHub 仓库，Cloudflare 就会在 5 秒钟内**自动触发更新**并在全球边缘节点同步上线。
