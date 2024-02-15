import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DirectorModule } from './director/director.module';
import { UserModule } from './user/user.module';
import { GenreModule } from './genre/genre.module';
import { AuthModule } from './auth/auth.module';
import { DB_CONNECTION_URL } from 'config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { PlaylistModule } from './playlist/playlist.module';
import { ReportsModule } from './reports/reports.module';
import { MailModule } from './mail/mail.module';
import { MovieService } from './movie/movie.service';
import { Movie, MovieSchema } from './schemas/movie.schema';

const globalGuard = {
  provide: APP_GUARD,
  useClass: JwtGuard,
};

@Module({
  imports: [
    MongooseModule.forRoot(DB_CONNECTION_URL),
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MovieModule,
    DirectorModule,
    UserModule,
    GenreModule,
    AuthModule,
    PlaylistModule,
    ReportsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, globalGuard, MovieService],
})
export class AppModule {}
