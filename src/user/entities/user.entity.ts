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

  @Column({ type: 'text', nullable: true })
  address2: string;

  @Column({ type: 'text', nullable: true })
  city: string;

  @Column({ type: 'text', nullable: true })
  state: string;

  @Column({ type: 'text', nullable: true, default: "Nigeria" })
  country: string;

  @Column({ type: 'text', nullable: true })
  ZIP: string;

  @Column()
  sex: "Male" | "Female";

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
