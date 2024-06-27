import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';
import { MailerService } from './user/utils/mailer.service';
// import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRESS_HOST'),
        port: +configService.get('POSTGRESS_PORT'),
        username: configService.get('POSTGRESS_USER'),
        password: configService.get('POSTGRESS_PASSWORD'),
        database: configService.get('POSTGRESS_DATABASE'),
        entities: [UserEntity],
        synchronize: true,
      })
    }), UserModule],
  controllers: [AppController],
  providers: [AppService, MailerService],
})
export class AppModule {}
