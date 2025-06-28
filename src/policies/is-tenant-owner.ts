/**
 * `is-tenant-owner` policy
 */

export default (policyContext, config, { strapi }) => {
  const { tenant_id } = policyContext.state.user || {};

  if (!tenant_id) {
    return false;
  }

  // If it's a creation request, ensure tenant_id is set
  if (
    policyContext.request.method === 'POST' &&
    policyContext.request.body.data
  ) {
    policyContext.request.body.data.tenant_id = tenant_id;
  }

  // For read operations, add tenant filter
  if (policyContext.request.method === 'GET') {
    policyContext.query = {
      ...policyContext.query,
      filters: {
        ...policyContext.query.filters,
        tenant_id: tenant_id,
      },
    };
  }

  return true;
};
