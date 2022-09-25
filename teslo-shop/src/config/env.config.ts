export const env = () => ({
  app: {
    port: +process.env.PORT,
  },
  database: {
    url: process.env.POSTGRES_URL,
  },
  environment: process.env.NODE_ENV,
});
