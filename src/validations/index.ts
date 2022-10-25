import { IValidations } from '../interfaces/common.interface';
import forgotPassword from './forgot-password.validate';
import getProductValidation from './get-product.validate';
import getUserValidation from './get-user.validate';
import postProductValidation from './post-product.validate';
import registerUserValidation from './register-user.validate';
import updateProductValidation from './update-product.validate';
import updateUserValidation from './update-user.validate';
import verifyUser from './verify-user.validate';

const Validations: IValidations = {
  forgotPassword,
  getUserValidation,
  registerUserValidation,
  updateUserValidation,
  getProductValidation,
  // updateProductValidation,
  // postProductValidation,
  verifyUser,
};

export default Validations;
