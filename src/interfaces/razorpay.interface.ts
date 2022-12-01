export interface INotesRazorPay {
  notes_key_1: string;
  notes_key_2: string;
}

export interface IUserRazorPay {
  name: string;
  contact: string;
  email: string;
  fail_existing: string;
  gstin: string;
  notes: INotesRazorPay;
}

export interface IOrderOptionsRazorPay {
  amount: number;
  currency: string;
  receipt: string;
}

export interface ICustomersRazorpay {
  create: any;
  edit: any;
  fetch: any;
  all: any;
  fetchTokens: any;
  fetchToken: any;
  deleteToken: any;
}

export interface IRazorpayInstance {
  payments: any;
  refunds: any;
  orders: any;
  customers: ICustomersRazorpay;
  transfers: any;
  virtualAccounts: any;
  invoices: any;
  paymentLink: any;
  plans: any;
  subscriptions: any;
  addons: any;
  settlements: any;
  qrCode: any;
  fundAccount: any;
  items: any;
  cards: any;
}
