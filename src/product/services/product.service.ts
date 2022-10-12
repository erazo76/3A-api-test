import { Injectable, Logger} from '@nestjs/common';
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

  async getProducts(limit: number, page: number): Promise<any> {
      try{
        const offset: number = (page - 1) * limit;
        const resultCount = await this.productModel.countDocuments({
          status: true,
        });
        const res = await this.productModel
          .find()
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
          .populate({path:'owner',select:'name email'})
          const count = resultCount;
        const pages: number = count == 0 ? 0 : Math.ceil(count / limit);
        return{
          res,
          count: count,
          pages,
        };
      } catch (e) {
        Logger.error(e);        
      }
  }  

  async updateProduct(productDto: ProductDto): Promise<any> {

  }  

}


