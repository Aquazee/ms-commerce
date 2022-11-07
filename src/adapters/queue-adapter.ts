import amqp from 'amqplib/callback_api';
import BaseApi from '../components/BaseApi';
import logger from '../lib/logger';
import Messages from '../lib/messages';

const scope = `QueueAdapter#${1.0}`;

export default class QueueAdapter extends BaseApi {
  private _ch: any;

  private _queueServiceConfig = this.config.infrastructure.queue_service;

  constructor() {
    super();
    this.init();
  }

  init() {
    const { auth, host, channel, port } =
      this._queueServiceConfig[this._queueServiceConfig.enabled];
    const CONN_URL = `${this._queueServiceConfig.enabled}://${auth.user}:${auth.pass}@${host}:${port}/${channel}`;
    amqp.connect(CONN_URL, (err, conn) => {
      conn.createChannel((err, channel) => {
        if (err) {
          logger.error(Messages.RabbitMqChannelClosed);
        }
        this._ch = channel;
      });
    });
  }

  public publishToQueue = async (queueName: string, data: any) => {
    this._ch.sendToQueue(queueName, Buffer.from(data));
  };

  public closeQueueService = () => {
    const method = 'closeQueueService';
    this._ch.close();
    logger.info(scope, method, Messages.RabbitMqChannelClosed);
  };

  register() {
    throw new Error('Method not implemented.');
  }
}
