module.exports = ({ env }) => ({
  email: {
    provider: "sendgrid",
    providerOptions: {
      apiKey: env("SENDGRID_API_KEY"),
    },
    settings: {
      defaultFrom: "developer@johnbxu.ca",
      defaultReplyTo: "developer@johnbxu.ca",
      testAddress: "johnbxu@gmail.com",
    },
  },
});
