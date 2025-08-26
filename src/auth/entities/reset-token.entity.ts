import { Transform } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { Entity, Column, Index, ObjectIdColumn } from 'typeorm';

@Entity()
export class ResetToken {
    @ObjectIdColumn() @Transform(({ value }) => value.toString(), { toPlainOnly: true }) _id: ObjectId

    @Index({ unique: true })
    @Column()
    tokenHash: string;

    @Column()
    userId: string;

    @Column()
    expires: Date;

    @Column({ nullable: true })
    usedAt?: Date;
}