import { LuggageDeliveryOrderInterface } from 'interfaces/luggage-delivery-order';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface AirlineInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  luggage_delivery_order?: LuggageDeliveryOrderInterface[];
  user?: UserInterface;
  _count?: {
    luggage_delivery_order?: number;
  };
}

export interface AirlineGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
