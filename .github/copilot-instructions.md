# Instituto Milhomem - Project Guidelines

Este arquivo e a fonte primaria para retomadas de sessao. Use como contexto base antes de implementar alteracoes.

## Resumo Rapido

- Produto: site institucional + painel admin da clinica Instituto Milhomem.
- Backend ativo: `src/main.js` (Express 5).
- Frontend ativo: `web/` (`web/src/main.jsx` e `web/src/App.jsx`).
- Frontend legado: `temp-build/` (nao usar para novas alteracoes).
- Repositorio GitHub: `instituto-milhomem.git`.
- Producao: Hostinger (plano Business).
- Email operacional: `contato@institutomilhomem.com`.

## TL;DR Operacional (Uso Diario)

- [ ] Frontend ativo: `web/`.
- [ ] Backend ativo: `src/`.
- [ ] Nao usar `temp-build/` para novas alteracoes.
- [ ] Sempre usar `web/src/lib/apiServerClient.js` (evitar `fetch` direto).
- [ ] Toda string de UI deve passar por i18n (`useTranslation`).
- [ ] Ao mexer em dados, validar impacto em `src/routes/`, `src/middleware/` e `src/db/migrations/`.
- [ ] Nunca editar migration aplicada; criar nova migration sequencial.
- [ ] Auth e permissao: `src/middleware/auth.js` + `src/middleware/checkPermission.js`.
- [ ] Permissoes no token: formato `resource:action`.
- [ ] Em mudancas sensiveis, considerar registro em `audit_logs`.

### Ordem De Prioridade Em Incidentes

- producao fora -> health -> login -> upload -> sitemap

### Nao Fazer (Guardrails)

- Nao usar `temp-build/` para novas alteracoes.
- Nao usar `fetch` direto em novas features.
- Nao editar migration ja aplicada.

### Checklist De Deploy Rapido

- [ ] Confirmar env vars obrigatorias (backend + frontend).
- [ ] Confirmar migrations aplicadas em ordem.
- [ ] Rodar build: `npm run build` na raiz.
- [ ] Subir backend: `npm start`.
- [ ] Smoke test: `/api/health`.
- [ ] Smoke test: login admin.
- [ ] Smoke test: navegacao publica basica.
- [ ] Smoke test: upload de imagem no admin.
- [ ] Smoke test: `/sitemap.xml`.
- [ ] Confirmar destino de deploy: Hostinger Business.

## Regras Base

- Use o bloco TL;DR acima como checklist operacional obrigatorio para novas alteracoes.

## Arquitetura

| Layer | Location | Details |
|---|---|---|
| Backend API | `src/` | Express 5, JWT auth, RBAC, MySQL2, upload Cloudinary |
| Frontend SPA | `web/` | React 18, React Router, Tailwind, Radix UI, i18next |
| Database | `src/db/` | MySQL pool + migrations sequenciais |
| API Registry | `src/routes/index.js` | Factory que monta os recursos em `/api` |
| Legacy Frontend | `temp-build/` | Nao usar para novas alteracoes |

## Build, Execucao e Lint

```bash
# Root (backend)
npm run dev
npm start
npm run build
npm run lint

# Frontend
cd web && npm run dev
cd web && npm run build
cd web && npm run start
cd web && npm run lint
```

Observacao: nao ha framework de testes configurado no momento.

## Convencoes

### Backend

- ES modules (`import`/`export`) em todo `src/`.
- Rotas em kebab-case em `src/routes/`.
- Sanitizacao de entrada antes de escrita com `src/lib/sanitizeInput.js`.
- Autenticacao em `src/middleware/auth.js`.
- Autorizacao por permissao em `src/middleware/checkPermission.js`.
- Permissoes no token no formato `resource:action`.

### Frontend

- Pages em PascalCase em `web/src/pages/`.
- Components em PascalCase em `web/src/components/`.
- Hooks em camelCase com prefixo `use` em `web/src/hooks/`.
- Forms com React Hook Form + Zod.
- Idiomas em `web/src/locales/{pt-BR,pt,en,es}/translation.json`.
- Locale padrao `pt-BR`, chave de persistencia `im_lang`.

