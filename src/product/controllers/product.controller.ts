import { Body, Controller, Get, HttpStatus, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductDto } from '../dtos/product.dto';
import { ProductService } from '../services/product.service';

@Controller('products')
export class ProductController {
    constructor (private productService: ProductService){}

    @Post()
    @UseGuards(AuthGuard())        
    async create(@Res() res:Response, @Body() createProductDto: CreateProductDto, @Req() req: Request): Promise<any>{
      const {user} = <any>req;
      const owner = String(user._id);      
      let product = await this.productService.create(createProductDto,owner);
      return res.status(HttpStatus.OK).json(product);        
    }

    @Get()
    @UseGuards(AuthGuard())         
    async getProducts(@Res() res:Response, @Query() productDto: ProductDto): Promise<any>{
      let product = await this.productService.getProducts(productDto);
      if(product.length < 1){
        return res.status(HttpStatus.NOT_FOUND).json({message:'There is no data'});       
      } 
      return res.status(HttpStatus.OK).json(product);        
    }

    @Put()    
    @UseGuards(AuthGuard()) 
    async updateProduct(@Body() productDto: ProductDto): Promise<any>{      
      return await this.productService.updateProduct(productDto);             
    }

 

}
