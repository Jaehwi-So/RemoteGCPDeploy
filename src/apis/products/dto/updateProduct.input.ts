import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './createProduct.input';

@InputType()
//PartialType 사용으로 구성요소들을 Nullable 허용 타임으로 변경
//PickType(CreateProductInput, ["name", "price"])   => name과 price의 타입만 상속
//OmitType(CreateProductInput, ['description']) => description 타입은 상속 제외
export class UpdateProductInput extends PartialType(CreateProductInput) {}
