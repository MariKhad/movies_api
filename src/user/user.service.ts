import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { AuthService } from 'src/auth/auth.service';
import { SEPARATOR } from 'const';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return new this.userModel(createUserDto).save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async countAll(): Promise<number> {
    return await this.userModel.find().countDocuments();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email });
    if (user) {
      return user;
    }
  }

  async getFromAuthorizationHeader(
    authorizationHeader: string | undefined,
  ): Promise<User | undefined> {
    if (authorizationHeader) {
      const token = authorizationHeader.split(SEPARATOR)[1];
      const payload = await this.jwtService.decode(token);
      /*       const payload =
        await this.authService.getPayloadFromAuthorizationHeader(
          authorizationHeader,
        ); */
      const user = await this.findOne(payload?.id);
      return user;
    }
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error(`User with ${id} not found`);
    }
    return user;
  }

  async findCopiedPlaylists(id: string): Promise<string> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error(`User with ${id} not found`);
    }
    return user.playlists.toString();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error(`User with ${id} not found`);
    }
    user?.set(updateUserDto);
    return user?.save();
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new Error(`User with ${id} not found`);
    }
    return user;
  }

  async addPlaylist(userId: string, playlistId: string) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: { playlists: playlistId },
      },
      { new: true },
    );
  }

  async removePlaylist(userId: string, playlistId: string) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      {
        $pull: { playlists: playlistId },
      },
      { new: true },
    );
  }
}

/*    {
        "username": "Vida_Macejkovic60",
        "email": "Rod2@yahoo.com",
        "roles": [ "user" ],
        "password": "c5R_oH8qVfUBH8M"
      }

      {
        "username": "Richmond53",
        "email": "Melvin.Kreiger@hotmail.com",
        "roles": [ "user" ],
        "password": "NN1E7uUkTVOz990"
      }

       {
        "username": "Beth_Rice",
        "email": "Landen.OConnell@gmail.com",
        "roles": [ "user" ],
        "password": "niLzOgd18G2vsxP"        
      } */
