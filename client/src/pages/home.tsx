import { useState, useEffect } from "react";
import ProxyHeader from "@/components/proxy-header";
import GameHeader from "@/components/game-header";
import WordInput from "@/components/word-input";
import ArticlePreview from "@/components/article-preview";
import SemanticMatches from "@/components/semantic-matches";
import DailyStats from "@/components/daily-stats";
import ProxyStatus from "@/components/proxy-status";
import GameCompleteModal from "@/components/game-complete-modal";
import ProxyFooter from "@/components/proxy-footer";
import { useProxyGame } from "@/hooks/use-proxy";

export default function Home() {
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2)}`);
  const {
    gameState,
    submitWord,
    proxyStats,
    isLoading,
    isCompleted
  } = useProxyGame(sessionId);

  const [guessedWords, setGuessedWords] = useState<Array<{ word: string; similarity: number }>>([]);
  const [revealedWords, setRevealedWords] = useState<string[]>([]);

  useEffect(() => {
    if (gameState) {
      setRevealedWords(gameState.revealedWords || []);
      const scores = gameState.semanticScores ? JSON.parse(gameState.semanticScores) : {};
      const guessed = Object.entries(scores).map(([word, similarity]) => ({
        word,
        similarity: similarity as number
      })).sort((a, b) => b.similarity - a.similarity);
      setGuessedWords(guessed);
    }
  }, [gameState]);

  const handleWordSubmit = async (word: string) => {
    try {
      const result = await submitWord(word);
      if (result) {
        setGuessedWords(prev => {
          const updated = [...prev, { word, similarity: result.similarity }];
          return updated.sort((a, b) => b.similarity - a.similarity);
        });
        
        if (result.revealed) {
          setRevealedWords(prev => [...prev, ...result.revealed]);
        }
      }
    } catch (error) {
      console.error("Failed to submit word:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <ProxyHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <GameHeader />
            <WordInput onSubmit={handleWordSubmit} isLoading={isLoading} />
            <ArticlePreview 
              revealedWords={revealedWords}
              totalWords={156}
              progress={(revealedWords.length / 156) * 100}
            />
          </div>
          
          <div className="space-y-6">
            <SemanticMatches 
              guessedWords={guessedWords}
              attemptCount={guessedWords.length}
            />
            <DailyStats />
            <ProxyStatus stats={proxyStats} />
          </div>
        </div>
      </main>

      <GameCompleteModal 
        isOpen={isCompleted}
        articleTitle={gameState?.articleId || "Article Mystère"}
        completionTime="12m 45s"
        totalGuesses={guessedWords.length}
        onClose={() => {}}
      />

      <ProxyFooter />
    </div>
  );
}
