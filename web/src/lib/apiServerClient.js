// src/lib/apiServerClient.js
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:8090';

const DEFAULT_TIMEOUT = 15000;
const MAX_RETRIES     = 2;
const RETRY_STATUS    = [429, 503, 504];
const RETRY_DELAY_MS  = 1200;

// Cache leve para requisições GET públicas (sem Authorization)
const CACHE_DISABLED = import.meta.env.VITE_DISABLE_CACHE === 'true';
const _getCache = new Map(); // url → { data, expires }
const GET_TTL   = 30_000;   // 30 s

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const buildHeaders = (options = {}) => {
  const headers = { ...getAuthHeaders(), ...options.headers };
  if (!(options.body instanceof FormData)) {
    if (!headers['Content-Type'] && options.body) {
      headers['Content-Type'] = 'application/json';
    }
  } else {
    delete headers['Content-Type'];
  }
  return headers;
};

const coreFetch = async (url, options = {}, attempt = 0) => {
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
  try {
    const res = await window.fetch(url, {
      ...options,
      headers: buildHeaders(options),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (RETRY_STATUS.includes(res.status) && attempt < MAX_RETRIES) {
      const retryAfter = res.headers.get('Retry-After');
      const waitMs     = retryAfter ? parseInt(retryAfter) * 1000 : RETRY_DELAY_MS * (attempt + 1);
      await delay(waitMs);
      return coreFetch(url, options, attempt + 1);
    }
    if (res.status === 401) {
      localStorage.removeItem('authToken');
      if (!url.includes('/login')) window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    return res;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') throw new Error(`[API] Timeout após ${DEFAULT_TIMEOUT / 1000}s: ${url}`);
    if (attempt < MAX_RETRIES) {
      await delay(RETRY_DELAY_MS * (attempt + 1));
      return coreFetch(url, options, attempt + 1);
    }
    throw error;
  }
};

const parseError = async (res, label) => {
  try {
    const body = await res.clone().json();
    const msg = body?.error || body?.message || body?.detail;
    if (msg) throw new Error(msg);
  } catch (e) {
    if (e.message && e.message !== 'Failed to execute \'json\' on \'Response\'') throw e;
  }
  throw new Error(`${label} → ${res.status}`);
};

const apiServerClient = {
  fetch: (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    return coreFetch(url, options);
  },

  get: async (endpoint) => {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const token = localStorage.getItem('authToken');
    // Só cacheia endpoints públicos (sem token de autenticação) e se cache estiver ativo
    if (!CACHE_DISABLED && !token) {
      const cached = _getCache.get(url);
      if (cached && Date.now() < cached.expires) return cached.data;
    }
    const res = await apiServerClient.fetch(endpoint);
    if (!res.ok) await parseError(res, `GET ${endpoint}`);
    const data = await res.json();
    if (!CACHE_DISABLED && !token) _getCache.set(url, { data, expires: Date.now() + GET_TTL });
    return data;
  },

  post: async (endpoint, body) => {
    const res = await apiServerClient.fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (!res.ok) await parseError(res, `POST ${endpoint}`);
    return res.json();
  },

  put: async (endpoint, body) => {
    const res = await apiServerClient.fetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    if (!res.ok) await parseError(res, `PUT ${endpoint}`);
    return res.json();
  },

  delete: async (endpoint) => {
    const res = await apiServerClient.fetch(endpoint, { method: 'DELETE' });
    if (!res.ok) await parseError(res, `DELETE ${endpoint}`);
    return res.status === 204 ? null : res.json();
  },

  upload: async (endpoint, formData, method = 'POST') => {
    const res = await apiServerClient.fetch(endpoint, { method, body: formData });
    if (!res.ok) await parseError(res, `UPLOAD ${endpoint}`);
    return res.json();
  },

  // ── URL pública do arquivo ──────────────────────────────────────────────
  // Backend serve em: /uploads/{collection}/{filename}
  getFileUrl: (_collection, _recordId, filename) => {
  if (!filename) return null;
  // URL completa do Cloudinary — retorna direto
  if (filename.startsWith('http')) return filename;
  // Fallback para imagens antigas ainda com filename local
  return `${API_BASE_URL}/uploads/${_collection}/${filename}`;
},

  getBaseUrl: () => API_BASE_URL,
};

export default apiServerClient;
export { apiServerClient };
