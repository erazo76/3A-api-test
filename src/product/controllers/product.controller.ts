import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  Delete,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductDto, UpdateProductDto } from '../dtos/create-product.dto';
import {
  CREATE_PRODUCT_SERVICE,
  ICreateProductService,
} from '../interfaces/product.interface';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  // constructor (private productService: ProductService){}
  constructor(
    @Inject(CREATE_PRODUCT_SERVICE)
    private readonly productService: ICreateProductService,
  ) {}
  @Post()
  @ApiBearerAuth('access-token')
  @ApiHeader({ name: 'Authorization', required: true })
  @ApiResponse({ type: CreateProductDto, status: 201 })
  @ApiOperation({ summary: 'Register a product by name, price and owner' })
  @UseGuards(AuthGuard())
  async create(
    @Res() res: Response,
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request,
  ): Promise<any> {
    const { user } = <any>req;
    const owner = String(user._id);
    const product = await this.productService.create(createProductDto, owner);
    return res.status(HttpStatus.OK).json(product);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiHeader({ name: 'Authorization', required: true })
  @ApiResponse({ status: 200 })
  @ApiOperation({
    summary: 'Obtain paginated product list included referenced owner',
  })
  @UseGuards(AuthGuard())
  async getProducts(@Res() res: Response, @Query() query): Promise<any> {
    let limit;
    let page;
    if (
      query.limit != null &&
      query.limit != 'null' &&
      query.limit != undefined &&
      query.limit != 'undefined'
    ) {
      limit = parseInt(query.limit);
    } else {
      limit = null;
    }
    if (
      query.page != null &&
      query.page != 'null' &&
      query.page != undefined &&
      query.page != 'undefined'
    ) {
      page = parseInt(query.page);
    } else {
      page = null;
    }
    const product = await this.productService.getProducts(limit, page);
    if (product.res.length < 1) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'There is no data' });
    }
    return res.status(HttpStatus.OK).json(product);
  }

  @Put('/:id')
  @ApiBearerAuth('access-token')
  @ApiHeader({ name: 'Authorization', required: true })
  @ApiResponse({ type: UpdateProductDto, status: 200 })
  @ApiOperation({ summary: 'Update a product  by id' })
  @UseGuards(AuthGuard())
  async updateProduct(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request,
  ): Promise<any> {
    const { user } = <any>req;
    const ownerId = String(user._id);
    const product = await this.productService.updateProduct(
      updateProductDto,
      id,
      ownerId,
    );
    if (product == 0) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: `this is not the product's owner` });
    }
    if (product == 1) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'There is no data' });
    }
    return res.status(HttpStatus.OK).json(product);
  }

  @Delete('/:id')
  @ApiBearerAuth('access-token')
  @ApiHeader({ name: 'Authorization', required: true })
  @ApiResponse({ status: 200 })
  @ApiOperation({ summary: 'Remove a product  by id' })
  @UseGuards(AuthGuard())
  async removeProduct(
    @Res() res: Response,
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<any> {
    const { user } = <any>req;
    const ownerId = String(user._id);
    const product = await this.productService.removeProduct(id, ownerId);
    if (product == 0) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: `this is not the product's owner` });
    }
    if (product == 1) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'There is no data' });
    }
    return res.status(HttpStatus.OK).json(product);
  }
}
