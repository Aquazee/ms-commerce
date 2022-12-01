// import jwt from 'jwt-simple';
import passport from 'passport';
import { Strategy as FacebookStrategy, Profile } from 'passport-facebook';
// import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import ServiceConfig from '../../setup/validate/config';
import { NewCreatedUser } from '../interfaces/user.interface';

import logger from '../lib/logger';
import VerificationModel from '../models/verification.model';
import UserService from '../services/user.service';

export default function passportAdapter() {
  const { server, third_party } = new ServiceConfig().config.service_config;

  const { host, public_port, protocol } = server;
  const { callback_url, client_id, client_secret } = third_party.login.facebook;
  const callbackURL = `${protocol}://${host}:${public_port}/auth${callback_url}`;

  const userService = new UserService();
  passport.use(
    new FacebookStrategy(
      {
        clientID: client_id,
        clientSecret: client_secret,
        callbackURL,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done
      ) => {
        const existingUser = await userService.getUserByFbId(profile.id);
        if (existingUser) {
          // const iat = new Date().getTime();
          // const token = jwt.encode(
          //   { sub: existingUser.id, iat },
          //   process.env.JWT_SECRET
          // );
          // existingUser.jwt = token;
          // await existingUser.save();

          done(null, existingUser.toObject());
        } else {
          let email = '';
          if (profile.emails && profile.emails.length > 0) {
            email = profile.emails?.at(0) as unknown as string;
          }
          const user: NewCreatedUser = {
            user_name: profile.username as string,
            first_name: profile.name?.givenName as string,
            email,
            social: {
              facebook_id: profile.id,
              google_id: '',
            },
            verification: new VerificationModel(),
          };
          // const newUser = userService.registerUser(user);
          done(null, user);
        }
      }
    )
  );
}
