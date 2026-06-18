import type { Express, Request, Response } from "express";
import * as cheerio from "cheerio";
import axios from "axios";

export function setupProxyRoutes(app: Express) {
  // Redirect to Pédantix site directly - this is simpler than proxying
  app.get("/pedantix", (req: Request, res: Response) => {
    res.redirect(301, "https://pedantix.certitudes.org/");
  });
  
  // Direct content proxy - serves the actual content without iframe
  app.get("/proxy-game-direct", async (req: Request, res: Response) => {
    try {
      console.log("Serving direct proxy content for Pédantix...");
      
      const response = await axios.get("https://pedantix.certitudes.org/", {
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
      
      // Add proxy header banner
      const proxyBanner = `
        <div style="background: #0066cc; color: white; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; font-size: 16px; font-weight: bold; position: fixed; top: 0; left: 0; right: 0; z-index: 9999;">
          <span>🛡️ Pédantix Proxy - Accès Libre</span>
          <span style="background: #28a745; padding: 4px 12px; border-radius: 20px; font-size: 12px;">✅ Connecté</span>
        </div>
        <div style="height: 50px;"></div>
      `;
      
      // Insert proxy banner at the beginning of body
      $("body").prepend(proxyBanner);
      
      // Rewrite ALL asset URLs to proxy through our server - including external ones
      $("script[src]").each((i, el) => {
        const src = $(el).attr("src");
        if (src && !src.startsWith("/pedantix-assets")) {
          if (src.startsWith("//")) {
            // Protocol-relative URL
            $(el).attr("src", `/external-proxy/https:${src}`);
          } else if (src.startsWith("http")) {
            // Absolute URL
            $(el).attr("src", `/external-proxy/${src}`);
          } else {
            // Relative URL
            $(el).attr("src", `/pedantix-assets${src}`);
          }
        }
      });

      $("link[href]").each((i, el) => {
        const href = $(el).attr("href");
        if (href && !href.startsWith("/pedantix-assets") && !href.startsWith("/external-proxy")) {
          if (href.startsWith("//")) {
            // Protocol-relative URL
            $(el).attr("href", `/external-proxy/https:${href}`);
          } else if (href.startsWith("http")) {
            // Absolute URL
            $(el).attr("href", `/external-proxy/${href}`);
          } else {
            // Relative URL
            $(el).attr("href", `/pedantix-assets${href}`);
          }
        }
      });

      $("img[src]").each((i, el) => {
        const src = $(el).attr("src");
        if (src && !src.startsWith("/pedantix-assets") && !src.startsWith("/external-proxy")) {
          if (src.startsWith("//")) {
            // Protocol-relative URL
            $(el).attr("src", `/external-proxy/https:${src}`);
          } else if (src.startsWith("http")) {
            // Absolute URL
            $(el).attr("src", `/external-proxy/${src}`);
          } else {
            // Relative URL
            $(el).attr("src", `/pedantix-assets${src}`);
          }
        }
      });

      // Also handle CSS background-image URLs and other inline styles
      $("style").each((i, el) => {
        let content = $(el).html();
        if (content) {
          // Replace CSS url() references
          content = content.replace(/url\(['"]?(\/[^'")\s]+)['"]?\)/g, (match, url) => {
            if (!url.startsWith('/pedantix-assets') && !url.startsWith('http')) {
              return match.replace(url, `/pedantix-assets${url}`);
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
            if (!url.startsWith('/pedantix-assets') && !url.startsWith('http')) {
              return match.replace(url, `/pedantix-assets${url}`);
            }
            return match;
          });
          $(el).attr("style", style);
        }
      });

      // Rewrite API calls in JavaScript - more comprehensive patterns
      let html = $.html();
      
      // Replace various API call patterns
      html = html.replace(/\/api\//g, "/api-proxy/");
      html = html.replace(/fetch\s*\(\s*["'](\/[^"']*?)["']/g, 'fetch("/api-proxy$1"');
      html = html.replace(/fetch\s*\(\s*['"`](\/[^'"`]*?)['"`]/g, 'fetch("/api-proxy$1"');
      html = html.replace(/\.post\s*\(\s*["'](\/[^"']*?)["']/g, '.post("/api-proxy$1"');
      html = html.replace(/\.get\s*\(\s*["'](\/[^"']*?)["']/g, '.get("/api-proxy$1"');
      html = html.replace(/XMLHttpRequest[^}]*open[^}]*["'](GET|POST)["'][^"']*["'](\/[^"']*?)["']/g, 
                         (match, method, url) => match.replace(url, `/api-proxy${url}`));
      
      // Add a script to intercept and redirect all API calls
      const interceptScript = `
        <script>
        (function() {
          console.log('Pédantix Proxy: Initializing API interception...');
          
          // Override fetch to redirect API calls
          const originalFetch = window.fetch;
          window.fetch = function(url, options = {}) {
            console.log('Fetch intercepted:', url, options);
            
            if (typeof url === 'string') {
              let newUrl = url;
              
              // Redirect ALL relative URLs through proxy (except assets)
              if (url.startsWith('/') && !url.startsWith('/api-proxy') && !url.startsWith('/pedantix-assets') && !url.startsWith('/vite')) {
                newUrl = '/api-proxy' + url;
                console.log('Redirecting fetch to proxy:', newUrl);
              }
              
              return originalFetch(newUrl, options).then(response => {
                console.log('Fetch response:', newUrl, response.status);
                return response;
              }).catch(error => {
                console.error('Fetch error:', newUrl, error);
                throw error;
              });
            }
            
            return originalFetch(url, options);
          };
          
          // Override XMLHttpRequest
          const originalXHROpen = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function(method, url, ...args) {
            console.log('XHR intercepted:', method, url);
            
            if (typeof url === 'string') {
              let newUrl = url;
              
              // Redirect ALL relative URLs through proxy (except assets)
              if (url.startsWith('/') && !url.startsWith('/api-proxy') && !url.startsWith('/pedantix-assets') && !url.startsWith('/vite')) {
                newUrl = '/api-proxy' + url;
                console.log('Redirecting XHR to proxy:', newUrl);
              }
              
              return originalXHROpen.call(this, method, newUrl, ...args);
            }
            
            return originalXHROpen.call(this, method, url, ...args);
          };
          
          // Also intercept form submissions
          const originalFormSubmit = HTMLFormElement.prototype.submit;
          HTMLFormElement.prototype.submit = function() {
            console.log('Form submit intercepted:', this.action);
            if (this.action) {
              const url = new URL(this.action, window.location.origin);
              if (url.pathname.startsWith('/') && !url.pathname.startsWith('/api-proxy')) {
                this.action = '/api-proxy' + url.pathname + url.search;
                console.log('Redirecting form to proxy:', this.action);
              }
            } else if (!this.action || this.action === '') {
              // If no action specified, redirect to proxy root
              this.action = '/api-proxy/';
              console.log('Redirecting empty form action to proxy root');
            }
            return originalFormSubmit.call(this);
          };

          // Intercept form submissions via event listeners
          document.addEventListener('submit', function(e) {
            console.log('Form submit event intercepted:', e.target.action);
            const form = e.target;
            if (form && form.action) {
              const url = new URL(form.action, window.location.origin);
              if (url.pathname.startsWith('/') && !url.pathname.startsWith('/api-proxy')) {
                form.action = '/api-proxy' + url.pathname + url.search;
                console.log('Event: Redirecting form to proxy:', form.action);
              }
            } else if (!form.action || form.action === '') {
              form.action = '/api-proxy/';
              console.log('Event: Redirecting empty form action to proxy root');
            }
          }, true);
          
          console.log('Pédantix Proxy: API interception fully enabled');
        })();
        </script>
      `;
      
      // Insert the intercept script before closing head tag
      html = html.replace('</head>', interceptScript + '</head>');
      
      // Remove X-Frame-Options restrictions
      res.removeHeader("X-Frame-Options");
      res.removeHeader("Content-Security-Policy");
      
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache");
      res.send(html);
      
      console.log("Successfully served direct proxy content");
    } catch (error) {
      console.error("Error serving direct proxy:", error);
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Pédantix Proxy - Erreur</title>
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
            <h1>🚫 Impossible d'accéder à Pédantix</h1>
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
  app.get("/pedantix-assets/*", async (req: Request, res: Response) => {
    try {
      const assetPath = req.path.replace("/pedantix-assets", "");
      const assetUrl = `https://pedantix.certitudes.org${assetPath}`;
      
      console.log(`Proxying asset: ${assetUrl}`);
      
      const response = await axios.get(assetUrl, {
        responseType: 'stream',
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "*/*",
          "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
          "Referer": "https://pedantix.certitudes.org/",
        },
        timeout: 15000,
        validateStatus: () => true,
      });
      
      // Forward important headers and add CORS headers
      const headersToForward = ['content-type', 'content-length', 'cache-control', 'last-modified', 'etag'];
      headersToForward.forEach(header => {
        if (response.headers[header]) {
          res.setHeader(header, response.headers[header]);
        }
      });
      
      // Add CORS headers to allow cross-origin requests
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      
      // Set proper content type based on file extension if not provided
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
        url: `https://pedantix.certitudes.org${req.path.replace("/pedantix-assets", "")}`,
        error: error.message,
        status: error.response?.status
      });
      res.status(404).send("Asset not found");
    }
  });

  // Proxy API calls from the original site
  app.all("/api-proxy/*", async (req: Request, res: Response) => {
    try {
      const apiPath = req.path.replace("/api-proxy", "");
      const apiUrl = `https://pedantix.certitudes.org${apiPath}`;
      
      console.log(`Proxying API: ${req.method} ${apiUrl}`);
      console.log(`Query params:`, req.query);
      console.log(`Body:`, req.body);
      
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
          "Origin": "https://pedantix.certitudes.org",
          "Referer": "https://pedantix.certitudes.org/",
          "X-Requested-With": "XMLHttpRequest",
        },
        timeout: 15000,
        validateStatus: () => true, // Accept all status codes
      });
      
      console.log(`API Response Status: ${response.status}`);
      console.log(`API Response Data:`, response.data);
      
      // Forward response headers (excluding problematic ones)
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

  // Proxy external assets (like static.certitudes.org)
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
          "Referer": "https://pedantix.certitudes.org/",
        },
        timeout: 15000,
        validateStatus: () => true,
      });
      
      // Forward important headers and add CORS headers
      const headersToForward = ['content-type', 'content-length', 'cache-control', 'last-modified', 'etag'];
      headersToForward.forEach(header => {
        if (response.headers[header]) {
          res.setHeader(header, response.headers[header]);
        }
      });
      
      // Add CORS headers to allow cross-origin requests
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      
      // Set proper content type based on file extension if not provided
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

  // Create a simple proxy page that uses an iframe (keep as fallback)
  app.get("/proxy-game", async (req: Request, res: Response) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pédantix - Accès Libre</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; }
          .header {
            background: #0066cc;
            color: white;
            padding: 10px 20px;
            display: flex;
            justify-content: between;
            align-items: center;
            font-size: 16px;
            font-weight: bold;
          }
          .header .status {
            background: #28a745;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            margin-left: auto;
          }
          iframe {
            width: 100%;
            height: calc(100vh - 50px);
            border: none;
          }
          .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            font-size: 18px;
          }
          .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #0066cc;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <span>🛡️ Pédantix Proxy - Accès Libre</span>
          <span class="status">✅ Connecté</span>
        </div>
        <div class="loading" id="loading">
          <div class="spinner"></div>
          <p>Chargement de Pédantix...</p>
        </div>
        <iframe 
          id="gameFrame" 
          src="https://pedantix.certitudes.org/" 
          onload="document.getElementById('loading').style.display='none';"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        ></iframe>
        <script>
          // Hide loading after 3 seconds even if iframe doesn't load
          setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
          }, 3000);
        </script>
      </body>
      </html>
    `);
  });

  // Proxy for static assets (CSS, JS, images)
  app.get("/pedantix-assets/*", async (req: Request, res: Response) => {
    try {
      const assetPath = req.path.replace("/pedantix-assets", "");
      const assetUrl = `https://pedantix.certitudes.org${assetPath}`;
      
      const response = await axios.get(assetUrl, {
        responseType: "stream",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Referer": "https://pedantix.certitudes.org/",
        },
        timeout: 5000,
      });

      // Copy headers
      if (response.headers["content-type"]) {
        res.setHeader("Content-Type", response.headers["content-type"]);
      }
      if (response.headers["content-length"]) {
        res.setHeader("Content-Length", response.headers["content-length"]);
      }

      // Pipe the response
      response.data.pipe(res);
    } catch (error) {
      console.error(`Error proxying asset ${req.path}:`, error);
      res.status(404).send("Asset not found");
    }
  });

  // Proxy for API calls
  app.all("/api-proxy/*", async (req: Request, res: Response) => {
    try {
      const apiPath = req.path.replace("/api-proxy", "");
      const apiUrl = `https://pedantix.certitudes.org${apiPath}`;
      
      const config = {
        method: req.method,
        url: apiUrl,
        headers: {
          ...req.headers,
          "Host": "pedantix.certitudes.org",
          "Origin": "https://pedantix.certitudes.org",
          "Referer": "https://pedantix.certitudes.org/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        data: req.body,
        timeout: 10000,
      };

      // Remove headers that might cause issues
      delete config.headers["host"];
      delete config.headers["connection"];

      const response = await axios(config);
      
      // Copy response headers
      Object.keys(response.headers).forEach(key => {
        if (key !== "content-encoding" && key !== "transfer-encoding") {
          res.setHeader(key, response.headers[key]);
        }
      });

      res.status(response.status).send(response.data);
    } catch (error) {
      console.error(`Error proxying API ${req.path}:`, error);
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).send(error.response.data);
      } else {
        res.status(500).json({ error: "Proxy error" });
      }
    }
  });
}