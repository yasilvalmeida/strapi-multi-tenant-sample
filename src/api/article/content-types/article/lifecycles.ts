/**
 * Article lifecycle hooks
 */

export default {
  async afterCreate(event) {
    const { result } = event;

    // Trigger webhook after article creation
    await triggerWebhook({
      tenant_id: result.tenant_id,
      content_type: 'api::article.article',
      action: 'create',
      entry: result,
    });
  },

  async afterUpdate(event) {
    const { result } = event;

    // Trigger webhook after article update
    await triggerWebhook({
      tenant_id: result.tenant_id,
      content_type: 'api::article.article',
      action: 'update',
      entry: result,
    });
  },

  async afterDelete(event) {
    const { result } = event;

    // Trigger webhook after article deletion
    await triggerWebhook({
      tenant_id: result.tenant_id,
      content_type: 'api::article.article',
      action: 'delete',
      entry: result,
    });
  },

  async afterPublish(event) {
    const { result } = event;

    // Trigger webhook after article publish
    await triggerWebhook({
      tenant_id: result.tenant_id,
      content_type: 'api::article.article',
      action: 'publish',
      entry: result,
    });
  },

  async afterUnpublish(event) {
    const { result } = event;

    // Trigger webhook after article unpublish
    await triggerWebhook({
      tenant_id: result.tenant_id,
      content_type: 'api::article.article',
      action: 'unpublish',
      entry: result,
    });
  },
};

// Helper function to trigger webhooks
async function triggerWebhook({ tenant_id, content_type, action, entry }) {
  try {
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
      const payload = {
        tenant_id,
        content_type,
        action,
        entry_id: entry?.id,
        entry_slug: entry?.slug,
        timestamp: new Date().toISOString(),
        trigger_source: 'lifecycle-hook',
      };

      strapi.log.info(`Triggering ${action} webhook for tenant: ${tenant_id}`);
      strapi.log.info(`Webhook payload:`, payload);

      // In a real implementation, you would make the HTTP request:
      // await fetch(webhookUrl, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });
    }
  } catch (error) {
    strapi.log.error('Failed to trigger webhook:', error);
  }
}
