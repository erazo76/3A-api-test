import { Injectable, Logger} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductDto } from '../dtos/product.dto';
import { Product } from '../entities/product.entity';


@Injectable()
export class ProductService {
  logger: Logger;
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) { this.logger = new Logger('Reports Service'); }

  async create(createProductDto: CreateProductDto, owner: string) {
    let { name, price} = createProductDto;
    try { 
        const created = new this.productModel({name, price, owner});            
        await created.save();
    } catch (e) {           
        console.log(e);
    } 
  }

  async getProducts(productDto: ProductDto): Promise<any> {

  }

  async updateProduct(productDto: ProductDto): Promise<any> {

  }  

}


