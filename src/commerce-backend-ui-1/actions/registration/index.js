'use strict';

const extensionId = 'order_enrichment_admin';
const menuSectionId = `${extensionId}::apps`;
const menuItemId = `${extensionId}::enriched_orders`;

/**
 * Admin UI SDK: menu + page shape when Commerce refreshes registrations.
 * Keep in sync with `adminUiSdk.registration` in `app.commerce.config.js`.
 *
 * @returns {Promise<{ statusCode: number, body: object }>}
 */
async function main () {
  return {
    statusCode: 200,
    body: {
      registration: {
        menuItems: [
          {
            id: menuSectionId,
            title: 'Order Enrichment',
            isSection: true,
            sortOrder: 100,
          },
          {
            id: menuItemId,
            title: 'Enriched Orders',
            parent: menuSectionId,
            sortOrder: 1,
          },
        ],
        page: {
          title: 'Enriched Orders Dashboard',
        },
      },
    },
  };
}

exports.main = main;
