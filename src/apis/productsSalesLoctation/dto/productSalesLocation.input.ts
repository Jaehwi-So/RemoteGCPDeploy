import { Field, Float, InputType, Int, OmitType } from '@nestjs/graphql';
import { ProductSalesLocation } from '../entities/productSalesLocation.entity';

@InputType()
//ID를 제외하고 InputType으로 사용
export class ProductSalesLocationInput extends OmitType(
  ProductSalesLocation,
  [
    'id', //
  ],
  InputType,
) {
  // @Field(() => String)
  // address: string;
  // @Field(() => String)
  // addressDetail: string;
  // @Field(() => Float)
  // lat: number; //위도
  // @Field(() => Float)
  // lng: number; //경도
  // @Field(() => Date)
  // meetingTime: Date;
}
