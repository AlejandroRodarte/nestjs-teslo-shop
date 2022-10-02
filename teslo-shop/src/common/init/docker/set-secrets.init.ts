import * as fs from 'fs';

const setSecrets = () => {
  const postgresUrl = fs
    .readFileSync(process.env.POSTGRES_URL_FILE!, 'utf-8')
    .trim();
  const jwtSecret = fs
    .readFileSync(process.env.JWT_SECRET_FILE!, 'utf-8')
    .trim();

  process.env.POSTGRES_URL = postgresUrl;
  process.env.JWT_SECRET = jwtSecret;
};

if (['production-docker', 'development-docker'].includes(process.env.NODE_ENV!))
  setSecrets();
