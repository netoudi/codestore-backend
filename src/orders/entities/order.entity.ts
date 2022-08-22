import { v4 as uuidv4 } from 'uuid';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { CreditCard } from './credit-card.embbeded';

export enum OrderStatus {
  APPROVED = 'approved',
  PENDING = 'pending',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  total: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column(() => CreditCard, { prefix: '' })
  credit_card: CreditCard;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @Column()
  status: OrderStatus = OrderStatus.PENDING;

  @BeforeInsert()
  beforeInsertActions() {
    this.generateId();
    this.calculateTotal();
  }

  generateId() {
    if (this.id) return;
    this.id = uuidv4();
  }

  calculateTotal() {
    return (this.total = this.items.reduce((sum: number, item: OrderItem) => {
      return sum + item.quantity * item.price;
    }, 0));
  }
}
