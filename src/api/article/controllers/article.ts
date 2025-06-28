/**
 * article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::article.article',
  ({ strapi }) => ({
    // Custom find method that respects tenant_id
    async find(ctx) {
      const { tenant_id } = ctx.state.user || {};

      if (!tenant_id) {
        return ctx.unauthorized('Tenant ID not found in token');
      }

      // Add tenant_id filter to the query
      const existingFilters = (ctx.query?.filters as Record<string, any>) || {};
      ctx.query = {
        ...ctx.query,
        filters: {
          ...existingFilters,
          tenant_id: tenant_id,
        },
      };

      const { data, meta } = await super.find(ctx);
      return { data, meta };
    },

    // Custom findOne method that respects tenant_id
    async findOne(ctx) {
      const { tenant_id } = ctx.state.user || {};

      if (!tenant_id) {
        return ctx.unauthorized('Tenant ID not found in token');
      }

      const { id } = ctx.params;

      // Find the entity and check tenant_id
      const entity = await strapi.entityService.findOne(
        'api::article.article',
        id,
        {
          populate: '*',
        }
      );

      if (!entity) {
        return ctx.notFound('Article not found');
      }

      if (entity.tenant_id !== tenant_id) {
        return ctx.forbidden("Access denied to this tenant's content");
      }

      return { data: entity };
    },

    // Custom create method that auto-assigns tenant_id
    async create(ctx) {
      const { tenant_id } = ctx.state.user || {};

      if (!tenant_id) {
        return ctx.unauthorized('Tenant ID not found in token');
      }

      // Automatically assign tenant_id from JWT
      ctx.request.body.data.tenant_id = tenant_id;

      const response = await super.create(ctx);
      return response;
    },

    // Custom update method that respects tenant_id
    async update(ctx) {
      const { tenant_id } = ctx.state.user || {};
      const { id } = ctx.params;

      if (!tenant_id) {
        return ctx.unauthorized('Tenant ID not found in token');
      }

      // Check if the entity belongs to the tenant
      const entity = await strapi.entityService.findOne(
        'api::article.article',
        id
      );

      if (!entity) {
        return ctx.notFound('Article not found');
      }

      if (entity.tenant_id !== tenant_id) {
        return ctx.forbidden("Access denied to this tenant's content");
      }

      // Ensure tenant_id cannot be changed
      if (
        ctx.request.body.data.tenant_id &&
        ctx.request.body.data.tenant_id !== tenant_id
      ) {
        delete ctx.request.body.data.tenant_id;
      }

      const response = await super.update(ctx);
      return response;
    },

    // Custom delete method that respects tenant_id
    async delete(ctx) {
      const { tenant_id } = ctx.state.user || {};
      const { id } = ctx.params;

      if (!tenant_id) {
        return ctx.unauthorized('Tenant ID not found in token');
      }

      // Check if the entity belongs to the tenant
      const entity = await strapi.entityService.findOne(
        'api::article.article',
        id
      );

      if (!entity) {
        return ctx.notFound('Article not found');
      }

      if (entity.tenant_id !== tenant_id) {
        return ctx.forbidden("Access denied to this tenant's content");
      }

      const response = await super.delete(ctx);
      return response;
    },
  })
);
