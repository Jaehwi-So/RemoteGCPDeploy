import { UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/guard/gql-auth.guard';
import { CurrentUser } from 'src/commons/auth/gpl-request-parser/gql-user.param';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly userService: UserService, //
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: any,
  ) {
    //1. 이메일, 비밀번호 일치 유저 찾기
    const user = await this.userService.findOne({ email });

    //2. 일치하는 유저 없으면 에러
    if (!user) {
      throw new UnprocessableEntityException('이메일이 없습니다.');
    }

    //3. 일치하는 유저가 있지만 비밀번호 틀린경우 에러
    const isAuth = await bcrypt.compare(password, user.password);

    if (!isAuth) {
      throw new UnprocessableEntityException('비밀번호가 일치하지 않습니다.');
    }

    //4. 모두 일치 유저가 있다면 JWT Refresh Token 쿠키에 발급
    this.authService.setRefreshToken({ user, res: context.req.res });

    //5. 모두 일치 유저가 있다면 JWT Access Token 발급
    return this.authService.getAccessToken({ user });
  }

  //리프레쉬 토큰으로 새로운 엑세스 토큰 발급
  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(@CurrentUser() currentUser: any) {
    return this.authService.getAccessToken({ user: currentUser });
  }
}
