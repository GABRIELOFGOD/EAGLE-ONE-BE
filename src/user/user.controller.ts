import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ContinueRegistrationDto } from './dto/continue-registration.dto';
import { ForgotPasswordDto } from './dto/user-forgot-password-dto';

// TODO: 
// - npm install bcrypt class-validator class-transformer

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @Post('confirm-email')
  // confirmRegistratioh(@Body(ValidationPipe) continueRegistrationDto:ContinueRegistrationDto){
  //   return this.userService.confirmRegistration(continueRegistrationDto)
  // }

  @Post('confirm-email')
  confirmRegistration(@Query('email') email: string, @Body(ValidationPipe) continueRegistrationDto:ContinueRegistrationDto){
    return this.userService.confirmRegistration(email, continueRegistrationDto)
  }

  @Post('login')
  login(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto)
  }

  @Post("forgot-password")
  forgotPassword(@Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto) {
    return this.userService.forgotPassword(forgotPasswordDto);
  };

  @Post("reset-password")
  newPasswordReset(@Query("token") token: string, @Body(ValidationPipe) continueRegistrationDto: ContinueRegistrationDto) {
    return this.userService.newPasswordReset(token, continueRegistrationDto);
  };

  @Get("profile")
  profile(@Query("token") token: string) {
    return this.userService.profile(token);
  };









  // =============== NO END POINT AFTER HERE ====================== //

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ValidationPipe) id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
