import { injectable } from "tsyringe";
import { DeliveryResult, IHttpClient } from "../../application/interfaces/IHttpClient";


@injectable()
export class FetchHttpClient implements IHttpClient {
  async post(url: string, data: Record<string, unknown>): Promise<DeliveryResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      const rawBody = await response.text();
      const body = this.parseBody(rawBody);

      return {
        success: response.ok,
        statusCode: response.status,
        body,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error";
      return {
        success: false,
        body: { error: message },
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  private parseBody(rawBody: string): unknown {
    if (!rawBody) {
      return null;
    }

    try {
      return JSON.parse(rawBody) as unknown;
    } catch {
      return rawBody;
    }
  }
}
