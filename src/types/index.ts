export interface MeliBuyer {
  id: number;
  nickname: string;
  first_name?: string;
  last_name?: string;
  registration_date?: Date;
  country_id?: string;
}

export interface MeliPayment {
  reason: string;
  status_code: null;
  total_paid_amount: number;
  operation_type: string;
  transaction_amount: number;
  transaction_amount_refunded: number;
  date_approved: Date;
  collector: {
    id: number;
  };
  coupon_id: null;
  installments: number;
  authorization_code: string;
  taxes_amount: number;
  id: number;
  date_last_modified: Date;
  coupon_amount: number;
  available_actions: string[];
  shipping_cost: number;
  installment_amount?: number;
  date_created: Date;
  activation_uri: unknown;
  overpaid_amount: number;
  card_id: number | null;
  status_detail: string;
  issuer_id: unknown;
  payment_method_id: string;
  payment_type: string;
  deferred_period: unknown;
  atm_transfer_reference: {
    transaction_id: string;
    company_id: unknown;
  };
  site_id: string;
  payer_id: number;
  order_id: number;
  currency_id: string;
  status: string;
  transaction_order_id: unknown;
}

export interface MeliOrderItem {
  item: {
    id: string;
    title: string;
    category_id: string;
    variation_id?: string;
    seller_custom_field?: string;
    variation_attributes?: string[];
    warranty: string;
    condition: string;
    seller_sku?: string;
    global_price?: number;
    net_weight?: string;
  };
  quantity: number;
  requested_quantity: {
    value: 1;
    measure: string;
  };
  picked_quantity?: number;
  unit_price: number;
  full_unit_price: number;
  currency_id: string;
  manufacturing_days?: number;
  sale_fee: number;
  listing_type_id: string;
}

export enum MeliOrderStatus {
  Confirmed = 'confirmed',
  PaymentRequired = 'payment_required',
  PaymentInProcess = 'payment_in_process',
  PartiallyPaid = 'partially_paid',
  Paid = 'paid',
  PartiallyRefunded = 'partially_refunded',
  PendingCancel = 'pending_cancel',
  Cancelled = 'cancelled',
}

export interface MeliOrdersSearchResponse {
  query: string;
  results: Partial<MeliOrder>[];
  sort: MeliSort;
  available_sorts: MeliSort[];
  filters: any[];
  paging: MeliPaging;
  display: string;
}
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
  SHIPPMENTS = 'shipments',
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

export interface MeliSendMessageOptions {
  message: string;
  msgGroupId: number;
  buyerId: number;
}

