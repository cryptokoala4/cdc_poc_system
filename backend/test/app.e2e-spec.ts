import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('POS System (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should respond to a simple GraphQL query', async () => {
    const query = `
      query {
        __schema {
          types {
            name
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data.__schema).toBeDefined();
    expect(Array.isArray(response.body.data.__schema.types)).toBe(true);
  });

  it('should fetch menu items', async () => {
    const query = `
      query {
        menuItems {
          _id
          name
          price
          category
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data.menuItems).toBeDefined();
    expect(Array.isArray(response.body.data.menuItems)).toBe(true);

    if (response.body.data.menuItems.length > 0) {
      const firstItem = response.body.data.menuItems[0];
      expect(firstItem).toHaveProperty('_id');
      expect(firstItem).toHaveProperty('name');
      expect(firstItem).toHaveProperty('price');
      expect(firstItem).toHaveProperty('category');
      expect(firstItem).toHaveProperty('imageUrl');
    }
  });
});
