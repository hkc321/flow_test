import { PrimaryGeneratedColumn, Entity, Column } from 'typeorm';

@Entity('extension')
export class ExtensionEntity {
  @PrimaryGeneratedColumn({ name: 'extension_id' })
  extensionId: number;

  @Column()
  type: string;

  @Column()
  name: string;

  @Column({ name: 'is_deleted' }) // 1 is deleted 0 is not
  isDeleted: number;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: true })
  deletedAt: Date;
}
