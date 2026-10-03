const { defineConfig } = require("@adobe/aio-commerce-lib-app/config");

module.exports = defineConfig({
  metadata: {
    description:
      "A custom Adobe Commerce application. Fill description for your app.",
    displayName: "My Commerce Extension",
    id: "my-commerce-extension",
    version: "1.0.0",
  },
  eventing: {
    commerce: [
      {
        events: [
          {
            description: "Use case description for the event.",
            fields: [{ name: "*" }],
            label: "Sample Event",
            name: "plugin.sample_event",
            runtimeActions: ["my-package/handle-sample-event"],
          },
        ],
        provider: {
          description: "A description for your Commerce Events provider.",
          label: "Commerce Events Provider",
        },
      },
    ],
  },
});
