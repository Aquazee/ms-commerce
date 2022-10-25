import { Request } from 'express';
import passport from 'passport';
import JwtStrategy from 'passport-jwt';
import ServiceConfig from '../../setup/validate/config';
import { IUser } from '../interfaces/user.interface';
import Crypto from '../lib/crypto';
import UserService from '../services/user.service';

const { jwt_config, crypto_config } = new ServiceConfig().config.service_config
  .server;
/**
 * Extracts token from: header, body or query
 * @param {Object} req - request object
 * @returns {string} token - decrypted token
 */
const jwtExtractor = (req: Request) => {
  let token = null;
  if (req.headers.authorization) {
    token = req.headers.authorization.replace('Bearer ', '').trim();
  } else if (req.body.token) {
    token = req.body.token.trim();
  }
  if (token) {
    // Decrypts token
    token = Crypto.decrypt(token, crypto_config.secret);
  }
  return token;
};

/**
 * Options object for jwt middlware
 */
const jwtOptions = {
  jwtFromRequest: jwtExtractor,
  secretOrKey: jwt_config.secret,
};

/**
 * Login with JWT middleware
 */
const jwtLogin = new JwtStrategy.Strategy(
  jwtOptions,
  async (payload, done: any) => {
    const user = await new UserService().getUserById(payload.data._id);
    return !user ? done(null, false) : done(null, user);
  }
);

passport.use(jwtLogin);
