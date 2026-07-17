# Smart Map for Italy

一个为 2026 年 8 月意大利 12 天行程打造的中文地图 + 行程规划工具。

## 功能

1. **地图浏览**：切换意大利大区/城市，中文显示热门景点、餐厅、酒店、其他地点，点击地点查看中文简介、评分、地址、图片
2. **行程规划**：12 天拖拽式看板，从地图"加入行程"，同一天内地点可拖拽排序，自动计算当天步行路线与耗时
3. 纯前端应用，行程数据保存在浏览器本地（localStorage），支持导出/导入 JSON 备份

## 快速开始

```bash
npm install
cp .env.example .env.local   # 然后按 SETUP_GOOGLE_API.md 申请并填入 API Key
npm run dev
```

打开终端提示的地址（通常是 http://localhost:5173）即可使用。

首次运行前必须完成 [SETUP_GOOGLE_API.md](./SETUP_GOOGLE_API.md) 里的 Google Maps API Key 申请步骤，否则页面会提示"还没有配置 Google Maps API Key"。

## 技术栈

- React + TypeScript + Vite
- Google Maps JavaScript API / Places API (New) / Directions API（统一 `languageCode=zh-CN`）
- Zustand（状态管理，行程数据自动持久化到 localStorage）
- dnd-kit（行程看板拖拽）
- Tailwind CSS

## 目录结构

详见项目根目录下开发时约定的结构，核心代码都在 `src/` 下：

- `src/config` — 大区列表、地点分类等常量
- `src/types` — 全局 TypeScript 类型
- `src/lib` — Places/Directions API 封装、localStorage 导入导出
- `src/store` — Zustand 状态（地图状态 / 行程状态）
- `src/components/map` — 地图浏览相关组件
- `src/components/itinerary` — 行程规划相关组件
- `src/components/common` — 通用组件（Header/Modal/Loading）
- `src/pages` — 地图浏览页 / 行程规划页

## 常见问题

费用、地图无法加载等问题见 [SETUP_GOOGLE_API.md](./SETUP_GOOGLE_API.md) 底部的常见问题部分。
