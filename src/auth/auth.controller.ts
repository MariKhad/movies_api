import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from '../decorators/public.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SUBJECT } from '../../const';
import { MailService } from 'src/mail/mail.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() authDto: AuthDto) {
    const user = await this.authService.login(authDto);
    const token = this.authService.generateToken(
      user._id.toString(),
      user.email,
      user.roles,
    );
    return token;
  }

  @ApiOperation({ summary: 'Get new token' })
  @Public()
  @Post('link')
  async sendToken(@Body() authDto: AuthDto) {
    const email = authDto.email;
    const html = await this.authService.createLink(email);
    const subject = SUBJECT;
    const result = this.mailService.sendMessage({ email, html, subject });
    return result;
  }
}
