import { Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SemanticMatchesProps {
  guessedWords: Array<{ word: string; similarity: number }>;
  attemptCount: number;
}

export default function SemanticMatches({ guessedWords, attemptCount }: SemanticMatchesProps) {
  const getColorClass = (similarity: number) => {
    if (similarity >= 80) return "bg-green-100 border-green-200 dark:bg-green-900 dark:border-green-700";
    if (similarity >= 60) return "bg-lime-100 border-lime-200 dark:bg-lime-900 dark:border-lime-700";
    if (similarity >= 40) return "bg-amber-100 border-amber-200 dark:bg-amber-900 dark:border-amber-700";
    return "bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700";
  };

  const getProgressColor = (similarity: number) => {
    if (similarity >= 80) return "bg-green-500";
    if (similarity >= 60) return "bg-lime-500";
    if (similarity >= 40) return "bg-amber-500";
    return "bg-slate-400";
  };

  const getTextColor = (similarity: number) => {
    if (similarity >= 80) return "text-green-700 dark:text-green-300";
    if (similarity >= 60) return "text-lime-700 dark:text-lime-300";
    if (similarity >= 40) return "text-amber-700 dark:text-amber-300";
    return "text-slate-700 dark:text-slate-300";
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
          <Brain className="text-primary mr-2" />
          Similarité Sémantique
        </h3>
        
        <div className="space-y-3">
          {guessedWords.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              Aucun mot tenté pour le moment
            </div>
          ) : (
            guessedWords.slice(0, 10).map((word, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${getColorClass(word.similarity)}`}
              >
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {word.word}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(word.similarity)}`}
                      style={{ width: `${word.similarity}%` }}
                    />
                  </div>
                  <span className={`text-sm font-semibold ${getTextColor(word.similarity)}`}>
                    {Math.round(word.similarity)}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
            <span>Tentatives</span>
            <span>{attemptCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
