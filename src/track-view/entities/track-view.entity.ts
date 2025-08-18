import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class TrackView {
    @ObjectIdColumn() _id: ObjectId
    @Column() date: string
    @Column() views: number
}
