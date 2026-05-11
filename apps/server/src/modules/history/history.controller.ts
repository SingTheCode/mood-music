import { Controller, Get, Post, Body } from "@nestjs/common";
import { HistoryService } from "./history.service";

@Controller("history")
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  findAll() {
    return this.historyService.findAll();
  }

  @Post()
  create(@Body() body: { keywords: string[]; playlistId: string }) {
    return this.historyService.create(body.keywords, body.playlistId);
  }
}
