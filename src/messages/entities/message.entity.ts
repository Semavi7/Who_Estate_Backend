import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class Message {
    @ObjectIdColumn() _id: ObjectId
    @Column() title : string
    @Column() email: string
    @Column() description: string
}
