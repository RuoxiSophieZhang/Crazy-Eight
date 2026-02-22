# Crazy Eights - 8点纸牌

一个功能完整的经典 8 点 (Crazy Eights) 纸牌游戏，支持 AI 对战和响应式布局。

## 技术栈
- **React 19**
- **Tailwind CSS 4**
- **Motion** (Framer Motion)
- **Lucide React** (图标)
- **Canvas Confetti** (胜利特效)

## 本地开发

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

## 部署到 Vercel

1. **同步到 GitHub**:
   - 在 GitHub 上创建一个新的仓库。
   - 在本地初始化 git 并提交代码：
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git remote add origin <your-github-repo-url>
     git push -u origin main
     ```

2. **在 Vercel 上部署**:
   - 登录 [Vercel](https://vercel.com)。
   - 点击 "Add New" -> "Project"。
   - 选择你刚才上传的 GitHub 仓库。
   - **Framework Preset** 选择 `Vite`。
   - **Build Command** 保持默认：`npm run build`。
   - **Output Directory** 保持默认：`dist`。
   - 点击 "Deploy"。

3. **环境变量**:
   - 如果你在代码中使用了 Gemini API，请在 Vercel 的项目设置中添加 `GEMINI_API_KEY` 环境变量。
