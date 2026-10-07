import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { UsersModule } from '../users/users.module.js';
import { AccountController } from './account.controller.js';
import { AccountService } from './account.service.js';
import { AvatarStorage, LocalAvatarStorage } from './avatar/avatar-storage.js';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AccountController],
  providers: [AccountService, { provide: AvatarStorage, useClass: LocalAvatarStorage }],
})
export class AccountModule {}
