import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export var App: INestApplication;

NestFactory.create(AppModule).then(
  async (app) => {
    App = app; 
    app.enableCors();
    await app.listen(3000);
  }
);
