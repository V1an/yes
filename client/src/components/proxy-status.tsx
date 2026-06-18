import { Server, Globe, Gauge, Shield, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProxyStats } from "@shared/schema";

interface ProxyStatusProps {
  stats?: ProxyStats[];
}

export default function ProxyStatus({ stats }: ProxyStatusProps) {
  const averageLatency = stats && stats.length > 0 
    ? Math.round(stats.reduce((sum, stat) => sum + (stat.responseTime || 0), 0) / stats.length)
    : 45;

  const connectionStatus = stats && stats.length > 0 
    ? stats[stats.length - 1]?.status === 200 ? "stable" : "unstable"
    : "stable";

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
          <Server className="text-primary mr-2" />
          Statut du Proxy
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-300 flex items-center">
              <Globe className="text-xs mr-2" />
              Connexion
            </span>
            <Badge 
              variant={connectionStatus === "stable" ? "secondary" : "destructive"}
              className={connectionStatus === "stable" 
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
              }
            >
              <div className={`w-2 h-2 rounded-full mr-1 ${
                connectionStatus === "stable" ? "bg-green-500" : "bg-red-500"
              }`} />
              {connectionStatus === "stable" ? "Stable" : "Instable"}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-300 flex items-center">
              <Gauge className="text-xs mr-2" />
              Latence
            </span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {averageLatency}ms
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-300 flex items-center">
              <Shield className="text-xs mr-2" />
              Contournement
            </span>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              Actif
            </Badge>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
            <Info className="inline mr-1 h-3 w-3" />
            Proxy sécurisé pour un accès libre à Pédantix
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