### Database

- MySQL com charset/collation utf8mb4.
- Criar migrations com prefixo sequencial seguinte.
- Base RBAC inicial em `src/db/migrations/001_rbac_schema.sql`.

## Mapa de Rotas Frontend

Fonte: `web/src/App.jsx`

- `/`
- `/sobre`
- `/servicos`
- `/servicos/:slug`
- `/resultados`
- `/blog`
- `/blog/:slug`
- `/contato`
- `/faq`
- `/politica-de-privacidade`
- `/termos-de-uso`
- `/login`
- `/unauthorized`
- `/admin` (protegida por permissao)
- `*` fallback 404

## Mapa da API Backend

Prefixo global da API: `/api` (montagem em `src/main.js`).

Registro central: `src/routes/index.js`

Recursos montados:

- `/api/health`
- `/api/auth`
- `/api/galeria`
- `/api/galeria-temas`
- `/api/depoimentos`
- `/api/agendamentos`
- `/api/artigos`
- `/api/blog-categorias`
- `/api/servicos`
- `/api/estatisticas`
- `/api/contato-config`
- `/api/hero-presets`
- `/api/sobre-config`
- `/api/pages-config`
- `/api/audit-logs`
- `/api/seo-settings`
- `/api/roles`
- `/api/permissions`
- `/api/users`
- `/api/settings`
- `/api/traducoes`
- `/api/utils`
- `/api/faq`

Montagens especiais:

- Upload: `POST /api/upload/:folder` em `src/routes/uploads.js`
- Hero config: `/api/hero-config` montada em `src/main.js`
- Sitemap: `GET /sitemap.xml` em `src/routes/sitemap.js`

## Mapa de Abas e Permissoes do Admin

Fonte: `web/src/features/admin/constants/navigation.js`

- `overview` -> `dashboard:read`
- `bookings` -> `leads:read`
- `services` -> `blog:read`
- `gallery` -> `gallery:read`
- `blog` -> `blog:read`
- `testimonials` -> `testimonials:read`
- `faq` -> `dashboard:read`
- `stats` -> `dashboard:read`
- `users` -> `users:read`
- `contact` -> `dashboard:read`
- `branding` -> `dashboard:read`
- `seo` -> `dashboard:read`
- `hero` -> `dashboard:read`
- `pages` -> `dashboard:read`
- `sobre` -> `dashboard:read`
- `settings` -> `dashboard:read`

## Fluxo RBAC

- Login em `src/routes/auth.js` valida usuario/senha, carrega permissoes e emite JWT.
- JWT carrega `permissions[]` no formato `resource:action`.
- Middleware de auth popula `req.user`.
- Middleware de permissao bloqueia/acessa recursos por `resource` e `action`.

## Notas de Seguranca e Infra

- Compression ativa em `src/main.js`.
- Helmet + CSP ativos em `src/main.js`.
- Redirect HTTP->HTTPS em producao via `x-forwarded-proto`.
- Login com rate limit (10 tentativas/15 min).
- API/admin com noindex para robots.
- Upload autenticado com sanitizacao SVG em `src/routes/uploads.js`.

## Variaveis de Ambiente

Backend:

- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

Frontend:

- `VITE_API_URL`

## Checklist Operacional

Pre-deploy:

- Confirmar variaveis de ambiente obrigatorias.
- Confirmar migrations aplicadas em ordem.

Deploy:

- Executar `npm run build` na raiz.
- Subir backend com `npm start`.

Smoke test:

- `GET /api/health`
- Login admin
- Navegacao publica basica
- Upload de imagem no admin
- `GET /sitemap.xml`

Rollback:

- Restaurar versao anterior da aplicacao.
- Em banco, preferir correcao forward por nova migration.

## Prompt de Continuidade

Em retomadas de sessao, usar este arquivo como fonte primaria de contexto.

Sempre validar impacto em:

- `src/routes/`
- `src/middleware/`
- `web/src/App.jsx`
- `web/src/lib/apiServerClient.js`
- `web/src/pages/AdminDashboard.jsx`
- `src/db/migrations/`
