export interface IActionExecutor {
  supports(type: string): boolean;
  execute(
    payload: Record<string, unknown>,
    config: Record<string, unknown>,
  ): Record<string, unknown> | null;
}
