import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { isNullableType } from 'graphql';
import { ProductCategory } from 'src/apis/productsCategory/entities/productCategory.entity';
import { ProductSalesLocation } from 'src/apis/productsSalesLoctation/entities/productSalesLocation.entity';
import { ProductTag } from 'src/apis/productTags/entities/productTag.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Product {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => Int)
  @Column()
  @Min(0) //class-validator 설정필요
  price: number;

  @Field(() => Boolean)
  @Column({ default: false })
  isSoldOut: boolean;

  @DeleteDateColumn() //TypeORM 제공 삭제여부 타임스탬프
  deletedAt: Date;

  //1:1 엔터티 연결
  @Field(() => ProductSalesLocation)
  @JoinColumn()
  @OneToOne(() => ProductSalesLocation)
  productSalesLocation: ProductSalesLocation;

  //N(상품): 1(카테고리) 엔터티 연결
  //Many 부분에 해당하는 테이블에서는 JoinColumn 생략 가능
  @Field(() => ProductCategory)
  @ManyToOne(() => ProductCategory)
  productCategory: ProductCategory;

  //N(상품): 1(유저) 엔터티 연결
  @Field(() => User)
  @ManyToOne(() => User)
  user: User;

  //N(상품): M(상품태그) 엔터티 연결, ProductTags가 나를 찾을 때 인식하는 방법을 무명 함수로 인자 넣음
  //JoinTable은 N:M 관계의 중간 테이블을 자동 생성해주며, 기준 테이블 한쪽에만 작성하면 됨
  @Field(() => [ProductTag])
  @JoinTable()
  @ManyToMany(() => ProductTag, (productTags) => productTags.products)
  productTags: ProductTag[];
}
