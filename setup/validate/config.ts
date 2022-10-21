import fs from 'fs';
import path from 'path';
import joi from 'joi';
import yaml from 'js-yaml';
import logger from '../../src/lib/logger';
import { IServiceConfig } from './config.interface';

const smtpConfigSchema = joi.object({
  host: joi.string().required(),
  port: joi.number().required(),
  auth: joi.object({
    user: joi.string().required(),
    pass: joi.string().required(),
  }),
});

const rabbitMqConfigSchema = joi.object({
  host: joi.string().required(),
  port: joi.number().required(),
  channel: joi.number().required(),
  auth: joi.object({
    user: joi.string().required(),
    pass: joi.string().required(),
  }),
});

const serviceConfigSchema = joi.object({
  service_config: joi.object({
    environment: joi.string().required(),
    server: joi
      .object({
        public_port: joi.string(),
      })
      .required(),
    infrastructure: joi.object({
      database: joi.object({
        enabled: joi.string().valid('mongodb').required(),
        mongodb: joi.object({
          host: joi.string().required(),
          port: joi.number().required(),
          name: joi.string().required(),
        }),
      }),
      elasticsearch: joi.object({
        protocol: joi.string().valid('http', 'https').required(),
        host: joi.string().required(),
        port: joi.number().required(),
        error_indexes: joi.object({
          all_errors: joi.object({
            index: joi.string().required(),
            type: joi.string().required(),
          }),
        }),
      }),
      queue_service: joi.object({}),
    }),
    third_party: joi.object({
      enabled: joi.string().optional(),
      type: joi.object({
        gmail: smtpConfigSchema,
        ses: smtpConfigSchema,
      }),
    }),
  }),
});

export default class ServiceConfig {
  public config: IServiceConfig;

  constructor() {
    this.init();
  }

  init() {
    try {
      const serviceConfig = yaml.load(
        fs.readFileSync(
          path.resolve(`${process.cwd()}/setup/configs/config.yml`),
          'utf8'
        )
      );
      serviceConfigSchema.validate(serviceConfig);

      this.config = serviceConfig as IServiceConfig;
      this.config.service_config.server.root_path = process.cwd();
    } catch (e) {
      logger.error('Service Config valdation error', e);
    }
  }
}
