/**
 * `tenant-isolation` middleware
 */

import jwt from 'jsonwebtoken';

export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Extract JWT token from Authorization header
    const token = ctx.request.header.authorization?.replace('Bearer ', '');

    if (token) {
      try {
        // Decode JWT without verification (Strapi will handle verification)
        const decoded = jwt.decode(token) as any;

        // Add tenant_id to user context if it exists in token
        if (decoded && decoded.tenant_id && ctx.state.user) {
          ctx.state.user.tenant_id = decoded.tenant_id;
        }
      } catch (error) {
        strapi.log.warn(
          'Failed to decode JWT token for tenant isolation:',
          error
        );
      }
    }

    await next();
  };
};
