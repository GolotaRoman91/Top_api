import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';

const loginDto: AuthDto = {
  login: 'newUser@mail.com',
  password: 'test1234',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    expect(response.body.access_token).toBeDefined();
  });

  it('/auth/login (POST) - fail password', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: '2' })
      .expect(401);

    expect(response.body.message).toBe('wrong password!');
  });

  it('/auth/login (POST) - fail email', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, login: 'aaa@a.com' })
      .expect(401);

    expect(response.body.message).toBe('user not found!');
  });

  afterAll(() => {
    disconnect();
  });
});
