import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { ForgotPasswordDto } from './dto/user-forgot-password-dto';

@Injectable()
export class UserService {
  constructor (
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService
  ) {}  

  private validateToken(token: string): any {
    try {
      const validToken = this.jwtService.verify(token);
      if (validToken) {
        return validToken;
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
  
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
  
      // const payload = { email: user.email, sub: user.id, date: Date.now() };
      // const token = this.jwtService.sign(payload);
  
      // let link = `https://alpha.youdoc.co/confirm-registration?token=${token}`;
  
      // await this.mailerService.sendRegistrationMail(createUserDto.email, link);
  
      const response = {
        message: `Information received, kindly complete your registration`,
        email: createUserDto.email
      };
      
      return response;
  
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('duplicate key value')) {
        throw new ConflictException('Your chosen email address is already assigned to a Youdoc practice. If you previously registered your practice on Youdoc, please proceed proceed to the login page.');
      }
      if (error instanceof ConflictException) {
        throw new ConflictException('Your chosen email address is already assigned to a Youdoc practice. If you previously registered your practice on Youdoc, please proceed proceed to the login page.');
      }
      console.log(error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async confirmRegistration(email: string, continueRegistrationDto:ContinueRegistrationDto){
    try {

      const theUser = await this.userRepository.findOne({
        where: {
          email: email
        }
      });
      
      if(!theUser) throw new NotFoundException("Can't find the user attarched with this token");

      const hashedPassword = await this.hashPassword(continueRegistrationDto.password);

      theUser.password = hashedPassword;
      await this.userRepository.save(theUser);
  
      const payload = { email: theUser.email, sub: theUser.id, date: Date.now() };
      const token = this.jwtService.sign(payload);
  
      let link = `https://alpha.youdoc.co/confirm-registration?token=${token}`;
  
      await this.mailerService.sendRegistrationMail(theUser.email, link);

      return { message: `Registration complete, an email has been sent to ${theUser.email}` };
      
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

      let link = `https://alpha.youdoc.co/confirm-registration?token=${token}`;

      await this.mailerService.sendLoginMail(email, link, user.firstName);

      return { message: "Login successful, login link has been sent to your email"};
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

  async findOne(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException("Invalid ID, it must be a number");
    }
  
    const user = await this.userRepository.findOne({ where: { id } });
  
    if (!user) {
      throw new NotFoundException("User not found");
    }
  
    return user;
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    try {

      const user = await this.userRepository.findOne({
        where: {
          email
        }
      });
      
      if(!user) {
        throw new NotFoundException("This email is not registered with us");
      };

      const payload = { email: user.email, sub: user.id, date: Date.now() };
      const token = this.jwtService.sign(payload);
  
      let link = `https://alpha.youdoc.co/forgot-password?token=${token}`;

      const username = user.firstName+" "+user.lastName
  
      await this.mailerService.sendForgotPasswordMail(email, username, link);

      return {
        message: `A reset password link has been sent to ${email}`
      }
      
    } catch (error) {
      throw error
    }
  }
  
  async newPasswordReset(token: string, continueRegistrationDto: ContinueRegistrationDto) {
    try {
      const validToken = this.validateToken(token);
      
      const presentTime = Date.now();
      const tokenTime = validToken?.date;

      let difMil = presentTime-tokenTime;
      let difTime = Math.floor(difMil/(1000*60));
      
      if(difTime > 10){
        throw new UnauthorizedException("Expired Link, please request for another one as the link expires in ten minutes");
      }

      const theUser = await this.userRepository.findOne({
        where: {
          email: validToken?.email
        }
      });
      
      if(!theUser) throw new NotFoundException("Can't find the user attarched with this token");

      const hashedPassword = await this.hashPassword(continueRegistrationDto.password);

      theUser.password = hashedPassword;
      await this.userRepository.save(theUser);

      const payload = { email: theUser.email, sub: theUser.id };
      const userToken = this.jwtService.sign(payload);

      return { message: "User password updated successfully", token: userToken };
      
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    try {
      let user = await this.findOne(id)
      if(!user){
        throw new NotFoundException();
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

  async profile(token: string) {
    try {
      const validToken = this.validateToken(token);
      
      if (!validToken || !validToken.email) {
        throw new BadRequestException("Invalid auth");
      }
      
      const user = await this.userRepository.findOne({
        where: {
          email: validToken.email,
        },
      });
  
      if (!user) {
        throw new NotFoundException();
      }
  
      const { password, ...other } = user;
      const response = {
        message: "This are user informations",
        data: other
      };
      return response;
    } catch (error) {
      throw error;
    }
  }
  
}
