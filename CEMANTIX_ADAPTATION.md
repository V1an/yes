# Adaptation pour Cemantix

Pour adapter le proxy pour https://cemantix.certitudes.org/, voici les modifications nécessaires :

## 1. Modifications dans `server/proxy-routes.ts`

### Remplacer les URLs de base :
```typescript
// Ligne ~19 et autres occurrences
const response = await axios.get("https://cemantix.certitudes.org/", {

// Ligne ~184
const apiUrl = `https://cemantix.certitudes.org${apiPath}`;

// Headers - ligne ~201 et ~256
"Origin": "https://cemantix.certitudes.org",
"Referer": "https://cemantix.certitudes.org/",
```

### Bannière proxy :
```typescript
// Ligne ~33-36
const proxyBanner = `
  <div style="...">
    <span>🛡️ Cemantix Proxy - Accès Libre</span>
    <span style="...">✅ Connecté</span>
  </div>
`;
```

## 2. Modifications dans `client/src/pages/proxy-game.tsx`

### URLs et textes :
```tsx
// Ligne ~7
window.open("https://cemantix.certitudes.org/", "_blank");

// Ligne ~91
<h1 className="text-2xl font-bold text-gray-800 mb-2">
  Cemantix Proxy
</h1>
<p className="text-gray-600">
  Accédez à Cemantix même si le site est bloqué
</p>
```

## 3. Modifications générales

### Mise à jour des endpoints :
- Remplacer `/proxy-game-direct` par `/cemantix-direct` (optionnel)
- Garder `/api-proxy/*` et `/assets/*` (compatible)
- Garder `/external-proxy/*` (compatible)

### Documentation :
- Mettre à jour README.md avec "Cemantix" au lieu de "Pédantix"
- Changer le titre et la description
- Adapter les captures d'écran si nécessaire

## 4. Script de conversion automatique

Vous pouvez utiliser cette commande pour remplacer toutes les occurrences :

```bash
# Remplacer les URLs
find . -name "*.ts" -o -name "*.tsx" -o -name "*.md" | xargs sed -i 's/pedantix\.certitudes\.org/cemantix.certitudes.org/g'
find . -name "*.ts" -o -name "*.tsx" -o -name "*.md" | xargs sed -i 's/Pédantix/Cemantix/g'
find . -name "*.ts" -o -name "*.tsx" -o -name "*.md" | xargs sed -i 's/pedantix/cemantix/g'

# Adapter les noms de routes (optionnel)
sed -i 's/proxy-game-direct/cemantix-direct/g' server/proxy-routes.ts client/src/pages/proxy-game.tsx
```

## 5. Variables d'environnement (optionnel)

Pour supporter les deux jeux, vous pourriez ajouter :

```typescript
const GAME_URL = process.env.GAME_URL || "https://pedantix.certitudes.org";
const GAME_NAME = process.env.GAME_NAME || "Pédantix";
```

## Différences techniques entre Pédantix et Cemantix

Les deux jeux utilisent la même infrastructure technique :
- ✅ Même domaine (certitudes.org)
- ✅ Mêmes assets externes (static.certitudes.org)
- ✅ Structure d'API similaire
- ✅ Même protection X-Frame-Options
- ✅ Mêmes restrictions CORS

Le proxy fonctionnera identiquement pour les deux jeux.

## Version multi-jeux

Pour supporter les deux simultanément, vous pourriez créer :
- `/pedantix` → Proxy vers Pédantix
- `/cemantix` → Proxy vers Cemantix
- `/` → Page de choix entre les deux jeux