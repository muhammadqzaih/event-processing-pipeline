export interface IRequestHandler<TRequest = object, TResponse = unknown> {
  execute(request: TRequest): Promise<TResponse>;
}

export interface IMediator {
  send<TResponse>(request: object): Promise<TResponse>;
}
