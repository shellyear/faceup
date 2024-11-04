import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { File } from "./file";

@Entity()
export class Report extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column()
  senderName: string;

  @Column()
  senderAge: number;

  @Column()
  description: string;

  @OneToMany(() => File, (file) => file.report, { cascade: true })
  files: File[];
}
