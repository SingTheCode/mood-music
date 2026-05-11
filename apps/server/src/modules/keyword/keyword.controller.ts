import { Controller, Post, Body } from "@nestjs/common";
import { KeywordService } from "./keyword.service";
import { ExpandKeywordsDto } from "./dto/expand-keywords.dto";

@Controller("keywords")
export class KeywordController {
  constructor(private readonly keywordService: KeywordService) {}

  @Post("expand")
  expand(@Body() dto: ExpandKeywordsDto) {
    return this.keywordService.expandKeywords(dto.keywords);
  }
}
