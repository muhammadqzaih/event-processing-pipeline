export type DeliveryResult = {
  success: boolean;
  statusCode?: number;
  body?: unknown;
};

export interface IHttpClient {
  post(url: string, data: Record<string, unknown>): Promise<DeliveryResult>;
}
