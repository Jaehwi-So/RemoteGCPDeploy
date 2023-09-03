import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './apis/auth/auth.module';
import { FileModule } from './apis/file/file.module';
import { PaymentMoudle } from './apis/payment/payment.module';
import { PointTransactionModule } from './apis/pointTransaction/pointTransaction.module';
import { ProductModule } from './apis/products/product.module';
import { ProductCategoryModule } from './apis/productsCategory/productCategory.module';
import { UserModule } from './apis/users/user.module';
import { ConfigurationModule } from './commons/config/config.module';

@Module({
  imports: [
    //사용 모듈 Import

    ConfigModule.forRoot(),
    ProductCategoryModule,
    ProductModule,
    UserModule,
    AuthModule,
    PointTransactionModule,
    PaymentMoudle,
    FileModule,

    //GraphQL 사용
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }), //graphQL로 들어온 req와 res를 뒤의 로직에서 사용하겠다
    }),

    //ORM : Database Connection
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1111',
      database: 'mydocker03',
      //entities: [Board],
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
