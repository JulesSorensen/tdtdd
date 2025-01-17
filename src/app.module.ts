import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { DatabaseModule } from './database.module';
import { UsersModule } from './users/users.module';
import { AModule } from './a/a.module';

@Module({
  imports: [AuthModule, BooksModule, DatabaseModule, UsersModule, AModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
