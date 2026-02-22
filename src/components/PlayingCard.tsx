import React from 'react';
import { motion } from 'motion/react';
import { Card } from '../types';
import { getSuitSymbol, getSuitColor } from '../utils/gameLogic';

interface PlayingCardProps {
  card: Card;
  isFaceUp?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
}

export const PlayingCard: React.FC<PlayingCardProps> = ({
  card,
  isFaceUp = true,
  onClick,
  isPlayable = false,
  className = '',
}) => {
  if (!isFaceUp) {
    return (
      <motion.div
        whileHover={onClick ? { y: -10 } : {}}
        onClick={onClick}
        className={`w-16 h-24 sm:w-24 sm:h-36 bg-blue-800 rounded-lg border-2 border-white shadow-lg flex items-center justify-center relative overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="w-10 h-16 sm:w-16 sm:h-24 border border-white/30 rounded flex items-center justify-center">
          <div className="text-white/20 text-4xl font-bold">8</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={card.id}
      whileHover={isPlayable ? { y: -20, scale: 1.05 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={`
        w-16 h-24 sm:w-24 sm:h-36 bg-white rounded-lg border border-slate-200 shadow-md flex flex-col p-1 sm:p-2 relative cursor-pointer
        ${isPlayable ? 'ring-2 ring-yellow-400 shadow-xl' : 'opacity-90'}
        ${className}
      `}
    >
      <div className={`flex flex-col items-start leading-none ${getSuitColor(card.suit)}`}>
        <span className="text-sm sm:text-lg font-bold">{card.rank}</span>
        <span className="text-xs sm:text-sm">{getSuitSymbol(card.suit)}</span>
      </div>
      
      <div className={`flex-grow flex items-center justify-center ${getSuitColor(card.suit)}`}>
        <span className="text-2xl sm:text-4xl">{getSuitSymbol(card.suit)}</span>
      </div>

      <div className={`flex flex-col items-end leading-none rotate-180 ${getSuitColor(card.suit)}`}>
        <span className="text-sm sm:text-lg font-bold">{card.rank}</span>
        <span className="text-xs sm:text-sm">{getSuitSymbol(card.suit)}</span>
      </div>
    </motion.div>
  );
};
