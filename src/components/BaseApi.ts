import { Application, Router } from 'express';
import ServiceConfig from '../../setup/validate/config';

/**
 * Provides services common to all API methods
 */
export default abstract class BaseApi {
  protected router: Router;

  public config = new ServiceConfig().config.service_config;

  protected constructor() {
    this.router = Router();
  }

  public abstract register(express: Application): void;
}
