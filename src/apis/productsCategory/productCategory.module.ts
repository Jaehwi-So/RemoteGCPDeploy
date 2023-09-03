import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './entities/productCategory.entity';
import { ProductCategoryResolver } from './productCategory.resolver';
import { ProductCategoryService } from './productCategory.service';

@Module({
  //Typeorm 모듈 사용을 위해 Inject
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  providers: [
    ProductCategoryResolver, //Resolver와 Service 주입 -> contructor에서 사용
    ProductCategoryService,
  ],
})
export class ProductCategoryModule {
  //
}
