import { Request, Response } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Headers,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../decorators/public.decorator';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserDocument } from 'src/schemas/user.schema';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { FORMATS, Filter } from '../../const';
import * as csv from '@fast-csv/format';
import * as fs from 'fs';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'Create a new user' })
  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = (await this.userService.create(createUserDto)) as UserDocument;
    const token = this.authService.generateToken(
      String(user._id),
      createUserDto.email,
      user.roles,
    );
    return token;
  }

  @ApiOperation({ summary: 'Show all users' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({
    summary: 'Get file with all users exported',
  })
  @Public()
  @Get('export')
  //TODO 2 different routes
  async exportData(@Res() res: Response, @Query() filter: Filter) {
    const users = await this.userService.findAll();
    if (filter.format === FORMATS.CSV) {
      const fileName = 'users.csv';
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.setHeader('Content-Type', 'text/csv');
      const csvStream = csv.format({ headers: true, delimiter: ';' });
      csvStream.pipe(res);
      users.forEach((user) => {
        const jsonString = JSON.stringify(user);
        csvStream.write(JSON.parse(jsonString));
      });
      csvStream.end();
    }
    if (filter.format === FORMATS.JSON || filter.format === undefined) {
      const dataString = JSON.stringify(users);
      const fileName = 'users.json';
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.setHeader('Content-Type', 'application/json');
      res.send(dataString);
    }
  }

  @ApiOperation({ summary: 'Show total amount of users' })
  @Public()
  @Get('count')
  async countAll() {
    return {
      collection: 'users',
      count: await this.userService.countAll(),
    };
  }

  @ApiOperation({ summary: 'Show user info' })
  @ApiBearerAuth()
  @Get('/me')
  me(
    @Req() req: Request,
    @Headers('Authorization') authorizationHeader: string, //Add for Swagger
  ) {
    const { user } = req;
    return user;
  }

  @ApiOperation({ summary: 'Show user by id' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @ApiOperation({ summary: "Update user, that's is found by id" })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: "Delete user, that's is found by id" })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    return this.userService.remove(id);
  }
}
