import { Request } from 'express';
import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { UserService } from '../user/user.service';
import { Public } from '../decorators/public.decorator';
import { UserDocument } from '../schemas/user.schema';
import { PlaylistDocument } from '../schemas/playlist.schema';
import { JwtService } from '@nestjs/jwt';
import { SEPARATOR } from '../../const';
import { NotAcceptableException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { isCreator } from '../decorators/is-creator.decorator';
import { IsCreatorGuard } from '../auth/guards/creator.guard';

@ApiTags('Playlists')
@Controller('playlists')
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
    private userService: UserService,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Create a new playlist' })
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() createPlaylistDto: CreatePlaylistDto,
    @Req() req: Request,
  ) {
    const user = req.user as UserDocument;
    const userId = String(user._id);
    createPlaylistDto.createdBy = userId;
    const playlist = (await this.playlistService.create(
      createPlaylistDto,
    )) as PlaylistDocument;
    return playlist;
  }

  @ApiOperation({ summary: 'Copy playlist to users favorites' })
  @ApiBearerAuth()
  @Post(':id/copy')
  async copy(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as UserDocument;
    const userId = String(user._id);
    const playlist = (await this.playlistService.findOne(
      id,
    )) as PlaylistDocument;
    const copyNotAllowed =
      playlist?.isPublic !== true ||
      (await this.authService.isCreator(user, playlist));
    if (copyNotAllowed) {
      throw new NotAcceptableException();
    } else {
      await this.playlistService.incrementCopyCount(id, 1);
      return await this.userService.addPlaylist(userId, id);
    }
  }

  @ApiOperation({ summary: 'Delete playlist from users favorites' })
  @ApiBearerAuth()
  @Delete(':id/copy')
  async deleteCopy(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as UserDocument;
    const userId = String(user._id);
    await this.playlistService.incrementCopyCount(id, -1);
    return await this.userService.removePlaylist(userId, id);
  }

  @ApiOperation({ summary: 'Show all public playlists' })
  @Public()
  @Get()
  async findAll() {
    return this.playlistService.findAllPublic();
  }

  @ApiOperation({ summary: 'Find Top 50 of playlists' })
  @Public()
  @Get('top50')
  async findTop50() {
    return this.playlistService.findTop50();
  }

  @ApiOperation({ summary: 'Show total amount of playlists' })
  @Public()
  @Get('count')
  async countAll() {
    return {
      collection: 'playlists',
      count: await this.playlistService.countAll(),
    };
  }

  @ApiOperation({ summary: 'Show all playlists of the user' })
  @ApiBearerAuth()
  @Get('my')
  async findAllMine(
    @Headers('Authorization') authorizationHeader: string,
    @Req() req: Request,
  ) {
    const user = req.user as UserDocument;
    const userId = String(user._id);
    const createdPlaylists =
      await this.playlistService.findUserPlaylists(userId);
    const copiedPlaylists = await this.userService.findCopiedPlaylists(userId);
    return {
      Created: createdPlaylists.split(','),
      Copied: copiedPlaylists.split(','),
    };
  }

  @Public()
  @ApiOperation({ summary: "Show playlist by Id, if it's public" })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    const token = authorizationHeader?.split(SEPARATOR)[1];
    const payload = await this.jwtService.decode(token);
    const user = await this.userService.findByEmail(payload?.email);
    if (!user) {
      throw new NotAcceptableException();
    }
    const playlist = (await this.playlistService.findOne(
      id,
    )) as PlaylistDocument;

    const canBeShown =
      playlist.isPublic === true ||
      (await this.authService.isCreator(user as UserDocument, playlist));
    if (canBeShown) {
      return playlist;
    } else {
      throw new NotAcceptableException();
    }
  }

  @ApiOperation({
    summary:
      "Update playlist, that's is found by id, only owner of playlist has access",
  })
  @ApiBearerAuth()
  @Patch(':id')
  @isCreator()
  async update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
    @Headers('Authorization') authorizationHeader: string,
    @Req() req: Request,
  ) {
    /*     const user = req.user as UserDocument;
    const playlist = (await this.playlistService.findOne(
      id,
    )) as PlaylistDocument;
    if (await this.authService.isCreator(user, playlist)) { */
    return this.playlistService.update(id, updatePlaylistDto);
    /*     } else {
      throw new NotAcceptableException();
    } */
  }

  @ApiOperation({
    summary: 'Add movie to playlist, only owner of playlist has access',
  })
  @ApiBearerAuth()
  @Patch(':playlistId/movies/:movieId')
  async updateMovie(
    @Param('playlistId') playlistId: string,
    @Param('movieId') movieId: string,
    @Headers('Authorization') authorizationHeader: string,
    @Req() req: Request,
  ) {
    const user = req.user as UserDocument;
    const playlist = (await this.playlistService.findOne(
      playlistId,
    )) as PlaylistDocument;
    if (await this.authService.isCreator(user, playlist)) {
      return this.playlistService.addMovie(playlistId, movieId);
    } else {
      throw new NotAcceptableException();
    }
  }

  @ApiOperation({
    summary:
      "Delete playlist, that's is found by id, only owner of playlist has access",
  })
  @ApiBearerAuth()
  @Delete(':id')
  @isCreator()
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authorizationHeader: string,
    @Req() req: Request,
  ) {
    const user = req.user as UserDocument;
    const playlist = (await this.playlistService.findOne(
      id,
    )) as PlaylistDocument;
    if (await this.authService.isCreator(user, playlist)) {
      return this.playlistService.remove(id);
    } else {
      throw new NotAcceptableException();
    }
  }

  @ApiOperation({
    summary: 'Delete movie from playlist, only owner of playlist has access',
  })
  @ApiBearerAuth()
  @Delete(':playlistId/movies/:movieId')
  async removeMovie(
    @Param('playlistId') playlistId: string,
    @Param('movieId') movieId: string,
    @Headers('Authorization') authorizationHeader: string,
    @Req() req: Request,
  ) {
    const user = req.user as UserDocument;
    const playlist = (await this.playlistService.findOne(
      playlistId,
    )) as PlaylistDocument;
    if (await this.authService.isCreator(user, playlist)) {
      return this.playlistService.removeMovie(playlistId, movieId);
    } else {
      throw new NotAcceptableException();
    }
  }
}
// await this.userService.addPlaylist(userId, String(playlist._id));

/*  const userPlaylists = arrayToStringItems(user.playlists).filter(
      (listId) => listId !== id,
    );
    await this.userService.update(userId, {
      playlists: [...userPlaylists],
    }); */
/* {
    "title": "My Favorites 4",
        ,
    "user": "65708359cfdc9f0459a9337a",
    "isPublic": true
} */
