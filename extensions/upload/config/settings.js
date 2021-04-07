if (process.env.NODE_ENV === "production") {
  module.exports = {
    provider: "providerName",
    providerOptions: {
      cloud_name: process.env.PROVIDER_CLOUD_NAME,
      api_key: process.env.PROVIDER_API_KEY,
      api_secret: process.env.PROVIDER_API_SECRET,
    },
  };
} else {
  module.exports = {};
}
