import * as express from 'express';
import AuthController from './components/auth.controller';
import ProductController from './components/product.controller';
import SystemStatusController from './components/system-status.controller';
import UserController from './components/user.controller';

export default function registerRoutes(app: express.Application): void {
  new SystemStatusController(app);
  new UserController(app);
  new AuthController(app);
}
