import { Injectable, OnModuleInit } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  constructor() {
    const connection = amqp.connect([process.env.RABBITMQ_URL]);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue('listingQueue', { durable: true });
        await channel.consume('listingQueue', async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());
            console.log(content);
            // Notify the Approver Here
            channel.ack(message);
          }
        });
      });
      console.log('Consumer service started and listening for messages.');
    } catch (err) {
      console.error('Error starting the consumer:', err);
    }
  }
}
