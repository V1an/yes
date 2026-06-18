import { BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DailyStats() {
  // Mock statistics - in real implementation these would come from API
  const stats = {
    playersToday: 1847,
    successRate: 73,
    averageTime: "14m 32s",
    userRank: 234
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
          <BarChart3 className="text-primary mr-2" />
          Statistiques du jour
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-300">Joueurs aujourd'hui</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {stats.playersToday.toLocaleString("fr-FR")}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-300">Taux de réussite</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              {stats.successRate}%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-300">Temps moyen</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {stats.averageTime}
            </span>
          </div>
          
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-600 dark:text-slate-300">Votre rang</span>
              <span className="font-semibold text-primary">
                #{stats.userRank}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Basé sur le temps de résolution
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
