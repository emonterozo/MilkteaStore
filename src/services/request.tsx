import axios from 'axios';
import {SERVER_URL} from '../config/config';
import {API} from './api';
import authorization from './authorization';
import {IAddOder, IOrders} from './types';

export const loginRequest = async (username: String, password: String) => {
  return axios
    .post(
      SERVER_URL + API.LOGIN,
      {
        username: username,
        password: password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getProductsRequest = async (store: String, token: String) => {
  return axios
    .get(SERVER_URL + API.PRODUCTS, {
      headers: authorization(token),
      params: {
        store: store,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const updateProductRequest = async (
  product: String,
  available: Boolean,
  token: string,
) => {
  return axios
    .post(
      SERVER_URL + API.UPDATE_PRODUCT,
      {
        product: product,
        available: available,
      },
      {
        headers: authorization(token),
      },
    )
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const addOrderRequest = async (payload: IAddOder, token: string) => {
  return axios
    .post(SERVER_URL + API.ADD_ORDER, payload, {
      headers: authorization(token),
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getOrdersRequest = async (payload: IOrders, token: String) => {
  return axios
    .get(SERVER_URL + API.ORDERS, {
      headers: authorization(token),
      params: payload,
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const updateOrderRequest = async (
  order: String,
  status: String,
  token: String,
) => {
  return axios
    .post(
      SERVER_URL + API.UPDATE_ORDER,
      {
        order: order,
        status: status,
      },
      {
        headers: authorization(token),
      },
    )
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};
