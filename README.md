# 科研试剂与耗材库存管理 API 服务

## Docker 启动

```bash
docker compose up --build
```

Swagger 地址：http://localhost:19303/api-docs

本服务提供试剂、耗材、入库、领用、盘点和低库存预警 API。默认鉴权支持在请求头传入 `Authorization: Bearer <jwt>`，也支持开发调试头 `x-user-role`、`x-user-id`。

## 技术栈

| 类型 | 技术 |
| --- | --- |
| 后端框架 | NestJS + TypeScript |
| 数据库 | PostgreSQL 15 |
| ORM | TypeORM |
| 缓存 | Redis 7 |
| 认证 | JWT |
| API 文档 | Swagger |
| 编排 | Docker Compose |

## 目录结构

```text
backend/src/
├── routes/
├── controllers/
├── services/
├── models/
├── middlewares/
├── types/
├── utils/
├── config/
└── database/
```

枚举定义位于 `backend/src/types/enums.ts`，包含 HazardLevel、UsageStatus、StorageCondition、ItemType、QCResult 等。

## License

MIT
