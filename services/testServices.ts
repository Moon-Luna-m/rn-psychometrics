import { HttpRequest } from "@/utils/http/request";
import { ApiResponse } from "@/utils/http/types";

const httpClient = HttpRequest.getInstance();

const path = {
  // 获取心理测试详情
  GET_TEST_LIST: "/api/psychology/test/detail",
  // 开始心理测试
  START_TEST: "/api/psychology/test/start",
  // 提交心理测试答案
  SUBMIT_TEST_ANSWER: "/api/psychology/test/submit",
  // 获取某类型下的测试列表
  GET_TEST_LIST_BY_TYPE: "/api/psychology/tests",
  // 获取心里测试类型详情
  GET_TEST_TYPE_DETAIL: "/api/psychology/type/detail",
  // 获取心里测试类型列表
  GET_TEST_TYPE_LIST: "/api/psychology/types",
  // 获取用户心里测试详情
  GET_USER_TEST_DETAIL: "/api/psychology/user/test/detail",
  // 获取用户心理测试历史
  GET_USER_TEST_HISTORY: "/api/psychology/user/tests",
  // 搜索心理测试
  SEARCH_TEST: "/api/psychology/search",
} as const;

// 基础响应类型
interface BaseResponse {
  code: number;
  message: string;
}

// 心理测试详情
export interface TestDetailResponse {
  id: number;
  type_id: number;
  name: string;
  desc: string;
  image: string;
  price: number;
  discount_price: number;
  question_count: number;
  answer_time: number;
  questions: Array<{
    id: number;
    content: string;
    image: string;
    type: number;
    options: Array<{
      id: number;
      content: string;
      image: string;
      score: number;
      dimension: string;
    }>;
  }>;
}

// 开始心理测试
export interface StartTestResponse {
  additionalProp1: number;
  additionalProp2: number;
  additionalProp3: number;
}

// 提交心理测试答案
export interface SubmitTestAnswerResponse {
  desc: string;
  id: number;
  result_key: string;
  suggestion: string;
  title: string;
}

// 获取某类型下的测试列表
export interface GetTestListByTypeResponse {
  count: number;
  list: Array<{
    id: number;
    type_id: number;
    name: string;
    desc: string;
    image: string;
    price: number;
    discount_price: number;
    question_count: number;
    answer_time: number;
    star: number;
    user_avatars: Array<string>;
    total: number;
  }>;
}

// 根据筛选条件获取测试列表
export interface GetTestListByFilterResponse {
  count: number;
  list: Array<{
    id: number;
    type_id: number;
    name: string;
    desc: string;
    image: string;
    price: number;
    discount_price: number;
    question_count: number;
    answer_time: number;
  }>;
}

// 获取心里测试类型详情
export interface GetTestTypeDetailResponse {
  id: number;
  name: string;
  desc: string;
  icon: string;
}

// 获取心里测试类型列表
export interface GetTestTypeListResponse {
  count: number;
  list: Array<{
    id: number;
    name: string;
    desc: string;
    icon: string;
  }>;
}

// 获取用户心里测试详情
export interface GetUserTestDetailResponse {
  answers: Array<{
    option_id: number;
    option_text: string;
    question_id: number;
    question_text: string;
  }>;
  discount_price: number;
  end_time: string;
  id: number;
  price: number;
  result: Array<{
    desc: string;
    id: number;
    result_key: string;
    suggestion: string;
    title: string;
  }>;
  result_key: number;
  type_id: number;
  score: number;
  start_time: string;
  status: number;
  test_id: number;
  test_name: string;
}

// 获取用户心理测试历史
export interface GetUserTestHistoryResponse {
  count: number;
  list: string;
}

// 通用无信息返回
export interface EmptyResponse extends BaseResponse {}

export const testService = {
  // 获取心理测试详情
  async getTestList(params: {
    id: number;
  }): Promise<ApiResponse<TestDetailResponse>> {
    return httpClient.get<TestDetailResponse>(path.GET_TEST_LIST, params);
  },

  // 开始心理测试
  async startTest(params: {
    test_id: number;
  }): Promise<ApiResponse<StartTestResponse>> {
    return httpClient.post<StartTestResponse>(path.START_TEST, params);
  },

  // 提交心理测试答案
  async submitTestAnswer(params: {
    user_test_id: number;
    answers: Array<{
      option_id: number;
      question_id: number;
    }>;
  }): Promise<ApiResponse<SubmitTestAnswerResponse>> {
    return httpClient.post<SubmitTestAnswerResponse>(
      path.SUBMIT_TEST_ANSWER,
      params
    );
  },

  // 获取某类型下的测试列表
  async getTestListByType(params: {
    type_id?: number;
    rec?: boolean;
    free?: boolean;
    pay?: boolean;
    quick?: boolean;
    page: number;
    size: number;
    popular?: boolean;
  }): Promise<ApiResponse<GetTestListByTypeResponse>> {
    return httpClient.get<GetTestListByTypeResponse>(
      path.GET_TEST_LIST_BY_TYPE,
      params
    );
  },

  // 获取心里测试类型详情
  async getTestTypeDetail(params: {
    id: number;
  }): Promise<ApiResponse<GetTestTypeDetailResponse>> {
    return httpClient.get<GetTestTypeDetailResponse>(
      path.GET_TEST_TYPE_DETAIL,
      params
    );
  },

  // 获取心里测试类型列表
  async getTestTypeList(params: {
    page: number;
    size: number;
  }): Promise<ApiResponse<GetTestTypeListResponse>> {
    return httpClient.get<GetTestTypeListResponse>(
      path.GET_TEST_TYPE_LIST,
      params
    );
  },

  // 获取用户心里测试详情
  async getUserTestDetail(params: {
    id: number;
  }): Promise<ApiResponse<GetUserTestDetailResponse>> {
    return httpClient.get<GetUserTestDetailResponse>(
      path.GET_USER_TEST_DETAIL,
      params
    );
  },

  // 获取用户心理测试历史
  async getUserTestHistory(params: {
    user_id: number;
    page: number;
    size: number;
  }): Promise<ApiResponse<GetUserTestHistoryResponse>> {
    return httpClient.get<GetUserTestHistoryResponse>(
      path.GET_USER_TEST_HISTORY,
      params
    );
  },  

  // 搜索心理测试
  async searchTest(params: {
    keyword: string;
    page: number;
    size: number;
  }): Promise<ApiResponse<GetTestListByTypeResponse>> {
    return httpClient.get<GetTestListByTypeResponse>(path.SEARCH_TEST, params);
  },
};