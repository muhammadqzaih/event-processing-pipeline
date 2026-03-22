import { injectable } from "tsyringe";
import { IActionExecutor } from "../../../contracts/IActionExecutor";

@injectable()
export class TransformExecutor implements IActionExecutor {
  supports(type: string): boolean {
    return type === "transform";
  }

  execute(
    payload: Record<string, unknown>,
    config: Record<string, unknown>,
  ): Record<string, unknown> {
    const transformed: Record<string, unknown> = { ...payload };

    const mappings = this.toRecord(config.mappings);
    for (const [sourceField, targetRaw] of Object.entries(mappings)) {
      const targetField = String(targetRaw);
      if (sourceField in transformed) {
        transformed[targetField] = transformed[sourceField];
        if (targetField !== sourceField) {
          delete transformed[sourceField];
        }
      }
    }

    const formatters = this.toRecord(config.formatters);
    for (const [field, formatterRaw] of Object.entries(formatters)) {
      if (!(field in transformed)) {
        continue;
      }

      transformed[field] = this.applyFormatter(transformed[field], String(formatterRaw));
    }

    return transformed;
  }

  private applyFormatter(value: unknown, formatter: string): unknown {
    switch (formatter.toLowerCase()) {
      case "currency": {
        const num = typeof value === "number" ? value : Number(value);
        return Number.isFinite(num) ? `$${num.toFixed(2)}` : value;
      }
      case "uppercase":
        return typeof value === "string" ? value.toUpperCase() : value;
      case "lowercase":
        return typeof value === "string" ? value.toLowerCase() : value;
      case "trim":
        return typeof value === "string" ? value.trim() : value;
      case "number": {
        const num = Number(value);
        return Number.isFinite(num) ? num : value;
      }
      case "string":
        return String(value);
      default:
        return value;
    }
  }

  private toRecord(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return {};
    }

    return value as Record<string, unknown>;
  }
}
