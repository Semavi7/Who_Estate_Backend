import { Transform } from 'class-transformer'
import { ObjectId } from 'typeorm'

export class LoginResponseDto {
  access_token: string
  email: string
  name: string
  surname: string

  @Transform(({ value }) => value.toString(), { toPlainOnly: true }) _id: ObjectId
}