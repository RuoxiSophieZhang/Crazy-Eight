import React from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw } from 'lucide-react';

interface GameOverProps {
  winner: 'player' | 'ai';
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ winner, onRestart }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-3xl p-10 max-w-sm w-full shadow-2xl text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className={`p-4 rounded-full ${winner === 'player' ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-600'}`}>
            <Trophy size={48} />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-2 text-slate-800">
          {winner === 'player' ? '恭喜获胜！' : '遗憾落败'}
        </h2>
        <p className="text-slate-500 mb-8">
          {winner === 'player' ? '你成功清空了所有手牌。' : 'AI 率先清空了手牌。'}
        </p>
        
        <button
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-colors shadow-lg shadow-blue-200"
        >
          <RotateCcw size={20} />
          再玩一局
        </button>
      </motion.div>
    </div>
  );
};
