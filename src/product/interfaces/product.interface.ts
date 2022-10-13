import { CreateProductDto, UpdateProductDto } from '../dtos/create-product.dto';

export const PRODUCT_SERVICE = 'PRODUCT SERVICE';

export interface ICreateProductService {
  create(createProductDto: CreateProductDto, owner: string): Promise<any>;
  getProducts(limit: number, page: number): Promise<any>;
  updateProduct(
    upadateProductDto: UpdateProductDto,
    id: string,
    ownerId: string,
  ): Promise<any>;
  removeProduct(id: string, ownerId: string): Promise<any>;
}
