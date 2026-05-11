import { IsArray, IsString, ArrayMinSize, ArrayMaxSize } from "class-validator";

export class ExpandKeywordsDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(4)
  keywords!: string[];
}
