import { Shield, Settings, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProxyHeader() {
  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="text-primary text-xl" />
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Pédantix Proxy
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Connecté
              </Badge>
              <span className="text-slate-500 dark:text-slate-400">•</span>
              <span className="text-slate-600 dark:text-slate-300">
                Accès libre à pedantix.certitudes.org
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden md:inline-flex">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres Proxy
            </Button>
            <Button>
              <Share className="mr-2 h-4 w-4" />
              Partager
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
