import React from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import Image from 'next/image';
import ChatBotIcon from '@/components/ui/ChatBotIcon';

interface ChatBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatBotModal: React.FC<ChatBotModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute bottom-24 right-4 w-[340px] bg-[#f4f4f5] rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-[#f4f4f5]">
        <div className="flex items-center gap-2">
          <div className="bg-[#2563EB] w-8 h-8 rounded-full flex items-center justify-center">
             {/* Approximate icon for W with chat tail */}
           <ChatBotIcon/>
          </div>
          <h3 className="font-bold text-gray-800 text-lg">WLMD Assistant</h3>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition">
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 h-[320px] overflow-y-auto bg-[#f8f8f9]">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-[#2563EB] w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <ChatBotIcon width={20} height={20}/>
          </div>
          <div className="text-gray-700 text-[15px] leading-relaxed">
            <span className="font-semibold block mb-1">Ask me!</span>
            Here are some results of available, along with their model, year, and approximate price:
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-[#f8f8f9]">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Ask for information" 
            className="w-full bg-[#e4e4e7] text-gray-700 rounded-xl pl-4 pr-12 py-3.5 outline-none focus:ring-2 focus:ring-[#2563EB] placeholder-gray-400 text-sm"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2563EB] hover:text-blue-700 transition">
            <Send size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBotModal;
