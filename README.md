# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>

# Strapi Multi-Tenant CMS

A complete multi-tenancy implementation for Strapi v5 that allows you to serve multiple websites/clients using a single Strapi backend with complete data isolation.

## 🚀 Features

- **Multi-Tenant Architecture**: Complete data isolation between tenants using `tenant_id`
- **JWT-based Tenant Identification**: Tenant information embedded in JWT tokens
- **Automatic Webhook Triggers**: Frontend build webhooks triggered on content changes
- **Content Type Isolation**: All content types include tenant_id for data separation
- **Policy-based Access Control**: Middleware and policies ensure tenant data security
- **Lifecycle Hooks**: Automatic webhook triggers on create, update, delete, publish, unpublish

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Database (SQLite included for development)

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Strapi
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# Multi-Tenant Webhook URLs (optional)
TENANT_A_WEBHOOK_URL=https://api.netlify.com/build_hooks/your-tenant-a-build-hook
TENANT_B_WEBHOOK_URL=https://api.netlify.com/build_hooks/your-tenant-b-build-hook
TENANT_C_WEBHOOK_URL=https://api.netlify.com/build_hooks/your-tenant-c-build-hook

# Server
HOST=0.0.0.0
PORT=1337
```

### 3. Build and Start the Application

```bash
# Build the admin panel
npm run build

# Start the application
npm run develop
```

The Strapi admin panel will be available at `http://localhost:1337/admin`

## 🏗️ Multi-Tenancy Architecture

### Content Types

The project includes two example content types with multi-tenancy support:

#### Articles (`api::article.article`)

- `title` (string, required)
- `content` (richtext, required)
- `slug` (uid, required)
- `tenant_id` (string, required) - **Multi-tenant identifier**
- `featured_image` (media)
- `author` (string)
- `published_at` (datetime)

#### Pages (`api::page.page`)

- `title` (string, required)
- `content` (richtext, required)
- `slug` (uid, required)
- `tenant_id` (string, required) - **Multi-tenant identifier**
- `seo_title` (string)
- `seo_description` (text)
- `hero_image` (media)
- `template` (enumeration: default, landing, about, contact)

### Access Control

The system implements multi-layered access control:

1. **Tenant Isolation Middleware** (`src/middlewares/tenant-isolation.ts`)

   - Extracts `tenant_id` from JWT tokens
   - Adds tenant context to all requests

2. **Tenant Owner Policy** (`src/policies/is-tenant-owner.ts`)

   - Ensures users can only access their tenant's content
   - Automatically filters queries by `tenant_id`

3. **Custom Controllers**
   - Override default CRUD operations
   - Enforce tenant-based data isolation
   - Auto-assign `tenant_id` on content creation

## 🔐 Authentication & JWT Configuration

### Creating Tenant-Aware JWTs

When creating JWT tokens for API access, include the `tenant_id` in the payload:

```javascript
const jwt = require('jsonwebtoken');

const payload = {
  id: userId,
  tenant_id: 'tenant-a', // This identifies which tenant the user belongs to
  // ... other user data
};

const token = jwt.sign(payload, process.env.JWT_SECRET);
```

### Using JWTs in API Requests

Include the JWT token in the Authorization header:

```bash
curl -H "Authorization: Bearer your-jwt-token" \
     http://localhost:1337/api/articles
```

## 🌐 Simulating Multiple Websites

### Scenario: Three Different Websites

Let's simulate three different websites using the same Strapi backend:

#### Website A - Tech Blog (tenant-a)

#### Website B - Fashion Magazine (tenant-b)

#### Website C - Food Blog (tenant-c)

### Step 1: Create Users for Each Tenant

1. Access the Strapi admin panel at `http://localhost:1337/admin`
2. Go to **Settings** → **Users & Permissions Plugin** → **Users**
3. Create users and assign them to different tenants via JWT tokens

### Step 2: Create Content for Each Tenant

Using different JWT tokens (with different `tenant_id` values), create content:

#### For Tenant A (Tech Blog):

```bash
# Create a tech article for tenant-a
curl -X POST http://localhost:1337/api/articles \
  -H "Authorization: Bearer [JWT-with-tenant-a]" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "The Future of AI",
      "content": "Exploring artificial intelligence trends...",
      "slug": "future-of-ai",
      "author": "Tech Writer"
    }
  }'
```

#### For Tenant B (Fashion Magazine):

```bash
# Create a fashion article for tenant-b
curl -X POST http://localhost:1337/api/articles \
  -H "Authorization: Bearer [JWT-with-tenant-b]" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Spring Fashion Trends 2024",
      "content": "This season's must-have styles...",
      "slug": "spring-fashion-2024",
      "author": "Fashion Editor"
    }
  }'
```

