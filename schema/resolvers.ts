import { DateTimeResolver, URLResolver } from 'graphql-scalars';
import { Message, chats, messages } from '../db';
import { Resolvers } from '../types/graphql';

const resolvers: Resolvers = {
  Date: DateTimeResolver,
  URL: URLResolver,
  Chat: {
    lastMessage(chat) {
      const lastMessageId = chat.messages[chat.messages.length - 1];

      return messages.find((m) => m.id === lastMessageId) || null;
    },
    messages(chat) {
      return messages.filter((m) => chat.messages.includes(m.id));
    },
  },

  Query: {
    chats() {
      return chats;
    },
    chat(root, { chatId }) {
      return chats.find((c) => c.id === chatId) || null;
    },
  },

  Mutation: {
    addMessage(root: any, { chatId, content }: any) {
      const chatIndex = chats.findIndex((c) => c.id === chatId);

      if (chatIndex === -1) return null;

      const chat = chats[chatIndex];

      const messagesIds = messages.map((currentMessage) =>
        Number(currentMessage.id)
      );
      const messageId = String(Math.max(...messagesIds) + 1);
      const message = {
        id: messageId,
        createdAt: new Date(),
        content,
      };

      messages.push(message);
      chat.messages.push(messageId);
      // The chat will appear at the top of the ChatsList component
      chats.splice(chatIndex, 1);
      chats.unshift(chat);

      return message;
    },
  },
};

export default resolvers;
