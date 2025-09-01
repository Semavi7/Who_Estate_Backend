import { Transform } from "class-transformer";
import { Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class Message {
    @ObjectIdColumn() @Transform(({ value }) => value.toString(), { toPlainOnly: true }) _id: ObjectId
    @Column() name : string
    @Column() surname: string
    @Column() email: string
    @Column() phone: number
    @Column() message: string
    @Column() isread: boolean
    @CreateDateColumn() createdAt: Date
}
