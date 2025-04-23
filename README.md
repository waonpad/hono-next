# Next.jsにHonoを組み込む構成のテスト

フロントはほぼ何も書いていない

## 内容

- Next.js
- Hono
  - Zod OpenAPI
  - RPC
- Prisma
- Lucia Auth

## セットアップ

### 依存関係インストールと.envのコピー

```bash
bun run setup
```

### PostgreSQLの起動、マイグレーション

```bash
docker compose up -d
```

```bash
bun run db:mig
```

### GitHub OAuthアプリの作成

.envファイルを見てリンク先から作成してください。

## 開発

### Next.jsの起動

```bash
bun dev
```

### 補足

#### Swagger UIの利用

<http://localhost:3000/api/doc>

#### Hono RPCの利用

```typescript
import { client } from "@/lib/hono/client";
```

##### Hono RPCの型情報の高速化

ルートの型を事前に生成する  
このコマンドを利用した後最新の型が必要になった場合は再度実行するか、`types/hono-rpc` ディレクトリを削除

```bash
bun run type:hono-rpc
```
