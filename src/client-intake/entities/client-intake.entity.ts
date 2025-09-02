import { Transform } from "class-transformer";
import { Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class ClientIntake {
    @ObjectIdColumn() @Transform(({ value }) => value.toString(), { toPlainOnly: true }) _id: ObjectId
    @Column() namesurname : string
    @Column() phone: number
    @Column() description: string
    @CreateDateColumn() createdAt: Date
}
