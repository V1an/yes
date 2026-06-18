import { useState } from "react";

export default function ProxyGame() {
  const [showIframe, setShowIframe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDirectAccess = () => {
    window.open("https://pedantix.certitudes.org/", "_blank");
  };

  const handleProxyAccess = () => {
    // Redirect to proxy endpoint that serves the content directly
    window.location.href = '/proxy-game-direct';
  };

  if (showIframe) {
    return (
      <div style={{ margin: 0, padding: 0, height: "100vh", fontFamily: "Arial, sans-serif" }}>
        <div style={{
          background: "#0066cc",
          color: "white",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "16px",
          fontWeight: "bold"
        }}>
          <span>🛡️ Pédantix Proxy - Accès Libre</span>
          <span style={{
            background: "#28a745",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px"
          }}>✅ Connecté</span>
        </div>
        
        {loading && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            fontSize: "18px",
            zIndex: 1000,
            background: "rgba(255,255,255,0.9)",
            padding: "20px",
            borderRadius: "8px"
          }}>
            <div style={{
              border: "3px solid #f3f3f3",
              borderTop: "3px solid #0066cc",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px"
            }}></div>
            <p>Chargement de Pédantix...</p>
          </div>
        )}
        
        <iframe 
          src="https://pedantix.certitudes.org/" 
          style={{
            width: "100%",
            height: "calc(100vh - 50px)",
            border: "none"
          }}
          onLoad={() => setLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
        />
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🛡️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Pédantix Proxy
          </h1>
          <p className="text-gray-600">
            Accédez à Pédantix même si le site est bloqué
          </p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={handleDirectAccess}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            🌐 Accès Direct
          </button>
          
          <div className="text-center text-sm text-gray-500">ou</div>
          
          <button 
            onClick={handleProxyAccess}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            🔒 Accès via Proxy
          </button>
        </div>
        
        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>Accès direct recommandé si possible</p>
          <p>Utiliser le proxy si le site est bloqué</p>
        </div>
      </div>
    </div>
  );
}