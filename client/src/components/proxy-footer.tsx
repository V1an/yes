import { Shield, ExternalLink } from "lucide-react";

export default function ProxyFooter() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="text-primary text-xl" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Pédantix Proxy
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Accédez librement au jeu Pédantix même lorsque le site original est bloqué. 
              Proxy sécurisé maintenant toutes les fonctionnalités du jeu original.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Jeu</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li><a href="#" className="hover:text-primary transition-colors">Comment jouer</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Règles</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Statistiques</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Archives</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Proxy</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li><a href="#" className="hover:text-primary transition-colors">Statut du service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Confidentialité</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support technique</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">À propos</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-slate-600 dark:text-slate-300">
              © 2024 Pédantix Proxy. Service indépendant non affilié à certitudes.org
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-300">
              <a 
                href="https://pedantix.certitudes.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors flex items-center"
              >
                <ExternalLink className="mr-1 h-3 w-3" />
                Site original
              </a>
              <span>•</span>
              <a 
                href="https://pedantle.certitudes.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Version anglaise
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
