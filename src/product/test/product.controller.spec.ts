import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../controllers/product.controller';
import {
  CREATE_PRODUCT_SERVICE,
  ICreateProductService,
} from '../interfaces/product.interface';

jest.mock('../interfaces/product.interface');
const fakeProduct = {
  name: 'Cacao En Polvo',
  priece: 456.56,
  owner: '6346cfe400bf87214ff680dc',
};

const req = {
  name: 'Gustavo Erazo',
  email: 'erazo.gustavo@gmail.com',
  id: '6346cfe400bf87214ff680dc',
};


const mockProviders = [
  {
    provide: CREATE_PRODUCT_SERVICE,
    useValue: {
      create: jest.fn().mockResolvedValue(fakeProduct),
      getProducts: jest.fn().mockResolvedValue([fakeProduct]),
      updateProduct: jest.fn().mockResolvedValue(fakeProduct),
      removeProduct: jest.fn().mockResolvedValue(fakeProduct),    
    },
  },
];

describe('ProductsController', () => {
  let controller: ProductController;
  let service: ICreateProductService; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ProductController],
      providers: [...mockProviders],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ICreateProductService>(CREATE_PRODUCT_SERVICE);
    jest.clearAllMocks();
  }); 

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});
