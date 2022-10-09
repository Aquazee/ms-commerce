import http from 'http';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import addErrorHandler from './middleware/error-handler';
import registerRoutes from './routes';

export default class App {
  public express: express.Application;

  public httpServer: http.Server;

  public async init(): Promise<void> {
    this.express = express();
    this.httpServer = http.createServer(this.express);
    this.middleware();
    this.routes();
    this.addErrorHandler();
  }

  /**
   * here register your all routes
   */
  private routes(): void {
    this.express.get('/', this.basePathRoute);
    this.express.get('/web', this.parseRequestHeader, this.basePathRoute);
    registerRoutes(this.express);
  }

  /**
   * here you can apply your middlewares
   */
  private middleware(): void {
    // support application/json type post data
    // support application/x-www-form-urlencoded post data
    // Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
    this.express.use(helmet({ contentSecurityPolicy: false }));
    this.express.use(express.json({ limit: '100mb' }));
    this.express.use(express.urlencoded({ limit: '100mb', extended: true }));
    this.express.use(cors());
  }

  private parseRequestHeader(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    // parse request header
    // console.log(req.headers.access_token);
    next();
  }

  private basePathRoute(
    request: express.Request,
    response: express.Response
  ): void {
    response.json({ message: 'base path' });
  }

  private addErrorHandler(): void {
    this.express.use(addErrorHandler);
  }
}
