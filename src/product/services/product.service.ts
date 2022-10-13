import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from '../dtos/create-product.dto';
import { Product } from '../entities/product.entity';
import { ICreateProductService } from '../interfaces/product.interface';

@Injectable()
export class ProductService implements ICreateProductService {
  logger: Logger;
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {
    this.logger = new Logger('Reports Service');
  }

  /**
   * It creates a new product and saves it to the database
   * @param {CreateProductDto} createProductDto - This is the DTO that we created earlier.
   * @param {string} owner - string - the owner of the product
   */
  async create(
    createProductDto: CreateProductDto,
    owner: string,
  ): Promise<any> {
    const { name, price } = createProductDto;
    try {
      const created = new this.productModel({ name, price, owner });
      await created.save();
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * It gets the products from the database, and returns the result, the count of the result, and the
   * number of pages
   * @param {number} limit - The number of products to return per page.
   * @param {number} page - The page number.
   * @returns {
   *     res,
   *     count: count,
   *     pages,
   *   }
   */
  async getProducts(limit: number, page: number): Promise<any> {
    try {
      const offset: number = (page - 1) * limit;
      const resultCount = await this.productModel.countDocuments({
        status: true,
      });
      const res = await this.productModel
        .find()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate({ path: 'owner', select: 'name email' });
      const count = resultCount;
      const pages: number = count == 0 ? 0 : Math.ceil(count / limit);
      return {
        res,
        count: count,
        pages,
      };
    } catch (e) {
      Logger.error(e);
    }
  }

  /**
   * It updates the product with the given id and ownerId
   * @param {UpdateProductDto} upadateProductDto - UpdateProductDto - This is the DTO that we created
   * earlier.
   * @param {string} id - The id of the product to be updated.
   * @param {string} ownerId - The id of the user who is trying to update the product.
   * @returns 1. If the product is not found
   *   2. If the product is found but the owner is not the same as the one who is trying to update the
   * product
   *   3. If the product is found and the owner is the same as the one who is trying to update the
   * product
   */
  async updateProduct(
    upadateProductDto: UpdateProductDto,
    id: string,
    ownerId: string,
  ): Promise<any> {
    const { name, price } = upadateProductDto;
    const owner = await this.productModel.find({ _id: id });

    try {
      if (owner[0] == undefined) {
        return 1;
      }

      if (JSON.stringify(owner[0].owner) != JSON.stringify(ownerId)) {
        return 0;
      }
      const products = await this.productModel.findOneAndUpdate(
        { _id: id },
        { $set: { name, price } },
        { useFindAndModify: true, returnOriginal: false },
      );
      return products;
    } catch (error) {
      Logger.error(error);
    }
  }

  /**
   * It removes a product from the database
   * @param {string} id - The id of the product to be deleted
   * @param {string} ownerId - The id of the user who is trying to delete the product.
   * @returns the deleted product.
   */
  async removeProduct(id: string, ownerId: string): Promise<any> {
    const owner = await this.productModel.find({ _id: id });

    try {
      if (owner[0] == undefined) {
        return 1;
      }
      if (JSON.stringify(owner[0].owner) != JSON.stringify(ownerId)) {
        return 0;
      }
      const deleted = await this.productModel.findOneAndDelete({ _id: id });
      return deleted;
    } catch (e) {
      console.log(e);
    }
  }
}
