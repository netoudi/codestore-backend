import { Injectable } from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find();
  }

  findOne(idOrSlug: string) {
    const where = uuidValidate(idOrSlug)
      ? { id: idOrSlug }
      : { slug: idOrSlug };
    return this.productRepository.findOneByOrFail(where);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const result = await this.productRepository.update(id, updateProductDto);
    if (!result.affected) throw new EntityNotFoundError(Product, id);
    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.productRepository.delete(id);
    if (!result.affected) throw new EntityNotFoundError(Product, id);
  }
}
