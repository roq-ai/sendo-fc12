import { UserInterface } from 'interfaces/user';
import { PorterInterface } from 'interfaces/porter';
import { AirlineInterface } from 'interfaces/airline';
import { GetQueryInterface } from 'interfaces';

export interface LuggageDeliveryOrderInterface {
  id?: string;
  status: string;
  user_id?: string;
  porter_id?: string;
  airline_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  porter?: PorterInterface;
  airline?: AirlineInterface;
  _count?: {};
}

export interface LuggageDeliveryOrderGetQueryInterface extends GetQueryInterface {
  id?: string;
  status?: string;
  user_id?: string;
  porter_id?: string;
  airline_id?: string;
}
