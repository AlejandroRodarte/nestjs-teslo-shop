import * as Joi from 'joi';
import { postgresUriRegex } from '../common/regex/postgres-uri.regex';

interface IEnvSchema {
  NODE_ENV: Joi.StringSchema;
  PORT: Joi.NumberSchema;
  POSTGRES_URL: Joi.StringSchema;
}

const nodeEnvSchema = Joi.string()
  .required()
  .valid('development-docker', 'production-docker');
const portSchema = Joi.number().default(3000);
const postgresUrlSchema = Joi.string().required().regex(postgresUriRegex);

export const EnvSchema = Joi.object<IEnvSchema>().keys({
  NODE_ENV: nodeEnvSchema,
  PORT: portSchema,
  POSTGRES_URL: postgresUrlSchema,
});
