import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/guard/gql-auth.guard';
import {
  CurrentUser,
  ICurrentUser,
} from 'src/commons/auth/gpl-request-parser/gql-user.param';

@Resolver()
export class UserResolver {
  //
  PASSWORD_SECRET = 10;
  constructor(
    private readonly userService: UserService, //
  ) {}
  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
    @Args('age') age: number,
  ) {
    //createUser
    const hashedPassword = await bcrypt.hash(password, this.PASSWORD_SECRET);
    return this.userService.create({ email, hashedPassword, name, age });
  }

  // ### REST API에서는 여기까지만 하면 됨!!
  //@UseGuards(AuthGuard('myAuth'))
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => String)
  fetchUser(
    @CurrentUser() currentUser: ICurrentUser, // req.user를 GraphQL의 방식으로 변경해주는 커스텀 데코레이터 생성하여 사용
  ) {
    console.log('User Info', currentUser);
    return 'qqq';
  }
}
