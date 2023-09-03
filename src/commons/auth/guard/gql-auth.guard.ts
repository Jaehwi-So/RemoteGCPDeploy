import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

//AuthGuard를 GraphQL 전용으로 바꾸기 위해 상속
export class GqlAuthAccessGuard extends AuthGuard('access') {
  //Overriding : Request를 REST에서 GraphQL 전용으로 변경
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}

export class GqlAuthRefreshGuard extends AuthGuard('refresh') {
  //Overriding : Request를 REST에서 GraphQL 전용으로 변경
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
