import { Transform } from "class-transformer";
import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class TrackView {
    @ObjectIdColumn() @Transform(({ value }) => value.toString(), { toPlainOnly: true }) _id: ObjectId
    @Column() date: string
    @Column() views: number
}
