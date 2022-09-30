export const env = () => ({
  app: {
    port: +process.env.PORT,
  },
  database: {
    url: process.env.POSTGRES_URL,
  },
  environment: process.env.NODE_ENV,
  host: {
    api: process.env.HOST_API,
  },
});
