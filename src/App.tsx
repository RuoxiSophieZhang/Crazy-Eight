/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { PlayingCard } from './components/PlayingCard';
import { SuitPicker } from './components/SuitPicker';
import { GameOver } from './components/GameOver';
import { Card, Suit, GameState, Rank } from './types';
import { createDeck, canPlayCard, getSuitSymbol, getSuitColor } from './utils/gameLogic';
import { Info, HelpCircle } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showRules, setShowRules] = useState(false);

  const initGame = useCallback(() => {
    const deck = createDeck();
    const playerHand = deck.splice(0, 8);
    const aiHand = deck.splice(0, 8);
    
    // Find a starting card that isn't an 8
    let firstCardIndex = 0;
    while (deck[firstCardIndex].rank === '8') {
      firstCardIndex++;
    }
    const discardPile = [deck.splice(firstCardIndex, 1)[0]];

    setGameState({
      deck,
      playerHand,
      aiHand,
      discardPile,
      currentSuit: discardPile[0].suit,
      currentRank: discardPile[0].rank,
      turn: 'player',
      status: 'playing',
      lastAction: '游戏开始！你的回合。',
    });
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleDrawCard = () => {
    if (!gameState || gameState.turn !== 'player' || gameState.status !== 'playing') return;

    const { deck, playerHand, discardPile } = gameState;
    
    if (deck.length === 0) {
      setGameState(prev => prev ? {
        ...prev,
        turn: 'ai',
        lastAction: '摸牌堆已空，跳过回合。'
      } : null);
      return;
    }

    const newDeck = [...deck];
    const drawnCard = newDeck.pop()!;
    
    setGameState(prev => prev ? {
      ...prev,
      deck: newDeck,
      playerHand: [...playerHand, drawnCard],
      turn: 'ai',
      lastAction: `你摸了一张牌：${drawnCard.rank}${getSuitSymbol(drawnCard.suit)}`
    } : null);
  };

  const handlePlayCard = (card: Card) => {
    if (!gameState || gameState.turn !== 'player' || gameState.status !== 'playing') return;

    if (!canPlayCard(card, gameState.currentSuit, gameState.currentRank)) return;

    const newPlayerHand = gameState.playerHand.filter(c => c.id !== card.id);
    const newDiscardPile = [card, ...gameState.discardPile];

    if (newPlayerHand.length === 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      setGameState(prev => prev ? {
        ...prev,
        playerHand: newPlayerHand,
        discardPile: newDiscardPile,
        status: 'player_won'
      } : null);
      return;
    }

    if (card.rank === '8') {
      setGameState(prev => prev ? {
        ...prev,
        playerHand: newPlayerHand,
        discardPile: newDiscardPile,
        status: 'choosing_suit'
      } : null);
    } else {
      setGameState(prev => prev ? {
        ...prev,
        playerHand: newPlayerHand,
        discardPile: newDiscardPile,
        currentSuit: card.suit,
        currentRank: card.rank,
        turn: 'ai',
        lastAction: `你打出了 ${card.rank}${getSuitSymbol(card.suit)}`
      } : null);
    }
  };

  const handleSuitSelect = (suit: Suit) => {
    if (!gameState) return;
    
    setGameState(prev => prev ? {
      ...prev,
      currentSuit: suit,
      currentRank: '8' as Rank,
      status: 'playing',
      turn: 'ai',
      lastAction: `你指定了花色：${getSuitSymbol(suit)}`
    } : null);
  };

  // AI Turn logic
  useEffect(() => {
    if (gameState?.turn === 'ai' && gameState.status === 'playing') {
      const timer = setTimeout(() => {
        const { aiHand, currentSuit, currentRank, deck } = gameState;
        
        // Find playable cards
        const playableCards = aiHand.filter(c => canPlayCard(c, currentSuit, currentRank));
        
        if (playableCards.length > 0) {
          // AI Strategy: Play non-8 cards first, then 8s
          const nonEight = playableCards.find(c => c.rank !== '8');
          const cardToPlay = nonEight || playableCards[0];
          
          const newAiHand = aiHand.filter(c => c.id !== cardToPlay.id);
          const newDiscardPile = [cardToPlay, ...gameState.discardPile];
          
          if (newAiHand.length === 0) {
            setGameState(prev => prev ? {
              ...prev,
              aiHand: newAiHand,
              discardPile: newDiscardPile,
              status: 'ai_won'
            } : null);
            return;
          }

          if (cardToPlay.rank === '8') {
            // AI picks its most frequent suit
            const suitCounts: Record<Suit, number> = { hearts: 0, diamonds: 0, clubs: 0, spades: 0 };
            newAiHand.forEach(c => suitCounts[c.suit]++);
            const bestSuit = (Object.keys(suitCounts) as Suit[]).reduce((a, b) => suitCounts[a] > suitCounts[b] ? a : b);
            
            setGameState(prev => prev ? {
              ...prev,
              aiHand: newAiHand,
              discardPile: newDiscardPile,
              currentSuit: bestSuit,
              currentRank: '8' as Rank,
              turn: 'player',
              lastAction: `AI 打出了 8 并指定了 ${getSuitSymbol(bestSuit)}`
            } : null);
          } else {
            setGameState(prev => prev ? {
              ...prev,
              aiHand: newAiHand,
              discardPile: newDiscardPile,
              currentSuit: cardToPlay.suit,
              currentRank: cardToPlay.rank,
              turn: 'player',
              lastAction: `AI 打出了 ${cardToPlay.rank}${getSuitSymbol(cardToPlay.suit)}`
            } : null);
          }
        } else {
          // AI needs to draw
          if (deck.length > 0) {
            const newDeck = [...deck];
            const drawnCard = newDeck.pop()!;
            setGameState(prev => prev ? {
              ...prev,
              deck: newDeck,
              aiHand: [...aiHand, drawnCard],
              turn: 'player',
              lastAction: 'AI 没牌可出，摸了一张牌。'
            } : null);
          } else {
            setGameState(prev => prev ? {
              ...prev,
              turn: 'player',
              lastAction: 'AI 没牌可出且摸牌堆已空，跳过回合。'
            } : null);
          }
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState?.turn, gameState?.status]);

  if (!gameState) return null;

  const hasPlayableCards = gameState.playerHand.some(c => canPlayCard(c, gameState.currentSuit, gameState.currentRank));

  return (
    <div className="min-h-screen bg-[#1a472a] text-white font-sans selection:bg-yellow-400 selection:text-black overflow-hidden flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1a472a] font-bold text-xl shadow-lg">8</div>
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">8 点纸牌 (Crazy Eights)</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-black/30 px-4 py-1.5 rounded-full text-sm font-medium border border-white/10">
            {gameState.lastAction}
          </div>
          <button 
            onClick={() => setShowRules(true)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <HelpCircle size={24} />
          </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-grow relative flex flex-col items-center justify-between py-8 px-4">
        {/* AI Hand */}
        <div className="w-full max-w-4xl flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-white/60 text-sm font-medium uppercase tracking-widest">
            <span>AI 对手</span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{gameState.aiHand.length} 张</span>
          </div>
          <div className="flex justify-center -space-x-8 sm:-space-x-12">
            {gameState.aiHand.map((card, i) => (
              <PlayingCard 
                key={card.id} 
                card={card} 
                isFaceUp={false} 
                className="transform scale-90 sm:scale-100"
              />
            ))}
          </div>
        </div>

        {/* Center Table */}
        <div className="flex items-center justify-center gap-8 sm:gap-16 my-8">
          {/* Draw Pile */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-900 rounded-lg translate-x-1 translate-y-1"></div>
              <div className="absolute inset-0 bg-blue-950 rounded-lg translate-x-2 translate-y-2"></div>
              <PlayingCard 
                card={{} as Card} 
                isFaceUp={false} 
                onClick={handleDrawCard}
                className={`cursor-pointer transition-transform ${gameState.turn === 'player' ? 'hover:-translate-y-1' : 'opacity-50'} ${gameState.turn === 'player' && !hasPlayableCards ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}
              />
              {gameState.deck.length > 0 && (
                <div className="absolute -top-3 -right-3 bg-yellow-400 text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                  {gameState.deck.length}
                </div>
              )}
            </div>
            <span className="text-xs font-bold text-white/40 uppercase tracking-tighter">摸牌堆</span>
          </div>

          {/* Discard Pile */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <AnimatePresence mode="popLayout">
                <PlayingCard 
                  key={gameState.discardPile[0].id}
                  card={gameState.discardPile[0]} 
                  className="shadow-2xl"
                />
              </AnimatePresence>
              
              {/* Current Suit Indicator if 8 was played */}
              {gameState.currentRank === '8' && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-xl border-2 border-blue-500"
                >
                  <span className={`text-2xl ${getSuitColor(gameState.currentSuit)}`}>
                    {getSuitSymbol(gameState.currentSuit)}
                  </span>
                </motion.div>
              )}
            </div>
            <span className="text-xs font-bold text-white/40 uppercase tracking-tighter">弃牌堆</span>
          </div>
        </div>

        {/* Player Hand */}
        <div className="w-full max-w-5xl flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 text-white/60 text-sm font-medium uppercase tracking-widest">
            <span className={gameState.turn === 'player' ? 'text-yellow-400' : ''}>
              你的手牌 {gameState.turn === 'player' && '• 轮到你了'}
            </span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{gameState.playerHand.length} 张</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4">
            {gameState.playerHand.map((card) => (
              <PlayingCard 
                key={card.id} 
                card={card} 
                isPlayable={gameState.turn === 'player' && canPlayCard(card, gameState.currentSuit, gameState.currentRank)}
                onClick={() => handlePlayCard(card)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {gameState.status === 'choosing_suit' && (
          <SuitPicker onSelect={handleSuitSelect} />
        )}
        
        {(gameState.status === 'player_won' || gameState.status === 'ai_won') && (
          <GameOver 
            winner={gameState.status === 'player_won' ? 'player' : 'ai'} 
            onRestart={initGame} 
          />
        )}

        {showRules && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[70] p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white text-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Info className="text-blue-600" /> 游戏规则
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>• <strong>目标：</strong> 率先清空你的手牌。</p>
                <p>• <strong>出牌：</strong> 你出的牌必须与弃牌堆顶部的牌<strong>花色相同</strong>或<strong>点数相同</strong>。</p>
                <p>• <strong>万能 8 点：</strong> 数字“8”是万用牌，可以在任何时候打出。打出后，你可以指定一个新的花色。</p>
                <p>• <strong>摸牌：</strong> 如果无牌可出，必须从摸牌堆摸一张牌。摸牌后回合结束。</p>
              </div>
              <button 
                onClick={() => setShowRules(false)}
                className="mt-8 w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
              >
                我知道了
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer / Status Bar */}
      <footer className="p-4 bg-black/20 backdrop-blur-sm text-center text-white/40 text-xs uppercase tracking-widest border-t border-white/10">
        Crazy Eights • {gameState.deck.length} cards remaining in deck
      </footer>
    </div>
  );
}
