import * as express from 'express';
import AuthController from './components/auth.controller';
import ProductController from './components/product.controller';
import SystemStatusController from './components/system-status.controller';
import UserController from './components/user.controller';

export default function registerRoutes(app: express.Application): void {
  new AuthController(app);
  new UserController(app);
  new ProductController(app);
  new SystemStatusController(app);
}
