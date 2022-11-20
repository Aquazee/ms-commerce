import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import ApiError from '../abstractions/ApiError';

import Validators from '../validations';

function validatePayload(validator: keyof typeof Validators) {
  //! If validator is not exist, throw err
  // if (!Validators.hasOwnProperty(validator))
  //   throw new Error(`'${validator}' validator is not exist`);

  // eslint-disable-next-line func-names, consistent-return
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const params = { ...req.body, ...req.params };
      await Validators[validator].validateAsync(params);
      next();
    } catch (err: any) {
      //* Pass err to next
      //! If validation error occurs call next with HTTP 422. Otherwise HTTP 500
      if (err.isJoi) {
        // return next(createHttpError(422, { message: err.message }));
        return next(
          new ApiError(
            err.message,
            StatusCodes.BAD_REQUEST,
            ReasonPhrases.BAD_REQUEST
          )
        );
      }
      next(createHttpError(500));
    }
  };
}

export default validatePayload;
