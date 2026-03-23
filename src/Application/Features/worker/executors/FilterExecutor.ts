import { injectable } from "tsyringe";
import { IActionExecutor } from "../../../Contracts/IActionExecutor";

type FilterOperator = "eq" | "neq" | "gt" | "lt" | "gte" | "lte" | "contains";

type FilterCondition = {
  field: string;
  operator: FilterOperator;
  value: unknown;
};

@injectable()
export class FilterExecutor implements IActionExecutor {
  supports(type: string): boolean {
    return type === "filter";
  }

  execute(
    payload: Record<string, unknown>,
    config: Record<string, unknown>,
  ): Record<string, unknown> | null {
    const conditionItems = Array.isArray(config.conditions) ? config.conditions : [];
    const conditions = conditionItems.filter((item): item is FilterCondition => this.isFilterCondition(item));

    if (conditions.length === 0) {
      return payload;
    }

    const mode = String(config.mode ?? "all").toLowerCase();
    const evaluations = conditions.map((condition) => this.evaluateCondition(payload, condition));

    const passed = mode === "any" ? evaluations.some(Boolean) : evaluations.every(Boolean);
    return passed ? payload : null;
  }

  private evaluateCondition(payload: Record<string, unknown>, condition: FilterCondition): boolean {
    const left = payload[condition.field];
    const right = condition.value;

    switch (condition.operator) {
      case "eq":
        return left === right;
      case "neq":
        return left !== right;
      case "gt":
        return this.toNumber(left) > this.toNumber(right);
      case "lt":
        return this.toNumber(left) < this.toNumber(right);
      case "gte":
        return this.toNumber(left) >= this.toNumber(right);
      case "lte":
        return this.toNumber(left) <= this.toNumber(right);
      case "contains":
        if (typeof left === "string") {
          return left.includes(String(right));
        }
        if (Array.isArray(left)) {
          return left.includes(right);
        }
        return false;
      default:
        return false;
    }
  }

  private toNumber(value: unknown): number {
    const num = typeof value === "number" ? value : Number(value);
    return Number.isFinite(num) ? num : Number.NaN;
  }

  private isFilterCondition(value: unknown): value is FilterCondition {
    if (!value || typeof value !== "object") {
      return false;
    }

    const candidate = value as Partial<FilterCondition>;
    const allowedOperators: FilterOperator[] = ["eq", "neq", "gt", "lt", "gte", "lte", "contains"];
    return (
      typeof candidate.field === "string" &&
      typeof candidate.operator === "string" &&
      allowedOperators.includes(candidate.operator as FilterOperator)
    );
  }
}
