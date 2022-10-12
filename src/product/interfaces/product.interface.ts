import { CreateProductDto, UpdateProductDto } from '../dtos/create-product.dto';

export const CREATE_PRODUCT_SERVICE = 'CREATE PRODUCT SERVICE';

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