#### For Tenant C (Food Blog):

```bash
# Create a recipe for tenant-c
curl -X POST http://localhost:1337/api/articles \
  -H "Authorization: Bearer [JWT-with-tenant-c]" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Perfect Pasta Recipe",
      "content": "Step-by-step guide to making pasta...",
      "slug": "perfect-pasta-recipe",
      "author": "Chef Master"
    }
  }'
```

### Step 3: Verify Tenant Isolation

Each tenant will only see their own content:

```bash
# Tenant A will only see tech articles
curl -H "Authorization: Bearer [JWT-with-tenant-a]" \
     http://localhost:1337/api/articles

# Tenant B will only see fashion articles
curl -H "Authorization: Bearer [JWT-with-tenant-b]" \
     http://localhost:1337/api/articles

# Tenant C will only see food articles
curl -H "Authorization: Bearer [JWT-with-tenant-c]" \
     http://localhost:1337/api/articles
```

## 🪝 Webhook System

The system automatically triggers webhooks when content changes occur.

### Webhook Events

- `entry.create` - When new content is created
- `entry.update` - When content is updated
- `entry.delete` - When content is deleted
- `entry.publish` - When content is published
- `entry.unpublish` - When content is unpublished

### Manual Webhook Triggers

You can also manually trigger webhooks:

```bash
# Trigger a build webhook for a specific tenant
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

### Get Webhook Configuration

```bash
# Get webhook configuration for authenticated tenant
curl -H "Authorization: Bearer [your-jwt-token]" \
     http://localhost:1337/api/webhooks/config
```

## 🔧 Development & Customization

### Adding New Content Types

To add a new multi-tenant content type:

1. **Create the schema** with `tenant_id` field:

```json
{
  "attributes": {
    // ... your fields
    "tenant_id": {
      "type": "string",
      "required": true,
      "private": false
    }
  }
}
```

2. **Create custom controller** with tenant-aware methods
3. **Add lifecycle hooks** for webhook triggers
4. **Update webhook configuration** to include the new content type

### Customizing Webhook Behavior

Edit the lifecycle files to customize webhook behavior:

- `src/api/article/content-types/article/lifecycles.ts`
- `src/api/page/content-types/page/lifecycles.ts`

### Extending Tenant Isolation

The tenant isolation middleware can be extended to support additional tenant identification methods:

- URL subdomain parsing
- Custom headers
- Query parameters

## 🐛 Troubleshooting

### Common Issues

1. **"Tenant ID not found in token"**

   - Ensure your JWT token includes the `tenant_id` field
   - Verify the token is properly formatted and signed

2. **"Access denied to this tenant's content"**

   - The content belongs to a different tenant
   - Check that you're using the correct JWT token

3. **Webhooks not triggering**
   - Check the console logs for webhook trigger attempts
   - Verify webhook URLs are configured correctly
   - Ensure the content has a valid `tenant_id`

### Debug Mode

Enable debug logging by setting the log level in your environment:

```env
LOG_LEVEL=debug
```

## 🚀 Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_URL=your-production-database-url
# ... other production configs
```

### Security Considerations

1. **JWT Security**: Use strong secrets and consider token expiration
2. **Database Security**: Implement proper database access controls
3. **CORS Configuration**: Configure CORS for your frontend domains
4. **Rate Limiting**: Implement rate limiting for API endpoints

## 📚 API Reference

### Articles API

- `GET /api/articles` - List articles (filtered by tenant)
- `GET /api/articles/:id` - Get single article (tenant-verified)
- `POST /api/articles` - Create article (auto-assigns tenant_id)
- `PUT /api/articles/:id` - Update article (tenant-verified)
- `DELETE /api/articles/:id` - Delete article (tenant-verified)

### Pages API

- `GET /api/pages` - List pages (filtered by tenant)
- `GET /api/pages/:id` - Get single page (tenant-verified)
- `POST /api/pages` - Create page (auto-assigns tenant_id)
- `PUT /api/pages/:id` - Update page (tenant-verified)
- `DELETE /api/pages/:id` - Delete page (tenant-verified)

### Webhooks API

- `POST /api/webhooks/trigger-build` - Manually trigger build webhook
- `GET /api/webhooks/config` - Get webhook configuration for tenant

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the troubleshooting section above
- Review Strapi documentation: https://docs.strapi.io
- Open an issue in the repository

---

**Happy Multi-Tenanting! 🎉**
