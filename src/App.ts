import http from 'http';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';

import ServiceConfig from '../setup/validate/config';
import passportAdapter from './adapters/passport-adapter';
import addErrorHandler from './middleware/error-handler';
import registerRoutes from './routes';
import './adapters/jwt-adapter';

export default class App {
  public express: express.Application;

  public httpServer: http.Server;

  public async init(): Promise<void> {
    this.express = express();
    this.httpServer = http.createServer(this.express);
    this.middleware();
    this.routes();
    passportAdapter();
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
    this.express.use(morgan('combined'));
    this.express.use(helmet({ contentSecurityPolicy: false }));
    this.express.use(express.json({ limit: '100mb' }));
    this.express.use(express.urlencoded({ limit: '100mb', extended: true }));
    this.express.use(cors());
    this.express.use(express.static('static'));
    this.express.use(
      session({
        ...new ServiceConfig().config.service_config.server.cookie_config,
        cookie: { maxAge: 60000 },
      })
    );
    this.express.use(passport.initialize());
    this.express.use(passport.session());
    this.toggleSerialization();
  }

  private toggleSerialization() {
    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((obj, done: any) => {
      done(null, obj);
    });
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
    // this.express.use('*', (req, res) => {
    //   res.status(404).json({
    //     errors: {
    //       msg: 'URL_NOT_FOUND',
    //     },
    //   });
    // });
  }
}
