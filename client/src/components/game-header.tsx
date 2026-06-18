import { Calendar, Clock, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function GameHeader() {
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Pédantix du jour
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Découvrez l'article Wikipédia mystère en devinant les mots qui s'y trouvent
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-300">
              <span className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {currentDate}
              </span>
              <span className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                Puzzle #{Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % 1000}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                <Star className="mr-1 h-3 w-3" />
                Difficulté: ★★★☆☆
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
