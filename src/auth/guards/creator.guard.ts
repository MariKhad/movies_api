import {
  Injectable,
  ExecutionContext,
  NotFoundException,
  CanActivate,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { PlaylistService } from 'src/playlist/playlist.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { IS_CREATOR } from 'src/decorators/is-creator.decorator';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './jwt.guard';

@Injectable()
export class IsCreatorGuard extends AuthGuard('jwt') {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private reflector: Reflector,
    private authService: AuthService,
    private playlistService: PlaylistService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true;
    }
    const isCreator = this.reflector.get(IS_CREATOR, context.getHandler());
    if (isCreator) {
      const request = context.switchToHttp().getRequest();
      const playlistId = request.params.id;
      const authorizationHeader = request.headers.authorization;
      const playlist = await this.playlistService.findOne(playlistId);
      const payload =
        await this.authService.getPayloadFromAuthorizationHeader(
          authorizationHeader,
        );
      if (playlist) {
        console.log('Гвард работает!!!');
        return playlist.createdBy.toString() === payload.id;
      } else throw new NotFoundException();
    }
    return super.canActivate(context) as boolean;
  }
}
