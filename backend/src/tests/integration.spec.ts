import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { MongooseModule } from '@nestjs/mongoose';

describe('GraphQL API Integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forRoot('mongodb://localhost/test_db'),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should fetch menu items', async () => {
    const getMenuItemsQuery = `
      query {
        menuItems {
          _id
          name
          description
          price
          category
        }
      }
    `;

    const response = await request(app.getHttpServer()).post('/graphql').send({
      query: getMenuItemsQuery,
    });

    console.log('Full response:', JSON.stringify(response.body, null, 2));

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.menuItems).toBeDefined();
    expect(Array.isArray(response.body.data.menuItems)).toBeTruthy();

    if (response.body.data.menuItems.length > 0) {
      const firstItem = response.body.data.menuItems[0];
      expect(firstItem).toHaveProperty('_id');
      expect(firstItem).toHaveProperty('name');
      expect(firstItem).toHaveProperty('price');
      expect(firstItem).toHaveProperty('category');
    }
  });
});
