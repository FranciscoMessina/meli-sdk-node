import {
  MeliBuyer,
  MeliOrderItem,
  MeliOrderStatus,
  MeliPayment,
} from './index';

export interface MeliOrder {
  id: number;
  date_created: Date;
  date_closed: Date;
  last_updated: Date;
  manufacturing_ending_date?: Date;
  comment?: string;
  pack_id?: number;
  pickup_id?: number;
  order_request?: {
    return?: any;
    change?: any;
  };
  fulfilled?: any;
  mediations: any[];
  total_amount: number;
  paid_amount: number;
  coupon: {
    id?: number;
    amount: number;
  };
  expiration_date: Date;
  order_items: MeliOrderItem[];
  currency_id: string;
  payments: MeliPayment[];
  shipping: {
    id?: number;
  };
  status: MeliOrderStatus;
  status_detail?: string;
  tags: string[];
  feedback: {
    buyer?: any;
    seller?: any;
  };
  context: {
    channel: string;
    site: string;
    flows: string[];
  };
  buyer: MeliBuyer;
  seller: {
    id: number;
    nickname: string;
    first_name: string;
    last_name: string;
    phone: {
      extension: string;
      area_code: string;
      number: string;
      verified: boolean;
    };
    alternative_phone: {
      extension: string;
      area_code: string;
      number: string;
      verified: boolean;
    };
  };
  taxes: {
    amount?: number | string;
    currency_id?: string;
    id?: number | string;
  };
  cancel_detail: {
    [key: string]: any;
  };
}
