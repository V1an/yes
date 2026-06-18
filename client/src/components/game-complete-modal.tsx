import { Trophy, Share, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GameCompleteModalProps {
  isOpen: boolean;
  articleTitle: string;
  completionTime: string;
  totalGuesses: number;
  onClose: () => void;
}

export default function GameCompleteModal({
  isOpen,
  articleTitle,
  completionTime,
  totalGuesses,
  onClose
}: GameCompleteModalProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Pédantix - Résultat",
        text: `J'ai découvert l'article "${articleTitle}" en ${completionTime} avec ${totalGuesses} tentatives !`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(
        `J'ai découvert l'article "${articleTitle}" en ${completionTime} avec ${totalGuesses} tentatives ! ${window.location.href}`
      );
    }
  };

  const handleNewGame = () => {
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
            <Trophy className="text-green-600 dark:text-green-400 text-2xl" />
          </div>
          
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            Bravo ! 🎉
          </DialogTitle>
          <p className="text-slate-600 dark:text-slate-300 text-center mb-6">
            Vous avez découvert l'article mystère !
          </p>
        </DialogHeader>
        
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {articleTitle}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Résolu en <span className="font-medium">{completionTime}</span> 
            {' '}avec <span className="font-medium">{totalGuesses}</span> tentatives
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button onClick={handleShare} className="flex-1">
            <Share className="mr-2 h-4 w-4" />
            Partager
          </Button>
          <Button onClick={handleNewGame} variant="outline" className="flex-1">
            <RotateCcw className="mr-2 h-4 w-4" />
            Nouvelle partie
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
