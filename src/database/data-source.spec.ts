import dataSource from './data-source';
import { Product } from '../products/entities/product.entity';

describe('DataSource', () => {
  it('should list all products', async () => {
    try {
      await dataSource.initialize();
      const productRepository = await dataSource.getRepository(Product);
      const products = await productRepository.find();
      expect(products.length).toEqual(products.length);
      console.log(products);
    } catch (e) {
      console.log(e);
    }
  });
});
