import { HttpRequest } from "@/utils/http/request";
import { ApiResponse } from "@/utils/http/types";

const httpClient = HttpRequest.getInstance();

const path = {
  // 取消支付订单
  CANCEL_PAYMENT_ORDER: "/payment/cancel",
  // 创建支付订单
  CREATE_PAYMENT_ORDER: "/payment/create",
  // 获取支付订单详情
  GET_PAYMENT_ORDER_DETAIL: "/payment/detail",
  // 获取充值档位列表
  GET_RECHARGE_LIST: "/payment/recharge-tiers",
  // 搜索支付记录
  SEARCH_PAYMENT_RECORD: "/payment/search",
} as const;

// 基础响应类型
interface BaseResponse {
  code: number;
  message: string;
}

// 通用无信息返回
interface EmptyResponse extends BaseResponse {}

// 创建支付订单响应类型
interface CreatePaymentOrderResponse {
  order_id: number;
  out_trade_no: string;
  payment_url: string;
}

// 获取支付订单详情响应类型
interface GetPaymentOrderDetailResponse {
  id: number;
  user_id: number;
  order_id: number;
  out_trade_no: string;
  product_id: number;
  product_type: number;
  payment_gateway: string;
  payment_method: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

// 获取充值档位列表响应类型
interface GetRechargeListResponse {
  list: Array<{
    id: number;
    name: string;
    amount: number;
    coins: number;
    bonus: number;
    is_recommended: boolean;
  }>;
}

// 搜索支付记录响应类型
interface SearchPaymentRecordResponse {
  total: number;
  list: Array<{
    id: number;
    user_id: number;
    order_id: number;
    out_trade_no: string;
    product_id: number;
    product_type: number;
    payment_gateway: string;
    payment_method: string;
    amount: number;
    status: string;
    created_at: string;
    updated_at: string;
  }>;
}

export const paymentService = {
  // 取消支付订单
  async cancelPaymentOrder(params: {
    id: number;
    user_id: number;
  }): Promise<ApiResponse<EmptyResponse>> {
    return httpClient.post<EmptyResponse>(path.CANCEL_PAYMENT_ORDER, params);
  },

  // 创建支付订单
  async createPaymentOrder(params: {
    desc: string;
    payment_gateway: string;
    payment_method: string;
    product_id: number;
    product_type: number;
  }): Promise<ApiResponse<CreatePaymentOrderResponse>> {
    return httpClient.post<CreatePaymentOrderResponse>(path.CREATE_PAYMENT_ORDER, params);
  },

  // 获取支付订单详情
  async getPaymentOrderDetail(params: {
    order_id: number;
    id: number;
    out_trade_no: string;
  }): Promise<ApiResponse<GetPaymentOrderDetailResponse>> {
    return httpClient.get<GetPaymentOrderDetailResponse>(path.GET_PAYMENT_ORDER_DETAIL, params);
  },

  // 获取充值档位列表
  async getRechargeList(): Promise<ApiResponse<GetRechargeListResponse>> {
    return httpClient.get<GetRechargeListResponse>(path.GET_RECHARGE_LIST);
  },

  // 搜索支付记录
  async searchPaymentRecord(params: {
    page: number;
    page_size: number;
    user_id: number;
    order_id: number;
    status: string;
    start_time: string;
    end_time: string;
  }): Promise<ApiResponse<SearchPaymentRecordResponse>> {
    return httpClient.get<SearchPaymentRecordResponse>(path.SEARCH_PAYMENT_RECORD, params);
  },
};
