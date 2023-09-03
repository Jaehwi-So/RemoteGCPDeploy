import {
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSalesLocation } from '../productsSalesLoctation/entities/productSalesLocation.entity';
import { ProductTag } from '../productTags/entities/productTag.entity';
import { CreateProductInput } from './dto/createProduct.input';
import { UpdateProductInput } from './dto/updateProduct.input';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>, //DB Connection 객체, Generic을 지정해주어야함
    @InjectRepository(ProductSalesLocation)
    private readonly productSalesLocationRepository: Repository<ProductSalesLocation>,
    @InjectRepository(ProductTag)
    private readonly productTagRepository: Repository<ProductTag>,
  ) {}

  async create({ input }) {
    //상품과 거래위치 같이 등록
    const { productSalesLocation, productCategoryId, productTags, ...product } =
      input; //REST 파라미터 이용 구조분해할당
    const location = await this.productSalesLocationRepository.save({
      ...productSalesLocation,
    });

    //태그 등록 / productTags ["#전자제품", "#컴퓨터"]
    let tagList = [];
    for (let i = 0; i < productTags.length; i++) {
      //해당 방법도 가능하나 Promise.All로 처리하는 것이 효율적
      const tagName = productTags[i].replace('#', '');
      const existTag = await this.productTagRepository.findOne({
        name: tagName,
      });
      if (existTag) {
        await tagList.push(existTag);
      } else {
        const newTag = await this.productTagRepository.save({
          name: tagName,
        });
        await tagList.push(newTag);
      }
    }

    const result = await this.productRepository.save({
      ...product,
      productSalesLocation: location, //result 통째로 넣기 vs id만 넣기
      productCategory: {
        id: productCategoryId,
      },
      productTags: tagList,
    });
    return result;
  }

  async findAll() {
    const result = await this.productRepository.find({
      relations: ['productSalesLocation', 'productCategory', 'productTags'], //Join table
    });
    return result;
  }

  async findOne({ id }) {
    const result = await this.productRepository.findOne({
      where: {
        id: id,
      },
      relations: ['productSalesLocation', 'productCategory', 'productTags'],
    });
    return result;
  }

  async update({ id, input }) {
    const product = await this.productRepository.findOne({
      where: { id: id },
    });

    const newProduct = {
      ...product, //기존 Object
      id: id, //해당 id에 해당하는 것을 찾는 where임.
      ...input, //해당 부분 갱신.
    };
    const result = await this.productRepository.save(newProduct); //해당 PK를 찾아 알아서 갱신해줌.
    return result; //graphQL result 객체에 모든 요소를 반환하려면 새로운 완전한 객체를 생성하여 저장하는 형식으로
  }

  async checkSoldOut({ id }) {
    const product = await this.productRepository.findOne({
      where: { id: id },
    });
    if (product.isSoldOut) {
      // throw new HttpException(
      //   '이미 판매 완료된 상품입니다.',
      //   HttpStatus.UNPROCESSABLE_ENTITY,
      // );
      throw new UnprocessableEntityException('이미 판매 완료된 상품입니다.');
    }
  }

  // //4. TypeORM 제공 SoftRemove(ID로만 삭제가능)
  // async RemoveSoft({ id }) {
  //   this.productRepository.softRemove({ id: id });
  // }

  //5. TypeORM 제공 SoftDelete(다른 것으로 삭제 가능)
  async deleteSoft({ id }) {
    const result = await this.productRepository.softDelete({ id: id });
    return result.affected ? true : false; //행이 영향을 받았는지 확인
  }
}
