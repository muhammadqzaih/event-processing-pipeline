import { injectable } from "tsyringe";
import { IActionExecutor } from "../../../contracts/IActionExecutor"; 

@injectable()
export class EnrichExecutor implements IActionExecutor {
  supports(type: string): boolean {
    return type === "enrich";
  }

  execute(
    payload: Record<string, unknown>,
    config: Record<string, unknown>,
  ): Record<string, unknown> {
    const metadata = "metadata" in config ? this.toRecord(config.metadata) : config;

    return {
      ...payload,
      ...metadata,
      processed_at: new Date().toISOString(),
    };
  }

  private toRecord(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return {};
    }

    return value as Record<string, unknown>;
  }
}
