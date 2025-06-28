/**
 * webhook router
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/webhooks/trigger-build',
      handler: 'webhook.triggerBuild',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/webhooks/config',
      handler: 'webhook.listWebhooks',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
