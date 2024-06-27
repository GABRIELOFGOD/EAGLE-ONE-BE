import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ContinueRegistrationDto } from './dto/continue-registration.dto';

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

  @Post('confirm-email?token')
  confirmRegistratioh(@Query('token') token: string, @Body(ValidationPipe) continueRegistrationDto:ContinueRegistrationDto){
    return this.userService.confirmRegistration(token, continueRegistrationDto)
  }

  @Post('login')
  login(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto)
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
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
