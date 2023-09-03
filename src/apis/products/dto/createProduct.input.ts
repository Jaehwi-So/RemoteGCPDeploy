import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { ProductSalesLocationInput } from 'src/apis/productsSalesLoctation/dto/productSalesLocation.input';

//graphQL의 Inpyt Type 정의하기
@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => Int)
  @Min(0)
  price: number;

  //1:1
  @Field(() => ProductSalesLocationInput)
  productSalesLocation: ProductSalesLocationInput;

  //N:1
  @Field(() => String)
  productCategoryId: string;

  //N:M
  @Field(() => [String])
  productTags: string[];
}
