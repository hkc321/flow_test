import { IsString, IsNotEmpty } from 'class-validator';

export class CreateExtensionDto {
  @IsString({ message: 'type 값은 string으로 전송해야 합니다.' })
  @IsNotEmpty({ message: 'type 값이 비어있습니다.' })
  readonly type: string;
  @IsString({ message: 'name 값은 string으로 전송해야 합니다.' })
  @IsNotEmpty({ message: 'name 값이 비어있습니다.' })
  readonly name: string;
}
