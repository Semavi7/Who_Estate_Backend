import { Exclude, Transform } from "class-transformer";
import { Role } from "src/auth/enums/role.enum";
import { Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class User {
    @ObjectIdColumn() @Transform(({ value }) => value.toString(), { toPlainOnly: true }) _id: ObjectId
    @Column() name: string
    @Column() surname: string
    @Column({ unique: true }) email: string
    @Column() image: string
    @Column() phonenumber: number
    @Exclude()@Column() password: string
    @Column({ type: 'enum', enum: Role, default: Role.Member }) roles: Role 
    @CreateDateColumn() createdAt: Date
}
