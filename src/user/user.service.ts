import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { UserEntity } from './entities/user.entity';
import { MailerService } from './utils/mailer.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ContinueRegistrationDto } from './dto/continue-registration.dto';

@Injectable()
export class UserService {
  constructor (
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService
  ) {}
  
  async create(createUserDto: CreateUserDto) {
    try {
      const userExists = await this.userRepository.findOne({
        where: { email: createUserDto.email }
      });
  
      if (userExists) {
        throw new ConflictException('This email is registered with us already, kindly go to login to access your account')
      }
  
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
  
      const payload = { email: user.email, sub: user.id, date: Date.now() };
      const token = this.jwtService.sign(payload);
      console.log(user.id)
  
      // Use the custom scheme and host you configured for deep linking
      let link = `https://alpha.youdoc.co/confirm-registration?token=${token}`;
  
      await this.mailerService.sendRegistrationMail(createUserDto.email, link);
  
      const response = {
        message: `A confirmation mail has been sent to ${createUserDto.email}`
      }
      
      return response;
  
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('duplicate key value')) {
        throw new ConflictException('This email is registered with us already, kindly go to login to access your account');
      }
      if (error instanceof ConflictException) {
        throw new ConflictException('This email is registered with us already, kindly go to login to access your account');
      }
      console.log(error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
  

  // async continueRegistration(continueRegistrationDto: ContinueRegistrationDto){

  //   const salt = await bcrypt.genSalt();
  //   continueRegistrationDto.password = await bcrypt.hash(continueRegistrationDto.password, salt);

  // }

  validateToken(token: string): any {
    try {
      const validToken = this.jwtService.verify(token);
      if (validToken) {
        console.log("validToken", validToken);
        return validToken;
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async confirmRegistration(token: string, continueRegistrationDto:ContinueRegistrationDto){
    try {
      const validToken = this.validateToken(token);
      console.log(validToken)
      
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password}: LoginUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { email: user.email, sub: user.id };
      const token = this.jwtService.sign(payload);

      return { access_token: token };
    } catch (error) {
      throw error
    }
  }

  async findAll() {
    try {
      return await this.userRepository.find()
    } catch (error) {
      throw error
    }
  }

  findOne(id: number) {
    try {
      let user = this.userRepository.findOne({
        where: {id}
      })

      if(!user) throw new NotFoundException()
      
      return user;
    } catch (error) {
      throw error
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    try {
      let user = await this.findOne(id)
      if(!user){
        throw new NotFoundException()
      }
  
      await this.userRepository.remove(user)
      const response = {
        message: `User ${user.email} deleted successfully`
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
}
