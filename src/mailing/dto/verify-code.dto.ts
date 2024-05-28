import { GenerateCodeDto } from './generate-code.dto';

export interface VerifyCodeDto extends GenerateCodeDto {
  code: number;
}
