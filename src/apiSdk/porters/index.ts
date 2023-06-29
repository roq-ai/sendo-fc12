import axios from 'axios';
import queryString from 'query-string';
import { PorterInterface, PorterGetQueryInterface } from 'interfaces/porter';
import { GetQueryInterface } from '../../interfaces';

export const getPorters = async (query?: PorterGetQueryInterface) => {
  const response = await axios.get(`/api/porters${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPorter = async (porter: PorterInterface) => {
  const response = await axios.post('/api/porters', porter);
  return response.data;
};

export const updatePorterById = async (id: string, porter: PorterInterface) => {
  const response = await axios.put(`/api/porters/${id}`, porter);
  return response.data;
};

export const getPorterById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/porters/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePorterById = async (id: string) => {
  const response = await axios.delete(`/api/porters/${id}`);
  return response.data;
};
