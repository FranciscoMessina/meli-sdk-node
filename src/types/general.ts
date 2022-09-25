export interface MeliApiError {
  message: string;
  error: string;
  status?: number;
  cause?: any[];
}

export interface MeliOauthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  user_id: number;
  refresh_token: string;
}

export enum MeliNotificationTopic {
  ORDERS = 'orders_v2',
  ITEMS = 'items',
  QUESTIONS = 'questions',
  PAYMENTS = 'payments',
  MESSAGES = 'messages',
  SHIPMENTS = 'shipments',
  INVOICES = 'invoices',
  CLAIMS = 'claims',
}

export interface MeliNotification {
  _id: string;
  resource: string;
  user_id: number;
  topic: MeliNotificationTopic;
  application_id: number;
  attempts: number;
  sent: Date;
  received: Date;
}

export interface MeliFilters {
  limit: number;
  offset: number;
  api_version: string;
  is_admin: boolean;
  sorts: any[];
  caller: number;
  item: string;
}

export interface MeliSort {
  id: string;
  name: string;
}

export interface MeliPaging {
  total: number;
  offset: number;
  limit: number;
}
