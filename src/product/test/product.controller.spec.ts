import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../controllers/product.controller';
import { PRODUCT_SERVICE } from '../interfaces/product.interface';

const fakeProduct = {
  name: 'Cacao En Polvo',
  priece: 456.56,
  owner: '6346cfe400bf87214ff680dc',
};

/*const req = {
  name: 'Gustavo Erazo',
  email: 'erazo.gustavo@gmail.com',
  id: '6346cfe400bf87214ff680dc',
};*/

const mockProviders = [
  {
    provide: PRODUCT_SERVICE,
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
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ProductController],
      providers: [...mockProviders],
    }).compile();
    controller = module.get<ProductController>(ProductController);
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
