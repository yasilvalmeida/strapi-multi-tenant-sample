# 🌐 Strapi Multi-Tenant CMS

A complete multi-tenancy implementation for **Strapi v5**, enabling you to manage multiple websites or clients from a single backend with complete data isolation.

> ✅ Built for agencies, SaaS builders, and platform developers needing secure tenant separation.

## 🚀 Features

- 🏢 Multi-Tenant Architecture – Full tenant data isolation via `tenant_id`
- 🔐 JWT-based Tenant Identification – Lightweight and secure
- 🔄 Webhook Triggers – Auto-build frontend on content updates (Netlify/Vercel-ready)
- 🧩 Custom Policies & Middleware – Enforce strict access control per tenant
- 🛠️ Lifecycle Hooks – Create/update/delete/publish actions trigger webhooks
- 🧱 Custom Controllers – Tenant-aware logic across all APIs

## 📦 Prerequisites

- Node.js 18+
- npm or yarn
- SQLite (dev) or PostgreSQL (production)

## ⚙️ Setup & Installation

Install dependencies:

```bash
npm install
# or
yarn install
```

Create a `.env` file:

```env
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret
TENANT_A_WEBHOOK_URL=https://api.netlify.com/build_hooks/your-hook
TENANT_B_WEBHOOK_URL=https://api.netlify.com/build_hooks/your-hook
TENANT_C_WEBHOOK_URL=https://api.netlify.com/build_hooks/your-hook
HOST=0.0.0.0
PORT=1337
```

Build & run the app:

```bash
npm run build && npm run develop
# or
yarn build && yarn develop
```

Access: http://localhost:1337/admin

## 🏗️ Architecture Overview

Content Types with Multi-Tenant Field:

- **Articles**: `title`, `content`, `slug`, `tenant_id`, `author`, `published_at`
- **Pages**: `title`, `slug`, `tenant_id`, `seo_title`, `seo_description`, `template`

Tenant Isolation:

- Middleware: Extracts `tenant_id` from JWT and attaches to request
- Policy: Verifies user access by tenant
- Controllers: Inject tenant context and auto-filter responses
- Lifecycle: Triggers webhooks on create/update/delete/publish

## 🔐 Authentication

Generate Tenant JWT:

```js
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { id: user.id, tenant_id: 'tenant-a' },
  process.env.JWT_SECRET
);
```

Use JWT in requests:

```bash
curl -H "Authorization: Bearer your-jwt-token" http://localhost:1337/api/articles
```

## 🧪 Example API Requests

Create Article for Tenant A:

```bash
curl -X POST http://localhost:1337/api/articles \
  -H "Authorization: Bearer [JWT-tenant-a]" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "AI in 2024",
      "content": "Exploring trends in AI...",
      "slug": "ai-2024"
    }
  }'
```

Get Articles for Tenant B:

```bash
curl -H "Authorization: Bearer [JWT-tenant-b]" http://localhost:1337/api/articles
```

## 🔄 Webhooks

Automatic Triggers:

- `entry.create`, `entry.update`, `entry.delete`, `entry.publish`, `entry.unpublish`

Manually Trigger Webhook:

```bash
curl -X POST http://localhost:1337/api/webhooks/trigger-build \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "tenant-a",
    "content_type": "api::article.article",
    "action": "update",
    "entry": {
      "id": 1,
      "slug": "updated-article"
    }
  }'
```

## 🛠 Development

Add new tenant-aware content type:

1. Add `tenant_id` field to schema
2. Create tenant-aware controller
3. Add lifecycle hooks for webhooks

Customize Tenant Detection via middleware (headers, subdomains, query params, etc.)

## 🧰 Scripts

```bash
npm run develop        # Run in dev mode
npm run build          # Build admin panel
npm run start          # Run in production mode
```

## 🚀 Production

Recommended Env Settings:

```env
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_URL=your-prod-db-url
JWT_SECRET=your-prod-secret
```

Security Best Practices:

- Use HTTPS and restrict CORS
- Use strong JWT secrets
- Secure your database
- Enable rate limiting

## 📚 API Endpoints

| Method | Endpoint                       | Description                        |
|--------|--------------------------------|------------------------------------|
| GET    | `/api/articles`               | List articles for tenant           |
| POST   | `/api/articles`               | Create new article                 |
| GET    | `/api/pages`                  | List pages                         |
| POST   | `/api/pages`                  | Create new page                    |
| POST   | `/api/webhooks/trigger-build`| Manually trigger webhook           |
| GET    | `/api/webhooks/config`       | Get current tenant webhook config  |

## 🤝 Contributing

1. Fork the repo  
2. Create a feature branch  
3. Write your changes and tests  
4. Submit a pull request

## 📄 License

MIT License

## 🙋 Support

- Docs: https://docs.strapi.io  
- Issues: https://github.com/strapi/strapi/issues  
- Discord: https://discord.strapi.io

**Happy multi-tenanting! 🎉**
