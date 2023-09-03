import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface ICurrentUser {
  id?: string;
  email: string;
  name?: string;
  password?: string;
  age?: number;
}

//req.user을 GraphQL에서 사용하는 방식으로 바꾸는 커스텀 데코레이터 생성
export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext): ICurrentUser => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
