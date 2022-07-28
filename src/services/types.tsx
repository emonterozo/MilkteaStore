export interface IAddOder {
  owner: String;
  store: String;
  product: String;
  size: String;
  quantity: Number;
  price: Number;
  amount: Number;
  timestamp: Date;
}

export interface IOrders {
  store: String;
  status: String;
  timestamp: String;
}
