import {
  MAX_MESSAGES,
  MAX_MESSAGE_CATEGORIES
} from '../constants.mjs';

export default
class Messages {
  queue = [];

  messageCount = new Array(MAX_MESSAGE_CATEGORIES);

  messageDelay = new Array(MAX_MESSAGE_CATEGORIES);

  notifications = { 
    pop500: 0,
    pop1000: 0,
    pop2000: 0,
    pop3000: 0, 
    pop5000: 0,
    pop10000: 0,
    pop15000: 0,
    pop20000: 0,
    pop25000: 0
  };
  
  restore(stream) {
    const messageStream = stream.getCompressedStream();

    // messages from your scribes, 1000 x 16 bytes
    for (let i = 0; i < MAX_MESSAGES; i++) {
      const message = {};
      message.param1 = messageStream.readInt();
      message.year = messageStream.readShort();
      message.param2 = messageStream.readShort();
      message.messageType = messageStream.readShort();
      message.sequence = messageStream.readShort();
      message.isReaded = messageStream.readByte();
      message.month = messageStream.readByte();
      messageStream.readShort(); // skip
      
      this.queue.push(message);
    }
    
    this.nextMessageSequence = stream.readInt();
    this.totalMessages = stream.readInt();
    this.currentMessageId = stream.readInt();

    // population
    stream.readByte(); // skip
    this.notifications.pop500 = stream.readByte();
    this.notifications.pop1000 = stream.readByte();
    this.notifications.pop2000 = stream.readByte();
    this.notifications.pop3000 = stream.readByte();
    this.notifications.pop5000 = stream.readByte();
    this.notifications.pop10000 = stream.readByte();
    this.notifications.pop15000 = stream.readByte();
    this.notifications.pop20000 = stream.readByte();
    this.notifications.pop25000 = stream.readByte();

    for (let i = 0; i < MAX_MESSAGE_CATEGORIES; i++) {
      this.messageCount[i] = stream.readInt();
    }
    for (let i = 0; i < MAX_MESSAGE_CATEGORIES; i++) {
      this.messageDelay[i] = stream.readInt();
    }
  }
}
