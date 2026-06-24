import { GAMES, type GameId } from "@shared/games";

export default function ProxyGame() {
  const openProxy = (game: GameId) => {
    window.location.href = `/proxy-direct/${game}`;
  };

  const games = Object.values(GAMES);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🛡️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Proxy - Accès Libre
          </h1>
          <p className="text-gray-600">
            Choisissez le jeu auquel accéder via le proxy
          </p>
        </div>

        <div className="space-y-4">
          {games.map((g) => (
            <button
              key={g.id}
              onClick={() => openProxy(g.id)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-4 rounded-lg transition-colors flex items-center gap-3 text-left"
            >
              <span className="text-2xl">{g.emoji}</span>
              <span className="flex flex-col">
                <span className="text-lg">{g.name}</span>
                <span className="text-xs font-normal text-blue-100">
                  {g.description}
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>Le site original est chargé à travers ce serveur</p>
          <p>pour contourner les blocages réseau.</p>
        </div>
      </div>
    </div>
  );
}
