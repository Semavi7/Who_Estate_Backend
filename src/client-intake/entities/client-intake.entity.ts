import { Transform } from "class-transformer";
import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class ClientIntake {
    @ObjectIdColumn() @Transform(({ value }) => value.toString(), { toPlainOnly: true }) _id: ObjectId
    @Column() namesurname : string
    @Column() phone: number
    @Column() description: string
}
