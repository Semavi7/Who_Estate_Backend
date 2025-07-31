import { Column, CreateDateColumn, Entity, Index, ObjectId, ObjectIdColumn, UpdateDateColumn } from "typeorm";

@Entity()
@Index(['category', 'value'], { unique: true })
export class FeatureOption {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    category: string

    @Column()
    value: string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
