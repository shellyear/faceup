import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { Report } from "./report";

@Entity()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Report, (report) => report.files, { onDelete: "CASCADE" })
  report: Report;

  @Column("bytea")
  content: Buffer;

  @Column()
  fileName: string;

  @Column()
  fileType: string;
}
