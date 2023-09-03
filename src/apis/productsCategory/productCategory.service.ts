import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './entities/productCategory.entity';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>, //DB Connection 객체, Generic을 지정해주어야함
  ) {}

  async create({ name }) {
    const result = await this.productCategoryRepository.save({
      name: name,
    });
    return result;
  }
}