export interface MeliAvailableFilter {
  id: string;
  name: string;
  type: string;
  values?: string[];
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

export interface MeliMessage {
  id: string;
  site_id: string;
  client_id: number;
  from: {
    user_id: number;
  };
  to: {
    user_id: number;
  };
  status: string;
  subject?: string;
  text: string;
  message_date: MeliMessageDate;
  message_moderation: MeliMessageModeration;
  message_attachments?: unknown;
  message_resources: MeliMessageResource[];
  conversation_first_message: boolean;
}

export interface MeliMessageDate {
  received: Date;
  available: Date;
  notified: Date;
  created: Date;
  read: unknown;
}

export interface MeliMessageModeration {
  status: string;
  reason: string;
  source: string;
  moderation_date: Date;
}

export interface MeliMessageResource {
  id: string;
  name: string;
}

export type MeliCategoriesResponse = MeliCategory[];

export interface MeliCategory {
  id: string;
  name: string;
  total_items_in_this_category?: number;
}

export interface MeliCategoryDetails {
  id: string;
  name: string;
  picture: string;
  permalink: string;
  total_items_in_this_category: number;
  path_from_root: MeliCategory[];
  children_categories: MeliCategory[];
  attribute_types: string;
  settings: {
    [key: string]: any;
  };
  channel_settings: {
    [key: string]: any;
  };
  meta_categ_id?: any;
  attributable: boolean;
  date_created: Date;
}

export interface MeliItem {
  id: string;
  site_id: string;
  title: string;
  subtitle: null;
  seller_id: number;
  category_id: string;
  official_store_id?: string | number;
  price: number;
  base_price: number;
  original_price?: number;
  inventory_id?: string | number;
  currency_id: string;
  initial_quantity: number;
  available_quantity: number;
  sold_quantity: number;
  sale_terms: MeliSaleTerm[];
  buying_mode: string;
  listing_type_id: string;
  start_time: Date;
  stop_time: Date;
  end_time: Date;
  expiration_time: Date;
  condition: MeliItemAttribute;
  permalink: string;
  thumbnail_id: string;
  thumbnail: string;
  secure_thumbnail: string;
  pictures: MeliPicture[];
  video_id: null;
  descriptions: any[];
  accepts_mercadopago: boolean;
  non_mercado_pago_payment_methods: any[];
  shipping: MeliShipping;
  international_delivery_mode: string;
  seller_address: MeliSellerAddress;
  seller_contact?: any;
  location: any;
  coverage_areas: any[];
  attributes: MeliItemAttribute[];
  warnings: any[];
  listing_source: string;
  variations: any[];
  status: string;
  sub_status: any[];
  tags: string[];
  warranty: string;
  catalog_product_id: null;
  domain_id: string;
  seller_custom_field: null;
  parent_item_id?: string;
  differential_pricing?: any;
  deal_ids: any[];
  automatic_relist: boolean;
  date_created: Date;
  last_updated: Date;
  health: number;
  catalog_listing: boolean;
  item_relations: any[];
  channels: string[];
}

export interface MeliItemAttribute {
  id: string;
  name: string;
  value_id: string;
  value_name: string;
  value_struct: unknown;
  values: { id: string; name: string; struct: string }[];
  attribute_group_id: string;
  attribute_group_name: string;
}

export enum MeliItemAttributesEnum {
  id = 'id',
  site_id = 'site_id',
  title = 'title',
  subtitle = 'subtitle',
  seller_id = 'seller_id',
  category_id = 'category_id',
  official_store_id = 'official_store_id',
  price = 'price',
  base_price = 'base_price',
  original_price = 'original_price',
  currency_id = 'currency_id',
  initial_quantity = 'initial_quantity',
  available_quantity = 'available_quantity',
  sold_quantity = 'sold_quantity',
  sale_terms = 'sale_terms',
  buying_mode = 'buying_mode',
  listing_type_id = 'listing_type_id',
  start_time = 'start_time',
  stop_time = 'stop_time',
  end_time = 'end_time',
  condition = 'condition',
  permalink = 'permalink',
  thumbnail_id = 'thumbnail_id',
  thumbnail = 'thumbnail',
  secure_thumbnail = 'secure_thumbnail',
  pictures = 'pictures',
  video_id = 'video_id',
  accepts_mercadopago = 'accepts_mercadopago',
  shipping = 'shipping',
  seller_address = 'seller_address',
  seller_contact = 'seller_contact',
  location = 'location',
  coverage_areas = 'coverage_areas',
  attributes = 'attributes',
  warnings = 'warnings',
  status = 'status',
  sub_status = 'sub_status',
  tags = 'tags',
  warranty = 'warranty',
  catalog_product_id = 'catalog_product_id',
  domain_id = 'domain_id',
  date_created = 'date_created',
  last_updated = 'last_updated',
  health = 'health',
  catalog_listing = 'catalog_listing',
  channels = 'channels',
}

export type MeliItemAttributes = keyof typeof MeliItemAttributesEnum;

export interface MeliSellerAddress {
  city?: {
    id: string;
    name: string;
  };
  state?: {
    id: string;
    name: string;
  };
  country?: {
    id: string;
    name: string;
  };
  search_location?: {
    city?: {
      id: string;
      name: string;
    };
    state?: {
      id: string;
      name: string;
    };
  };
  id?: number;
}

export interface MeliValue {
  id?: string;
  name: string;
  struct?: MeliStruct | null;
  metadata?: {
    value?: boolean;
  };
}

export interface MeliStruct {
  number: number;
  unit: string;
}

export interface MeliPicture {
  id: string;
  url: string;
  secure_url: string;
  size: string;
  max_size: string;
  quality: string;
}

export interface MeliSaleTerm {
  id: string;
  name: string;
  value_id: null | string;
  value_name: string;
  value_struct: MeliStruct | null;
  values: MeliValue[];
}

export interface MeliShipping {
  mode: string;
  methods: any[];
  free_methods: {
    id: number;
    rule: {
      default: boolean;
      free_mode: string;
      free_shipping_flag: boolean;
      value: null;
    };
  }[];

