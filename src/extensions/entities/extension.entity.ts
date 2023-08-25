import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('extension')
export class ExtensionEntity {
  @PrimaryColumn()
  name: string;

  @Column()
  type: string;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
