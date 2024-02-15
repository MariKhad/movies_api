import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { PlaylistDocument } from 'src/schemas/playlist.schema';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/enums/role.enum';
import { AuthDto } from './dto/auth.dto';
import { RolePermissions } from 'src/enums/rolePermissions.enum';
import { Payload, SEPARATOR } from 'const';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  generateToken(id: string, email: string, roles: Role[]) {
    const secret = this.configService.get('JWT_SECRET');
    return this.jwtService.sign({ id, email, roles }, { secret });
  }

  async isAdmin(id: string) {
    const user = await this.userService.findOne(id);
    return user.roles.includes(Role.Admin);
  }

  async isCreator(user: UserDocument, playlist: PlaylistDocument) {
    const userId = user._id.toString();
    const playlistId = playlist.createdBy.toString();
    return userId === playlistId;
  }

  async createLink(email: string): Promise<string> {
    const user = (await this.userService.findByEmail(email)) as UserDocument;
    const clientUrl = this.configService.get('CLIENT_URL');
    const userId = user._id.toString();
    const userRoles = user.roles;
    const token = this.generateToken(userId, email, userRoles);
    const link = `${clientUrl}/auth/${token}`;
    const html = `<p><a href=${link}>Войти в аккаунт</a> ссылка: ${link}</p>`;
    return html;
  }

  async isTokenValid(
    authorizationHeader: string | undefined,
  ): Promise<boolean> {
    if (authorizationHeader) {
      const user =
        await this.userService.getFromAuthorizationHeader(authorizationHeader);
      return !!user;
    } else {
      return false;
    }
  }

  async login(authDto: AuthDto) {
    const { email, password } = authDto;
    const user = (await this.userService.findByEmail(email)) as UserDocument;
    if (!user) {
      throw new NotFoundException();
    }
    if (password === user.password) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }

  can(user: UserDocument, permission: string): boolean {
    const userPermissions = RolePermissions[user.roles[0]] as Array<string>;
    return userPermissions.includes(permission);
  }

  async getPayloadFromAuthorizationHeader(
    authorizationHeader: string,
  ): Promise<Payload> {
    const token = authorizationHeader.split(SEPARATOR)[1];
    const payload = await this.jwtService.decode(token);
    return payload;
  }
  /*   can(user: UserDocument, permission: string): boolean {
    let permissions: Permissions[] = [];
    for(let i=0; i < user.roles.length; i++){
      permissions = [...permissions, RolePermissions[user.roles[i]]]
    }
      return permissions.includes(permission);
    };
  } */
}
