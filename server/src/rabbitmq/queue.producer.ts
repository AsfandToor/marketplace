import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;
  constructor() {
    const connection = amqp.connect([process.env.RABBITMQ_URL]);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('listingQueue', { durable: true });
      },
    });
  }

  async addToListingQueue(listing: any) {
    try {
      await this.channelWrapper.sendToQueue(
        'listingQueue',
        Buffer.from(JSON.stringify(listing)),
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          persistent: true,
        },
      );
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error adding listing to queue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
