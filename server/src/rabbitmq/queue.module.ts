import { Module } from '@nestjs/common';
import { ConsumerService } from './queue.consumer';
import { ProducerService } from './queue.producer';

@Module({
  providers: [ProducerService, ConsumerService],
  exports: [ProducerService],
})
export class QueueModule {}
