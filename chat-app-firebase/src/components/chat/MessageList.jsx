import { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MessageItem from './MessageItem';

const MessageList = ({ messages, mode }) => {
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">Aucun message</p>
          <p className="text-sm">
            {mode === 'public' 
              ? 'Soyez le premier à envoyer un message !' 
              : 'Commencez la conversation !'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          isOwn={message.senderId === currentUser?.uid}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;