  tags: string[];
  dimensions?: any;
  local_pick_up: boolean;
  free_shipping: boolean;
  logistic_type: string;
  store_pick_up: boolean;
}

export interface MeliItemSearchResponse {
  seller_id: string;
  query?: string;
  paging: MeliPaging;
  results: string[];
  orders: {
    id: string;
    name: string;
  }[];
  available_orders: {
    id: string;
    name: string;
  }[];
}

export interface MeliGetItemsByIdsResponse<T extends MeliItemAttributes = any> {
  code: number;
  body: Pick<MeliItem, T>;
}

export interface MeliCategoryAttribute {
  id: string;
  name: string;
  tags?: {
    [key: string]: any;
    hidden?: boolean;
    multivalued?: boolean;
    required?: boolean;
    variation_attribute?: boolean;
    read_only?: boolean;
    catalog_required?: boolean;
  };
  hierarchy?: string;
  relevance?: number;
  value_type?: string;
  value_max_length?: number;
  values?: MeliValue[];
  attribute_group_id?: string;
  attribute_group_name?: string;
  allowed_units?: MeliValue[];
  default_unit?: string;
  tooltip?: string;
  example?: string;
  hint?: string;
}

export type MeliCategoryAttributesResponse = MeliCategoryAttribute[];

export interface MeliUnansweredQuestion {
  id: number;
  answer: null;
  date_created: Date;
  item_id: string;
  seller_id: number;
  status: string;
  text: string;
  from: MeliFrom;
}

export interface MeliQuestionData {
  date_created: Date;
  item_id: string;
  seller_id: number;
  status: MeliQuestionStatus;
  text: string;
  id: number;
  deleted_from_listing: boolean;
  hold: boolean;
  answer?: {
    text: string;
    status: string;
    date_created: Date;
  };
  from: {
    id: number;
    nickname: string;
    city: string | null;
  };
  item: MeliItem;
  previous: {
    total: number;
    limit: number;
    offset: number;
    results: PreviousQuestion[];
  };
}

export interface PreviousQuestion {
  text: string;
  answer: {
    date_created: Date;
    text: string;
  };
  date_created: Date;
  status: MeliQuestionStatus;
}

export interface MeliUserData {
  id: number;
  nickname: string;
  registration_date: Date;
  country_id: string;
  address: { city: string; state: string };
  user_type: string;
  tags: string[];
  logo: any;
  points: number;
  site_id: string;
  permalink: string;
  seller_reputation: {
    level_id: any;
    power_seller_status: any;
    transactions: {
      canceled: number;
      completed: number;
      period: string;
      ratings: object[];
      total: number;
    };
  };
  buyer_reputation: { tags: string[] };
  status: { site_status: string };
}

export interface MeliQuestionsResponse {
  total: number;
  limit: number;
  questions: MeliQuestionData[];
  filters: MeliFilters;
  available_filters?: MeliAvailableFilter[];
  available_sorts?: string[];
}

export type MeliQuestionStatus =
  | 'UNANSWERED'
  | 'ANSWERED'
  | 'CLOSED_UNANSWERED'
  | 'UNDER_REVIEW';

export interface MeliQuestionsResponseTime {
  user_id: number;
  total: {
    response_time: number;
  };
  weekend: {
    response_time: number;
    sales_percent_increase: number | null;
  };
  weekend_working_hours: {
    response_time: number;
    sales_percent_increase: number | null;
  };
  weekend_extra_hours: {
    response_time: number;
    sales_percent_increase: number | null;
  };
}

export interface MeliAnswer {
  date_created: Date;
  status: string;
  text: string;
}

export interface MeliFrom {
  id: number;
  answered_questions?: number;
}

export interface MeliQuestionsByItemID {
  total: number;
  limit: number;
  questions: any[];
  filters: MeliFilters;
  available_filters: MeliAvailableFilter[];
  available_sorts: string[];
}

export interface MeliAnsweredQuestion {
  id: number;
  answer: MeliAnswer;
  date_created: Date;
  deleted_from_listing: boolean;
  hold: boolean;
  item_id: string;
  seller_id: number;
  status: string;
  text: string;
  from: MeliFrom;
}

export type ConditionalReturn<T, C, E = MeliApiError> = C extends true
  ? T
  : T | E;

export interface MeliMessagesResponse {
  paging: MeliPaging;
  conversation_status: {
    path: string;
    status: string;
    substatus?: string;
    status_date: Date;
    status_update_allowed: boolean;
    claim_id?: string | number;
    shipping_id?: string | number;
  };
  messages: MeliMessage[];
  seller_max_message_length: number;
  buyer_max_message_length: number;
}

// Generated by https://quicktype.io

export interface MeliPublicUser {
  id: number;
  nickname: string;
  registration_date: string;
  country_id: string;
  address: Address;
  user_type: string;
  tags: string[];
  logo: null;
  points: number;
  site_id: string;
  permalink: string;
  seller_reputation: SellerReputation;
  buyer_reputation: BuyerReputation;
  status: Status;
}

export interface Address {
  state: string;
  city: string;
}

export interface BuyerReputation {
  tags: any[];
}

export interface SellerReputation {
  level_id: null;
  power_seller_status: null;
  transactions: Transactions;
}

export interface Transactions {
  period: string;
  total: number;
  completed: number;
  canceled: number;
  ratings: Ratings;
}

export interface Ratings {
  positive: number;
  negative: number;
  neutral: number;
}

export interface Status {
  site_status: string;
}

// Generated by https://quicktype.io

export interface MeliPrivateUser {
  id: number;
  nickname: string;
  registration_date: string;
  first_name: string;
  last_name: string;
  country_id: string;
  email: string;
  identification: Identification;
  address: Address;
  phone: Phone;
  alternative_phone: Phone;
  user_type: string;
  tags: string[];
  logo: null;
  points: number;
  site_id: string;
  permalink: string;
  seller_experience: string;
  seller_reputation: SellerReputation;
  buyer_reputation: BuyerReputation;
  status: Status;
  credit: Credit;
}

export interface Address {
  state: string;
  city: string;
  address: string;
  zip_code: string;
}

export interface Phone {
  area_code: string;
  number: string;
  extension: string;
  verified?: boolean;
}

export interface BuyerReputation {
  canceled_transactions: number;
  transactions: BuyerReputationTransactions;
  tags: any[];
}

export interface BuyerReputationTransactions {
  period: string;
  total: null;
  completed: null;
  canceled: Canceled;
  unrated: Canceled;
  not_yet_rated: NotYetRated;
}

export interface Canceled {
  total: null;
  paid: null;
}

export interface NotYetRated {
  total: null;
  paid: null;
  units: null;
}

export interface Credit {
  consumed: number;
  credit_level_id: string;
}

export interface Identification {
  type: string;
  number: string;
}

export interface SellerReputation {
  level_id: null;
  power_seller_status: null;
  transactions: SellerReputationTransactions;
}

export interface SellerReputationTransactions {
  period: string;
  total: number;
  completed: number;
  canceled: number;
  ratings: Ratings;
}

export interface Ratings {
  positive: number;
  negative: number;
  neutral: number;
}

export interface Status {
  site_status: string;
  list: Buy;
  buy: Buy;
  sell: Buy;
  billing: Billing;
  mercadopago_tc_accepted: boolean;
  mercadopago_account_type: string;
  mercadoenvios: string;
  immediate_payment: boolean;
  confirmed_email: boolean;
  user_type: string;
  required_action: string;
}

export interface Billing {
  allow: boolean;
  codes: any[];
}

export interface Buy {
  allow: boolean;
  codes: any[];
  immediate_payment: ImmediatePayment;
}

export interface ImmediatePayment {
  required: boolean;
  reasons: any[];
}

export interface MeliPackOrderInfo {
  id: number;
  status: string;
  status_detail?: string;
  date_created: Date;
  last_updated: Date;
  family_pack_id?: number;
  buyer: {
    id: number;
  };
  shipment: {
    id: number;
  };
  orders: { id: number }[];
}

export interface MeliBillingInfo {
  billing_info: {
    additional_info: {
      type: string;
      value: string;
    }[];
    doc_number: string;
    doc_type: string;
  };
}
