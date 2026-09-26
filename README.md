# 家居装修全流程管理平台

## Docker 启动

```bash
docker compose up --build
```

- 前端访问地址：http://localhost:18805
- 后端健康检查：http://localhost:19305/api/health

本项目 Docker Compose 默认端口为前端 80、后端 3000，可用环境变量覆盖：

```bash
FRONTEND_PORT=18805 BACKEND_PORT=19305 docker compose up --build
```

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | React 18、TypeScript、Vite、Ant Design 5、ECharts、Zustand |
| 后端 | NestJS、TypeScript、TypeORM、JWT、Multer |
| 数据库 | MySQL 8.0 |
| 部署 | Docker Compose、Nginx |

## 目录结构

```text
frontend/src/
  api/ stores/ types/ components/common/ hooks/ pages/ router/ utils/ constants/
backend/src/
  routes/ controllers/ services/ models/ middlewares/ types/ utils/ config/ database/
```

## 枚举位置

- 后端枚举：`backend/src/types/enums.ts`
- 前端枚举：`frontend/src/types/enums.ts`

## License

MIT
