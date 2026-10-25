/**
 * Must match `extension-manifest.json` `id`.
 * Allowed chars for menu-related ids: letters, digits, / : _
 */
export const extensionId = 'order_enrichment_admin';

export const menuSectionId = `${extensionId}::apps`;
export const menuItemId = `${extensionId}::enriched_orders`;