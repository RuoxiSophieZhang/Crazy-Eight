import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Suit } from '../types';
import { getSuitSymbol, getSuitColor } from '../utils/gameLogic';

interface SuitPickerProps {
  onSelect: (suit: Suit) => void;
}

export const SuitPicker: React.FC<SuitPickerProps> = ({ onSelect }) => {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
      >
        <h2 className="text-2xl font-bold mb-2 text-slate-800">万能 8 点！</h2>
        <p className="text-slate-500 mb-8">请选择一个新的花色：</p>
        
        <div className="grid grid-cols-2 gap-4">
          {suits.map((suit) => (
            <button
              key={suit}
              onClick={() => onSelect(suit)}
              className={`
                flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-slate-100 
                hover:border-blue-500 hover:bg-blue-50 transition-all group
              `}
            >
              <span className={`text-5xl mb-2 ${getSuitColor(suit)} group-hover:scale-110 transition-transform`}>
                {getSuitSymbol(suit)}
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-600">
                {suit === 'hearts' ? '红心' : suit === 'diamonds' ? '方块' : suit === 'clubs' ? '梅花' : '黑桃'}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
