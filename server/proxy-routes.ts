import type { Express, Request, Response } from "express";
import * as cheerio from "cheerio";
import axios from "axios";
import { GAMES, isGameId, type GameId } from "@shared/games";

function requireGame(req: Request, res: Response): GameId | null {
  const game = req.params.game;
  if (!isGameId(game)) {
    res.status(404).send("Unknown game");
    return null;
  }
  return game;
}

export function setupProxyRoutes(app: Express) {
  // Direct content proxy - serves the actual game content rewritten to flow
  // through our server, without an iframe.
  app.get("/proxy-direct/:game", async (req: Request, res: Response) => {
    const game = requireGame(req, res);
    if (!game) return;
    const { name, domain } = GAMES[game];

    try {
      console.log(`Serving direct proxy content for ${name}...`);

      const response = await axios.get(`https://${domain}/`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "fr-FR,fr;q=0.8,en-US;q=0.5,en;q=0.3",
          "Accept-Encoding": "gzip, deflate",
          "Connection": "keep-alive",
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      const assetPrefix = `/pedantix-assets/${game}`;
      const apiPrefix = `/api-proxy/${game}`;

      // Add proxy header banner
      const proxyBanner = `
        <div style="background: #0066cc; color: white; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; font-size: 16px; font-weight: bold; position: fixed; top: 0; left: 0; right: 0; z-index: 9999;">
          <span>🛡️ ${name} Proxy - Accès Libre</span>
          <span style="background: #28a745; padding: 4px 12px; border-radius: 20px; font-size: 12px;">✅ Connecté</span>
        </div>
        <div style="height: 50px;"></div>
      `;

      // Insert proxy banner at the beginning of body
      $("body").prepend(proxyBanner);

      // Rewrite ALL asset URLs to proxy through our server - including external ones
      $("script[src]").each((i, el) => {
        const src = $(el).attr("src");
        if (src && !src.startsWith(assetPrefix)) {
          if (src.startsWith("//")) {
            $(el).attr("src", `/external-proxy/https:${src}`);
          } else if (src.startsWith("http")) {
            $(el).attr("src", `/external-proxy/${src}`);
          } else {
            $(el).attr("src", `${assetPrefix}${src}`);
          }
        }
      });

      $("link[href]").each((i, el) => {
        const href = $(el).attr("href");
        if (href && !href.startsWith(assetPrefix) && !href.startsWith("/external-proxy")) {
          if (href.startsWith("//")) {
            $(el).attr("href", `/external-proxy/https:${href}`);
          } else if (href.startsWith("http")) {
            $(el).attr("href", `/external-proxy/${href}`);
          } else {
            $(el).attr("href", `${assetPrefix}${href}`);
          }
        }
      });

      $("img[src]").each((i, el) => {
        const src = $(el).attr("src");
        if (src && !src.startsWith(assetPrefix) && !src.startsWith("/external-proxy")) {
          if (src.startsWith("//")) {
            $(el).attr("src", `/external-proxy/https:${src}`);
          } else if (src.startsWith("http")) {
            $(el).attr("src", `/external-proxy/${src}`);
          } else {
            $(el).attr("src", `${assetPrefix}${src}`);
          }
        }
      });

      // Also handle CSS background-image URLs and other inline styles
      $("style").each((i, el) => {
        let content = $(el).html();
        if (content) {
          content = content.replace(/url\(['"]?(\/[^'")\s]+)['"]?\)/g, (match, url) => {
            if (!url.startsWith(assetPrefix) && !url.startsWith('http')) {
              return match.replace(url, `${assetPrefix}${url}`);
            }
            return match;
          });
          $(el).html(content);
        }
      });

      // Handle inline styles with background-image
      $("[style*='background']").each((i, el) => {
        let style = $(el).attr("style");
        if (style) {
          style = style.replace(/url\(['"]?(\/[^'")\s]+)['"]?\)/g, (match, url) => {
            if (!url.startsWith(assetPrefix) && !url.startsWith('http')) {
              return match.replace(url, `${assetPrefix}${url}`);
            }
            return match;
          });
          $(el).attr("style", style);
        }
      });

      // Rewrite API calls in JavaScript - more comprehensive patterns
      let html = $.html();

      html = html.replace(/\/api\//g, `${apiPrefix}/`);
      html = html.replace(/fetch\s*\(\s*["'](\/[^"']*?)["']/g, `fetch("${apiPrefix}$1"`);
      html = html.replace(/fetch\s*\(\s*['"`](\/[^'"`]*?)['"`]/g, `fetch("${apiPrefix}$1"`);
      html = html.replace(/\.post\s*\(\s*["'](\/[^"']*?)["']/g, `.post("${apiPrefix}$1"`);
      html = html.replace(/\.get\s*\(\s*["'](\/[^"']*?)["']/g, `.get("${apiPrefix}$1"`);
      html = html.replace(/XMLHttpRequest[^}]*open[^}]*["'](GET|POST)["'][^"']*["'](\/[^"']*?)["']/g,
                         (match, method, url) => match.replace(url, `${apiPrefix}${url}`));

      // Add a script to intercept and redirect all API calls
      const interceptScript = `
        <script>
        (function() {
          const API_PREFIX = ${JSON.stringify(apiPrefix)};
          const ASSET_PREFIX = ${JSON.stringify(assetPrefix)};
          console.log('${name} Proxy: Initializing API interception...');

          const originalFetch = window.fetch;
          window.fetch = function(url, options = {}) {
            if (typeof url === 'string') {
              let newUrl = url;
              if (url.startsWith('/') && !url.startsWith(API_PREFIX) && !url.startsWith(ASSET_PREFIX) && !url.startsWith('/vite')) {
                newUrl = API_PREFIX + url;
              }
              return originalFetch(newUrl, options);
            }
            return originalFetch(url, options);
          };

          const originalXHROpen = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function(method, url, ...args) {
            if (typeof url === 'string') {
              let newUrl = url;
              if (url.startsWith('/') && !url.startsWith(API_PREFIX) && !url.startsWith(ASSET_PREFIX) && !url.startsWith('/vite')) {
                newUrl = API_PREFIX + url;
              }
              return originalXHROpen.call(this, method, newUrl, ...args);
            }
            return originalXHROpen.call(this, method, url, ...args);
          };

          const originalFormSubmit = HTMLFormElement.prototype.submit;
          HTMLFormElement.prototype.submit = function() {
            if (this.action) {
              const url = new URL(this.action, window.location.origin);
              if (url.pathname.startsWith('/') && !url.pathname.startsWith(API_PREFIX)) {
                this.action = API_PREFIX + url.pathname + url.search;
              }
            } else {
              this.action = API_PREFIX + '/';
            }
            return originalFormSubmit.call(this);
          };

          document.addEventListener('submit', function(e) {
            const form = e.target;
            if (form && form.action) {
              const url = new URL(form.action, window.location.origin);
              if (url.pathname.startsWith('/') && !url.pathname.startsWith(API_PREFIX)) {
                form.action = API_PREFIX + url.pathname + url.search;
              }
            } else if (form && (!form.action || form.action === '')) {
              form.action = API_PREFIX + '/';
            }
          }, true);

          // The site has tab links (#pedantix / #cemantix) that switch games
          // by navigating straight to the other domain. Hijack them so the
          // switch stays inside our proxy.
          var GAME_IDS = ${JSON.stringify(Object.keys(GAMES))};
          document.addEventListener('click', function(e) {
            var el = e.target.closest && e.target.closest('a');
            if (el && GAME_IDS.indexOf(el.id) !== -1 && el.id !== ${JSON.stringify(game)}) {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = '/proxy-direct/' + el.id;
            }
          }, true);

          console.log('${name} Proxy: API interception fully enabled');
        })();
        </script>
      `;

      html = html.replace('</head>', interceptScript + '</head>');

      res.removeHeader("X-Frame-Options");
      res.removeHeader("Content-Security-Policy");

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache");
      res.send(html);

      console.log(`Successfully served direct proxy content for ${name}`);
    } catch (error) {
      console.error(`Error serving direct proxy for ${name}:`, error);
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${name} Proxy - Erreur</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; text-align: center; background: #f8f9fa; }
            .error { background: white; border: 1px solid #dee2e6; border-radius: 8px; padding: 30px; margin: 20px auto; max-width: 600px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            button { background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px; }
            button:hover { background: #0056b3; }
            .back-link { margin-top: 20px; }
            .back-link a { color: #6c757d; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="error">
            <h1>🚫 Impossible d'accéder à ${name}</h1>
            <p>Le site original semble être indisponible ou bloqué pour le moment.</p>
            <p><strong>Erreur:</strong> ${error instanceof Error ? error.message : 'Erreur inconnue'}</p>
            <button onclick="window.location.reload()">🔄 Réessayer</button>
            <div class="back-link">
              <a href="/">← Retour au menu principal</a>
            </div>
          </div>
        </body>
        </html>
      `);
    }
  });

  // Proxy assets from the original site
  app.get("/pedantix-assets/:game/*", async (req: Request, res: Response) => {
    const game = requireGame(req, res);
    if (!game) return;
    const { domain } = GAMES[game];

    try {
      const assetPath = req.path.replace(`/pedantix-assets/${game}`, "");
      const assetUrl = `https://${domain}${assetPath}`;

      console.log(`Proxying asset: ${assetUrl}`);

      const response = await axios.get(assetUrl, {
        responseType: 'stream',
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "*/*",
          "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
          "Referer": `https://${domain}/`,
        },
        timeout: 15000,
        validateStatus: () => true,
      });

      const headersToForward = ['content-type', 'content-length', 'cache-control', 'last-modified', 'etag'];
      headersToForward.forEach(header => {
        if (response.headers[header]) {
          res.setHeader(header, response.headers[header]);
        }
      });

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

      if (!response.headers['content-type']) {
        if (assetPath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css; charset=utf-8');
        } else if (assetPath.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        } else if (assetPath.endsWith('.png')) {
          res.setHeader('Content-Type', 'image/png');
        } else if (assetPath.endsWith('.jpg') || assetPath.endsWith('.jpeg')) {
          res.setHeader('Content-Type', 'image/jpeg');
        } else if (assetPath.endsWith('.svg')) {
          res.setHeader('Content-Type', 'image/svg+xml');
        }
      }

      res.status(response.status);
      response.data.pipe(res);
    } catch (error: any) {
      console.error("Error proxying asset:", {
        url: `https://${domain}${req.path.replace(`/pedantix-assets/${game}`, "")}`,
        error: error.message,
        status: error.response?.status
      });
      res.status(404).send("Asset not found");
    }
  });

  // Proxy API calls from the original site
  app.all("/api-proxy/:game/*", async (req: Request, res: Response) => {
    const game = requireGame(req, res);
    if (!game) return;
    const { domain } = GAMES[game];

    try {
      const apiPath = req.path.replace(`/api-proxy/${game}`, "");
      const apiUrl = `https://${domain}${apiPath}`;

      console.log(`Proxying API: ${req.method} ${apiUrl}`);

      const response = await axios({
        method: req.method.toLowerCase() as any,
        url: apiUrl,
        data: req.body,
        params: req.query,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
          "Content-Type": req.headers['content-type'] || "application/json",
          "Origin": `https://${domain}`,
          "Referer": `https://${domain}/`,
          "X-Requested-With": "XMLHttpRequest",
        },
        timeout: 15000,
        validateStatus: () => true,
      });

      console.log(`API Response Status: ${response.status}`);

      Object.keys(response.headers).forEach(key => {
        const lowerKey = key.toLowerCase();
        if (!['content-encoding', 'transfer-encoding', 'connection', 'upgrade'].includes(lowerKey)) {
          res.setHeader(key, response.headers[key]);
        }
      });

      res.status(response.status);
      if (typeof response.data === 'object') {
        res.json(response.data);
      } else {
        res.send(response.data);
      }
    } catch (error: any) {
      console.error("Error proxying API:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });

      if (error.response) {
        res.status(error.response.status).json({
          error: "Proxy API error",
          details: error.response.data,
          status: error.response.status
        });
      } else {
        res.status(500).json({
          error: "Proxy API error",
          message: error.message
        });
      }
    }
  });

  // Proxy external assets (like static.certitudes.org) - absolute URL, game-agnostic
  app.get("/external-proxy/*", async (req: Request, res: Response) => {
    try {
      const externalUrl = req.path.replace("/external-proxy/", "");

      console.log(`Proxying external asset: ${externalUrl}`);

      const response = await axios.get(externalUrl, {
        responseType: 'stream',
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "*/*",
          "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
        },
        timeout: 15000,
        validateStatus: () => true,
      });

      const headersToForward = ['content-type', 'content-length', 'cache-control', 'last-modified', 'etag'];
      headersToForward.forEach(header => {
        if (response.headers[header]) {
          res.setHeader(header, response.headers[header]);
        }
      });

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

      if (!response.headers['content-type']) {
        if (externalUrl.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css; charset=utf-8');
        } else if (externalUrl.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        } else if (externalUrl.endsWith('.json') || externalUrl.endsWith('.webmanifest')) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
        } else if (externalUrl.endsWith('.png')) {
          res.setHeader('Content-Type', 'image/png');
        } else if (externalUrl.endsWith('.jpg') || externalUrl.endsWith('.jpeg')) {
          res.setHeader('Content-Type', 'image/jpeg');
        } else if (externalUrl.endsWith('.svg')) {
          res.setHeader('Content-Type', 'image/svg+xml');
        }
      }

      res.status(response.status);
      response.data.pipe(res);
    } catch (error: any) {
      console.error("Error proxying external asset:", {
        url: req.path.replace("/external-proxy/", ""),
        error: error.message,
        status: error.response?.status
      });
      res.status(404).send("External asset not found");
    }
  });
}
