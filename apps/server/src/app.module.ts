import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { KeywordModule } from "./modules/keyword/keyword.module";
import { YoutubeModule } from "./modules/youtube/youtube.module";
import { HistoryModule } from "./modules/history/history.module";
import configuration from "./config/configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    KeywordModule,
    YoutubeModule,
    HistoryModule,
  ],
})
export class AppModule {}
