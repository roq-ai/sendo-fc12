import axios from 'axios';
import queryString from 'query-string';
import {
  LuggageDeliveryOrderInterface,
  LuggageDeliveryOrderGetQueryInterface,
} from 'interfaces/luggage-delivery-order';
import { GetQueryInterface } from '../../interfaces';

export const getLuggageDeliveryOrders = async (query?: LuggageDeliveryOrderGetQueryInterface) => {
  const response = await axios.get(`/api/luggage-delivery-orders${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createLuggageDeliveryOrder = async (luggageDeliveryOrder: LuggageDeliveryOrderInterface) => {
  const response = await axios.post('/api/luggage-delivery-orders', luggageDeliveryOrder);
  return response.data;
};

export const updateLuggageDeliveryOrderById = async (
  id: string,
  luggageDeliveryOrder: LuggageDeliveryOrderInterface,
) => {
  const response = await axios.put(`/api/luggage-delivery-orders/${id}`, luggageDeliveryOrder);
  return response.data;
};

export const getLuggageDeliveryOrderById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/luggage-delivery-orders/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteLuggageDeliveryOrderById = async (id: string) => {
  const response = await axios.delete(`/api/luggage-delivery-orders/${id}`);
  return response.data;
};
