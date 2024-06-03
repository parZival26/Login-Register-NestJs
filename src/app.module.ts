import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MineroModule } from './minero/minero.module';


@Module({
  imports: [UserModule, AuthModule, MineroModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
