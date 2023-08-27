import { PrimaryGeneratedColumn, Entity, Column, Index } from 'typeorm';

@Entity('extension')
@Index(['type', 'name'])
export class ExtensionEntity {
  @PrimaryGeneratedColumn({ name: 'extension_id' })
  extensionId: number;

  @Column({ unique: true })
  name: string;

  @Column()
  type: string;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
