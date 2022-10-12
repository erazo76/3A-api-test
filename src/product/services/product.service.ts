import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from '../dtos/create-product.dto';
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

  async updateProduct(upadateProductDto: UpdateProductDto, id: string, ownerId:string): Promise<any> {
    let {  name, price } = upadateProductDto;
    const owner = await this.productModel.find({_id: id}); 
    
    try {  
      if(owner[0] == undefined){
        return 1;
      }  

      if(JSON.stringify(owner[0].owner) != JSON.stringify(ownerId)){
        return 0;
      }
      const products = await this.productModel.findOneAndUpdate(
        { _id: id },
        { $set: { name, price } },
        { useFindAndModify: true, returnOriginal: false }
      );
      return products;
    } catch (error) {
      Logger.error(error);
     
    }
  }  

  async removeProduct(id:string, ownerId: string ): Promise<any> {
    const owner = await this.productModel.find({_id: id});
    
    try {   
      if(owner[0] == undefined){
        return 1;
      }    
      if(JSON.stringify(owner[0].owner) != JSON.stringify(ownerId)){
        return 0;
      }     
      const deleted = await this.productModel.findOneAndDelete({_id: id});            
      return deleted;
    } catch (e) {
      console.log(e);
    }
  } 

}


