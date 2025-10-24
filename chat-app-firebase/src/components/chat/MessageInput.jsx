import { useState, useRef } from 'react';
import { Send, Smile } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import Button from '../common/Button';

const MessageInput = ({ mode }) => {
  const { sendPublicMessage, sendPrivateMessage } = useChat();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || sending) return;

    setSending(true);
    
    const result = mode === 'public' 
      ? await sendPublicMessage(message)
      : await sendPrivateMessage(message);

    if (result.success) {
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
    
    setSending(false);
  };

  const handleKeyPress = (e) => {
    // Envoyer avec Entrée, nouvelle ligne avec Shift+Entrée
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white p-4">
      <div className="flex gap-2 items-end">
        {/* Emoji button (optionnel) */}
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          title="Emojis (à venir)"
        >
          <Smile size={24} />
        </button>

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            disabled={sending}
            rows={1}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32 disabled:bg-gray-100"
            style={{ minHeight: '42px' }}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {message.length}/1000
          </div>
        </div>

        {/* Send button */}
        <Button
          type="submit"
          disabled={!message.trim() || sending}
          loading={sending}
          icon={Send}
          className="shrink-0"
        >
          Envoyer
        </Button>
      </div>

      {/* Hint */}
      <p className="text-xs text-gray-500 mt-2 text-center">
        Appuyez sur <kbd className="px-1 py-0.5 bg-gray-100 border rounded text-xs">Entrée</kbd> pour envoyer, 
        <kbd className="px-1 py-0.5 bg-gray-100 border rounded text-xs ml-1">Shift + Entrée</kbd> pour une nouvelle ligne
      </p>
    </form>
  );
};

export default MessageInput;