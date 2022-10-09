import { IValidations } from '../interfaces/common.interface';
import getUserValidation from './get-user.validate';
import registerUserValidation from './register-user.validate';
import updateUserValidation from './update-user.validate';

const Validations: IValidations = {
  getUserValidation,
  registerUserValidation,
  updateUserValidation,
};

export default Validations;
