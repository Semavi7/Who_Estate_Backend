import { Transform } from "class-transformer";
import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class Message {
    @ObjectIdColumn() @Transform(({ value }) => value.toString(), { toPlainOnly: true }) _id: ObjectId
    @Column() title : string
    @Column() email: string
    @Column() description: string
}
