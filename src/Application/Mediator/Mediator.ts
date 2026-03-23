import { DependencyContainer, InjectionToken } from "tsyringe";
import { IMediator, IRequestHandler } from "../Contracts/IMediator";
import { AppError } from "../../Common/AppError";


type RequestConstructor = new (...args: any[]) => object;

export class Mediator implements IMediator {
  constructor(
    private readonly dependencyContainer: DependencyContainer,
    private readonly handlerRegistry: ReadonlyMap<RequestConstructor, InjectionToken<unknown>>,
  ) {}

  async send<TResponse>(request: object): Promise<TResponse> {
    const requestType = request.constructor as RequestConstructor;
    const handlerToken = this.handlerRegistry.get(requestType);

    if (!handlerToken) {
      throw AppError.internal(`No handler registered for request: ${requestType.name}`);
    }

    const handler = this.dependencyContainer.resolve(handlerToken) as IRequestHandler<object, TResponse>;

    return handler.execute(request);
  }
}
