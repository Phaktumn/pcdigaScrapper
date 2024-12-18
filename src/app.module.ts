import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { NestCrawlerModule } from 'nest-crawler';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { AutosearchModule } from './autosearch/autosearch.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ThirdPartyModule } from './third-party/third-party.module';
import { ThirdPartyEmailService } from './third-party/third-party.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_DB ||
        'mongodb+srv://jorge:jorge@cluster0.f1efp.mongodb.net/pcdigaScrapper?retryWrites=true',
        //'mongodb+srv://jorge:<password>@cluster0.f1efp.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      typePaths: ['./**/*.graphql'],
      driver: ApolloDriver,
      introspection: true,
      playground: true,
      definitions: {
        path: join(process.cwd(), 'src/graphql-schema.ts'),
        customScalarTypeMapping: {
          DateTime: 'Date',
        },
      },
    }),
    ProductsModule,
    NestCrawlerModule,
    AutosearchModule,
    ThirdPartyModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, ThirdPartyEmailService],
})
export class AppModule {}
