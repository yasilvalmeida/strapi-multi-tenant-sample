/**
 * webhook controller
 */

export default {
  async triggerBuild(ctx) {
    try {
      const { tenant_id, content_type, action, entry } = ctx.request.body;

      // Log the webhook trigger
      strapi.log.info(
        `Webhook triggered for tenant: ${tenant_id}, content_type: ${content_type}, action: ${action}`
      );

      // Simulate calling external build webhook
      const buildPayload = {
        tenant_id,
        content_type,
        action,
        entry_id: entry?.id,
        entry_slug: entry?.slug,
        timestamp: new Date().toISOString(),
        trigger_source: 'strapi-webhook',
      };

      // In a real scenario, you would make HTTP requests to your build services
      // For now, we'll simulate different webhook endpoints for different tenants
      const webhookUrls = {
        'tenant-a':
          process.env.TENANT_A_WEBHOOK_URL ||
          'https://hooks.netlify.com/build_hooks/tenant-a-build-id',
        'tenant-b':
          process.env.TENANT_B_WEBHOOK_URL ||
          'https://hooks.netlify.com/build_hooks/tenant-b-build-id',
        'tenant-c':
          process.env.TENANT_C_WEBHOOK_URL ||
          'https://hooks.netlify.com/build_hooks/tenant-c-build-id',
      };

      const webhookUrl = webhookUrls[tenant_id];

      if (webhookUrl) {
        // Simulate the webhook call (in production, use fetch or axios)
        strapi.log.info(
          `Simulating build trigger for ${tenant_id} at ${webhookUrl}`
        );
        strapi.log.info(`Build payload:`, buildPayload);

        // In a real implementation, you would do:
        // await fetch(webhookUrl, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(buildPayload)
        // });

        ctx.send({
          success: true,
          message: `Build webhook triggered for tenant: ${tenant_id}`,
          webhook_url: webhookUrl,
          payload: buildPayload,
        });
      } else {
        ctx.badRequest(`No webhook URL configured for tenant: ${tenant_id}`);
      }
    } catch (error) {
      strapi.log.error('Webhook trigger failed:', error);
      ctx.internalServerError('Failed to trigger webhook');
    }
  },

  async listWebhooks(ctx) {
    const { tenant_id } = ctx.state.user || {};

    if (!tenant_id) {
      return ctx.unauthorized('Tenant ID not found in token');
    }

    // Return webhook configuration for the tenant
    const webhookConfig = {
      tenant_id,
      webhook_url:
        process.env[
          `${tenant_id.toUpperCase().replace('-', '_')}_WEBHOOK_URL`
        ] || `https://hooks.netlify.com/build_hooks/${tenant_id}-build-id`,
      supported_events: [
        'entry.create',
        'entry.update',
        'entry.delete',
        'entry.publish',
        'entry.unpublish',
      ],
      content_types: ['api::article.article', 'api::page.page'],
    };

    ctx.send({
      data: webhookConfig,
    });
  },
};
