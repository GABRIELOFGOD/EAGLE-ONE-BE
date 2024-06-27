import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column()
  sex: "MALE" | "FEMALE";

  @Column({ type: 'date' })
  dob: Date;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'boolean', default: false })
  blocked: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

}
