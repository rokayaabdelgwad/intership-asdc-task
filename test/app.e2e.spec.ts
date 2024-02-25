import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import { UserModule } from '../src/modules/user/user.module';
import { AuthModule } from '../src/modules/auth/auth.module';
import { StorageModule } from '../src/modules/storage/storage.module';
import { AuthDto } from '../src/modules/auth/dto';
import { UpdateUserDto } from '../src/modules/user/dto/user.dto';
import { NationalIDDto } from '../src/modules/user/dto/nationalId.dto';
import { UserDto } from '../src/modules/user/dto/user.auth.dto';
describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, UserModule, AuthModule, StorageModule], // Ensure all required modules are imported
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3000);

    prisma = app.get(PrismaService);
    await prisma.cleandb();
    // for no repeate URL
    pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'testAll@example.com',
      password: 'test123',
    };
    describe('Signup', () => {
      it('Should throw throw if email is not empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ passport: dto.password })
          .expectStatus(400);
      });
      it('Should throw throw if password is not empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
        // .inspect()
      });
    });
    describe('Signin', () => {
      it('Should throw throw if email is not empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ passport: dto.password })
          .expectStatus(400);
      });
      it('Should throw throw if password is not empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/login').expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(201)
          .stores('userAt', 'access_token'); //to save a the access token
        // .inspect()
      });
    });
  });
  describe('User', () => {
    const dto: UserDto = {
      email: 'user@example.com',
      password: 'rokaya123',
    };
    describe('Get me', () => {
      it('should get current user ', () => {
        return (
          pactum
            .spec()
            .get('/users/me')
            //   .withHeaders({
            //   Authorization: 'Bearer $S{userAt}',
            //   })  for  Authorized
            .expectStatus(200)
        );
        // .inspect()
      });
    });
    describe('Create user', () => {
      it('Should throw throw if email is not empty', () => {
        return pactum
          .spec()
          .post('/users/create-user')
          .withBody({ passport: dto.password })
          .expectStatus(400);
      });
      it('Should throw throw if password is not empty', () => {
        return pactum
          .spec()
          .post('/users/create-user')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/users/create-user').expectStatus(400);
      });
      it('should create a new user', () => {
        return pactum
          .spec()
          .post('/users/create-user')
          .withBody(dto)
          .expectStatus(201)
        .inspect()
      });
    });
    describe('Get all users', () => {
      it('Should get all of users', () => {
        return pactum.spec().get('/users/get-all-users').expectStatus(200)
        .inspect()
      });
    });
    describe('Get user by id', () => {
      it('Should  throw if no user with id ', () => {
        return pactum.spec().get('/users/get-user/203').expectStatus(404);
        // .inspect()
      });
    });
    describe('Delete user by id', () => {
      it('Should  throw if no user with id ', () => {
        return pactum.spec().delete('/users/delete-user/15').expectStatus(404);
        // .inspect()
      });
    });
    describe('update user by id', () => {
      const dto: UpdateUserDto = new UpdateUserDto('example@example.com', 'rokaya', 'ali');
});
      it('Should  throw if no user with id ', () => {
        return pactum.spec().withBody(dto).patch('/users/update-user/177').expectStatus(404);
        // .inspect()
      });
    });
  });
  
