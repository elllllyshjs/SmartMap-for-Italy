# Google Maps API Key 申请指南

Smart Map for Italy 需要一个 Google Maps API Key 才能显示地图、搜索地点和计算路线。跟着下面的步骤操作，大约 10 分钟可以完成。

## 1. 创建 Google Cloud 项目

1. 打开 https://console.cloud.google.com/ ，用你的 Google 账号登录
2. 首次使用会提示接受服务条款，同意即可
3. 点击顶部导航栏的项目选择器 → "新建项目"
4. 项目名称填 `smart-map-italy`（随意），点击"创建"
5. 创建完成后，确保顶部项目选择器切换到了这个新项目

## 2. 开通结算账号（Billing）

Places API 和 Directions API 要求项目绑定信用卡才能使用，但 **Google 每月提供 $200 免费额度**，个人 12 天行程的用量（几十次地点搜索、几十次路线计算）远低于这个额度，正常使用不会实际扣费。

1. 左侧菜单 → "结算" → "关联结算账号"
2. 按提示添加一张信用卡（Visa/Mastercard 均可）
3. 完成后返回项目

> 如果不放心，可以在结算账号里设置"预算和提醒"，超过比如 $5 就发邮件提醒你。

## 3. 启用需要的 API

左侧菜单 → "API 和服务" → "库"，依次搜索并点击"启用"下面这三个：

- **Maps JavaScript API** — 用于显示地图本身
- **Places API (New)** — 用于搜索景点/餐厅/酒店并获取中文简介、评分、图片
- **Directions API** — 用于计算行程中地点之间的路线与耗时

## 4. 创建 API Key

1. 左侧菜单 → "API 和服务" → "凭据"
2. 点击顶部"创建凭据" → "API 密钥"
3. 创建后会弹出一串密钥，先复制保存下来
4. 点击这个新密钥进入编辑页面，做下面两项限制（**重要，不要跳过**）：

### 4.1 应用限制（防止密钥被盗用后乱扣费）

选择"网站"，在"网站限制"里添加（注意要带协议头 `http://` 和端口号，纯 `localhost:*` 经常匹配不上）：

```
http://localhost:5173/*
http://localhost:5173
http://127.0.0.1:5173/*
```

保存后**等 1-2 分钟**让配置生效，不是实时的。

以后如果把网站部署到线上（比如 Vercel/Netlify），记得把部署后的域名也加进来，例如 `https://your-site.vercel.app/*`。

### 4.2 API 限制

选择"限制密钥"，勾选：
- Maps JavaScript API
- Places API (New)
- Directions API

点击"保存"。

## 5. 把密钥填入项目

1. 在项目根目录，复制一份 `.env.example` 并改名为 `.env.local`：
   ```bash
   cp .env.example .env.local
   ```
2. 打开 `.env.local`，把 `your_api_key_here` 换成你刚才创建的密钥：
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSy...你的密钥
   ```
3. 保存文件。`.env.local` 已经在 `.gitignore` 里，不会被提交到 git，密钥是安全的。

## 6. 验证

运行：
```bash
npm run dev
```
打开浏览器访问终端里显示的地址（通常是 http://localhost:5173），如果地图正常显示出意大利，就说明配置成功了。

## 常见问题

**地图显示"此页面无法正确加载 Google 地图"**
- 通常是账单未开通，或者 API 未启用完全，等几分钟再刷新试试

**地图能显示但搜不到地点/看不到中文**
- 检查 Places API (New) 是否已启用
- 检查密钥的"API 限制"里是否勾选了 Places API (New)

**担心费用**
- 在"结算" → "预算和提醒"里设置一个较低的预算阈值（如 $5），超过会邮件通知你，个人短期使用基本不会触发

**地点搜索报错 403 `API_KEY_HTTP_REFERRER_BLOCKED`**
- 说明密钥的"网站限制"没匹配上当前地址，去凭据页面把 4.1 步里的三条 referrer 都加上，保存后等 1-2 分钟再试
