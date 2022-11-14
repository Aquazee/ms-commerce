import CartAccessor from '../data-access/cart-accessor';
import {
  NewCreatedCart,
  UpdateCartBody,
  ICartDoc,
  ICartService,
  ICart,
  IGetCartRequest,
} from '../interfaces/cart.interface';
import { CartError } from '../lib/errors';
import { convertToObjectId } from '../lib/helper';
import logger from '../lib/logger';
import Cart from '../models/shopping-cart.model';

const scope = `CartService#${1}`;

export default class CartService {
  private _cartAccessor;

  // private _cartManager;

  constructor() {
    this._cartAccessor = new CartAccessor();
  }

  /**
   * Create cart
   * @param {NewCreatedCart} cartBody
   * @returns {Promise<ICartDoc>}
   */
  createCart = async (cartBody: NewCreatedCart): Promise<ICartDoc> =>
    this._cartAccessor.createCart(cartBody);

  /**
   * Update cart by id
   * @param {string} cartId
   * @param {UpdateCartBody} updateBody
   * @returns {Promise<ICartDoc | null>}
   */
  updateCartById = async (
    cartId: string,
    updateBody: UpdateCartBody
  ): Promise<ICartDoc | null> => {
    const cart = await this.getCartById(cartId);
    Object.assign(cart, updateBody);
    await cart.save();
    return cart;
  };

  getCart = async (payload: IGetCartRequest) => {
    const cart = await this._cartAccessor.getCartById(
      convertToObjectId(payload.cartId as string)
    );
    if (!cart) {
      throw CartError.CartNotFound;
    }
    return cart;
  };

  getCartById = async (cartId: string) => {
    const cart = await this._cartAccessor.getCartById(
      convertToObjectId(cartId)
    );
    if (!cart) {
      throw CartError.CartNotFound;
    }
    return cart;
  };
}
