export type StatCard = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  BgColor: string;
  BorderColor: string;
};

export type DashboardStatsResponse = {
  totalOrder: number;
  revenue: number;
  activeUsers: number;
  productInStock: number;
};

export type DashboardStatsSuccessResponse = {
  success: true;
  data: DashboardStatsResponse;
};

export type DashboardStatsErrorResponse = {
  success: false;
  message: any;
  statusCode: number;
};

export type DashboardStatsApiResponse =
  | DashboardStatsSuccessResponse
  | DashboardStatsErrorResponse;

export type ShippingAddress = {
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  shippingCost?: number;
};

export type PurchaseProduct = {
  product: string;
  quantity: number;
  price: number;
  seller: string;
  timeline: {
    event: string;
    timestamp: string;
    location: string;
    _id: string;
  }[];
  _id: string;
};

export type RecentPurchase = {
  shippingAddress: ShippingAddress;
  _id: string;
  orderId: string;
  buyer: string;
  products: PurchaseProduct[];
  totalAmount: number;
  paymentStatus: string;
  paymentIntentId: string;
  checkoutSessionId?: string;
  paymentMethod: string;
  status: string;
  trackingNumber: string;
  orderTimeline: {
    event: string;
    timestamp: string;
    location: string;
    _id: string;
  }[];
  refundAmount: number;
  disputeId: string | null;
  disputeStatus: string;
  disputeAmount: number;
  platformFeeAmount: number;
  platformFeeRefunded: number;
  farmDetails: any[];
  createdAt: string;
  updatedAt: string;
};

export type MonthlyRevenue = {
  revenue: number;
  month: string;
};

export type OrderStatus = {
  status: string;
  count: number;
};

export type OrderStat = {
  statuses: OrderStatus[];
  month: string;
};

export type SectionTwoResponse = {
  recentPurchases: RecentPurchase[];
  monthlyRevenue: MonthlyRevenue[];
  orderStats: OrderStat[];
};

export type SectionTwoSuccessResponse = {
  success: true;
  data: SectionTwoResponse;
};

export type SectionTwoErrorResponse = {
  success: false;
  message: any;
  statusCode: number;
};

export type SectionTwoApiResponse =
  | SectionTwoSuccessResponse
  | SectionTwoErrorResponse;

export type TopProduct = {
  totalSold: number;
  productId: string;
  productName: string;
  sku: string | null;
  category: string;
  stock: number;
  price: number;
  status: string;
  image: string[];
  totalRevenue: number;
};

export type VendorApproval = {
  _id: string;
  businessDetails: {
    businessName: string;
    businessLocation: string;
    country: string;
    city?: string;
    state?: string;
  };
  phoneNumber: string | null;
  email: string;
  createdAt: string;
  vendorName: string;
  hasLicense: boolean;
  hasTaxId: boolean;
  status: string;
  kycStatus?: string;
  kycId?: string;
};

export type SectionThreeResponse = {
  topProducts: TopProduct[];
  vendorsApproval: VendorApproval[];
};

export type SectionThreeSuccessResponse = {
  success: true;
  data: SectionThreeResponse;
};

export type SectionThreeErrorResponse = {
  success: false;
  message: any;
  statusCode: number;
};

export type SectionThreeApiResponse =
  | SectionThreeSuccessResponse
  | SectionThreeErrorResponse;

export type SupportTicket = {
  category: string;
  open: number;
  avgResponse: string;
  avgResponseHours: number;
  priority: string;
};

export type SectionFourResponse = {
  supportTickets: SupportTicket[];
};

export type SectionFourSuccessResponse = {
  success: true;
  data: SectionFourResponse;
};

export type SectionFourErrorResponse = {
  success: false;
  message: any;
  statusCode: number;
};

export type SectionFourApiResponse =
  | SectionFourSuccessResponse
  | SectionFourErrorResponse;
