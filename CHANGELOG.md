# Changelog

All notable changes to the OllamoMUI project are documented here.

## [1.1.0](https://github.com/rbkhan007/ollamomui/compare/v1.0.4...v1.1.0) (2026-07-16)


### Features

* add ATS-friendly CV markdown, Facebook link, download CV button on resume page ([5d60370](https://github.com/rbkhan007/ollamomui/commit/5d60370b921247c1e069a17498c5e0d732e0fc53))
* add Deployment Architecture and Auth & Security Flow diagrams ([2ce8bee](https://github.com/rbkhan007/ollamomui/commit/2ce8bee4055ec6699f3e26860211d8828cf95a4f))
* add live database connection indicator dot to navbar (desktop + mobile) ([1a1a002](https://github.com/rbkhan007/ollamomui/commit/1a1a002bec138071f7e23b815dd14006dbf61d5e))
* add visual Feature→Benefit matching section with animated SVG connector lines ([288f73c](https://github.com/rbkhan007/ollamomui/commit/288f73ca7c7a5939f69da9eeea196db36066d11c))
* add Waterfall SDLC diagram to architecture page ([c0146be](https://github.com/rbkhan007/ollamomui/commit/c0146bede27594a8257be7bd81862bf0d1595c14))
* AI Playground with Mermaid diagrams, image rendering, chatbot settings ([b68e2a4](https://github.com/rbkhan007/ollamomui/commit/b68e2a45e66b2b950af512b12e512904b3375bf1))
* **analytics:** add Vercel Speed Insights for Core Web Vitals tracking ([0f49052](https://github.com/rbkhan007/ollamomui/commit/0f49052f7c990c6b921a6858ba89278c44ab792b))
* **ci:** add 6 professional workflows, PR template, CI badges ([cef6db1](https://github.com/rbkhan007/ollamomui/commit/cef6db1544652689e24e7f46e2d4edabf0a810d7))
* colorful gradient SVG icons across homepage — features, steps, clients, CTAs ([af6f759](https://github.com/rbkhan007/ollamomui/commit/af6f75924c52a042195e936dcaf56324f1857209))
* **deploy:** add Dockerfile, docker-compose, nginx config, .env.production template, deployment guide ([5b7a57d](https://github.com/rbkhan007/ollamomui/commit/5b7a57df257648a891bc3e0e5d5dac746fee5e1c))
* **desktop:** add auto-updater with version check, download, and install via UpdateDialog ([a70bb50](https://github.com/rbkhan007/ollamomui/commit/a70bb509644459e99fc8cf6c95e4a8b5dedddc64))
* **desktop:** local PostgreSQL bootstrap and binary fetch script ([104a943](https://github.com/rbkhan007/ollamomui/commit/104a943fe4ff7c5def99a068f2f136b46fd6f082))
* **desktop:** QML async/theme/responsive/i18n refactor, build/launcher updates, docs ([c2da789](https://github.com/rbkhan007/ollamomui/commit/c2da7892bfd90b9e1235b64edfd8c5cbd70440d1))
* **diagrams:** modern notebook-style architecture + RAG pipeline SVGs ([145fa8d](https://github.com/rbkhan007/ollamomui/commit/145fa8df4f12087185c859623d42d3b3476ebf74))
* finalize design system overhaul — Neural Control Panel palette, zero hardcoded colors, 23/23 pages clean ([c920fea](https://github.com/rbkhan007/ollamomui/commit/c920fea3b3d63b561c77054e980b70db4912b9c9))
* **frontend:** add Google Search Console verification meta tag ([ece7b6d](https://github.com/rbkhan007/ollamomui/commit/ece7b6d0372bea883081d2f613fb78c51b76bb84))
* **frontend:** convert to marketing site with pricing/download, public demos, rebrand to OllamoMUI ([ad1f1d9](https://github.com/rbkhan007/ollamomui/commit/ad1f1d9beb3ecfcc5daddae9e08cbcef769f90dd))
* full SEO overhaul — metadata on all pages, OG/Twitter tags, Organization & WebSite schemas, target keywords (ollamomui, Ollama Alternative, free AI) ([46c5312](https://github.com/rbkhan007/ollamomui/commit/46c531288850e2e9415f876a124e505cdc200872))
* implement full design system compliance and React Flow architecture diagrams ([c9482e2](https://github.com/rbkhan007/ollamomui/commit/c9482e29cbd9715ee60beafbc21d8584b7750430))
* inline architecture hero SVG on homepage, add ArchitectureHero component ([e2fd16f](https://github.com/rbkhan007/ollamomui/commit/e2fd16fd8ecaeda0f6c1966f4721e22e4386ae50))
* interactive FlowRenderer with useNodesState + Controls; strip artifacts from chat to placeholders ([6da6c1c](https://github.com/rbkhan007/ollamomui/commit/6da6c1ce1820a40ddb4553e7883143df1bae5e21))
* live React Flow renderer for LLM-generated flow JSON in playground output ([749ba7d](https://github.com/rbkhan007/ollamomui/commit/749ba7d8d2ac08704f128a30dc6b8da5e40e07c7))
* **payment:** add license key generation with SSLCommerz integration, activation endpoint, email delivery ([618d02d](https://github.com/rbkhan007/ollamomui/commit/618d02ddec40a084808209605d031e11364f47fe))
* playground Mermaid diagrams, image rendering, chatbot settings + backend temperature/max_tokens passthrough ([e3c9738](https://github.com/rbkhan007/ollamomui/commit/e3c973823e1a33f6a3b1e85a91b0fcb60295dcab))
* **playground:** build full notebook-style AI workspace with streamed chat, sources panel, and studio generators ([91cf1f4](https://github.com/rbkhan007/ollamomui/commit/91cf1f4d9a5c1c8ceca0492a73f45f7b7e9c4290))
* **playground:** extract Sources/Studio side components, add full CRUD, use app theme background ([6762733](https://github.com/rbkhan007/ollamomui/commit/6762733c4b30e9a0a14255298317b944ba2e91f8))
* **playground:** restructure Studio to 6 OpenRouter AI generators, file-upload sources, rebrand Ollamo Studio ([6707885](https://github.com/rbkhan007/ollamomui/commit/6707885ca1e4ac4c6317a5946934ae6083345bcf))
* portfolio Hire Me pages — architecture, api-docs, status, security, case-study + updated about/download ([52ae070](https://github.com/rbkhan007/ollamomui/commit/52ae0702f7bc6bffa4a69dfb6ae3f4023a2066e1))
* **pricing:** add Stripe Payment Link integration, success/cancel pages, .env.example ([1be955e](https://github.com/rbkhan007/ollamomui/commit/1be955eed8be6206fd5817ae2d2a07c90d0ff245))
* reorganize navbar with inline links + More dropdown ([4a98894](https://github.com/rbkhan007/ollamomui/commit/4a988942730d3e757ec842fa6ca8e6e69b637f11))
* replace SVG connector with @xyflow/react FeatureBenefitSection; fix unicode →; add ClientOnly SSR wrapper ([6a37478](https://github.com/rbkhan007/ollamomui/commit/6a374788ca999068dfc1cb557ac65f54379927f1))
* **sales:** manual license generator, WhatsApp CTA, admin license page ([754fc08](https://github.com/rbkhan007/ollamomui/commit/754fc083e889b2a92a578adafd8bbdb97ba2a8f2))
* SSR-safe FlowRenderer component + artifacts panel for playground ([4b2221e](https://github.com/rbkhan007/ollamomui/commit/4b2221ee80ed966da858b54309b2d3bbc8c2996d))
* sticky header/input + scroll buttons on playground ([8c1a0d8](https://github.com/rbkhan007/ollamomui/commit/8c1a0d86173eb2e70d2f210614d9b8f5721d2e07))
* store indie-dev avatar in NeonDB, serve via /api/media/{key} ([6b23eba](https://github.com/rbkhan007/ollamomui/commit/6b23ebade5d586194ee7ac432494f2e76a96638e))
* Tailwind CSS v4 setup + revamped InteractiveWireframe with 3D tesseract boxes, constellation mesh, animated particles ([d8f671d](https://github.com/rbkhan007/ollamomui/commit/d8f671d670179ba0ebf10a0d3f58c77e3b3306d0))
* **ui:** production-grade UniversalNav with CSS module, improved Footer ([c359817](https://github.com/rbkhan007/ollamomui/commit/c3598170c1f9a1908edea24a46495d2fd12887af))
* upgrade all 4 diagrams — smoothstep edges, group boundaries, legend, observability, error/retry, hidden junctions, protocol labels ([d56a8c0](https://github.com/rbkhan007/ollamomui/commit/d56a8c0277886e7030062829b12529e043248890))
* upgrade to @xyflow/react v12, animated all edges, xy theme ([309b802](https://github.com/rbkhan007/ollamomui/commit/309b80262c69f4d8cfe7d9f0d2cd472424430d30))


### Bug Fixes

* add /api/memory health endpoint, remove auth from db status, fix frontend status check ([91d063e](https://github.com/rbkhan007/ollamomui/commit/91d063efbc0fe481af79346988dd29e4cbf557dd))
* add activate_license() to api_client.py, wire LicensePage ([475339b](https://github.com/rbkhan007/ollamomui/commit/475339b9051b779120e173e09b9e05afa0fee161))
* add missing import sys in db.py, add /api/settings/database backend endpoints, fix PUT body parsing ([627cf0c](https://github.com/rbkhan007/ollamomui/commit/627cf0cdd93e460f0fed0f74c60dfe49b219a99a))
* add ScrollToTop component + scroll-padding-top: 80px for navbar-safe anchor scroll ([77d355f](https://github.com/rbkhan007/ollamomui/commit/77d355f5aefd72165798a059eeabb54c565a3a0b))
* **audit:** localStorage try-catch, config-driven BACKEND_URL, remove dead Navbar.tsx ([5fc1713](https://github.com/rbkhan007/ollamomui/commit/5fc1713b8296d672f4ce4fb247c45c09d50a7982))
* **backend:** configure CORS/ACL at import time so Vercel frontend is allowed (Render import case) ([250a9eb](https://github.com/rbkhan007/ollamomui/commit/250a9eb6b909214301bab04765a07873773a923c))
* **backend:** insert raw_key in _save_license, add admin license endpoint, wire memory monitor ([0531efd](https://github.com/rbkhan007/ollamomui/commit/0531efde7009a0ce5c2997d6badd8ca7502f227b))
* bump mobile about page version from v1.0.0 to v1.0.4 ([32fe11b](https://github.com/rbkhan007/ollamomui/commit/32fe11b4ffd1b87715cad16a09773881cde9606c))
* **ci:** full pipeline hardening - release APK continue-on-error, npm publish guard ([7588ccc](https://github.com/rbkhan007/ollamomui/commit/7588ccc124f735d2e9d511b4a5674cafa39c627c))
* **ci:** green pipeline - ruff 0 errors, remove stale workflows, per-file-ignores ([5ed73a5](https://github.com/rbkhan007/ollamomui/commit/5ed73a57cd9ef3dc5cb1b88acf40229632a66f66))
* **ci:** robust test with health check, static Lighthouse, CI badges in README ([ee0d0a3](https://github.com/rbkhan007/ollamomui/commit/ee0d0a3179388c5b38722a05cc37e6c265b76904))
* **components:** collapse neural proxy hub grid on mobile, add a11y/escape to nav mobile menu ([07b8f97](https://github.com/rbkhan007/ollamomui/commit/07b8f97f70cc893872f9f7e9aee3ca326c660d4c))
* **deploy:** vercel.json security headers, .env SITE_URL, sitemap expansion ([4fc5ca5](https://github.com/rbkhan007/ollamomui/commit/4fc5ca5d7307b079837cdcd1b9d8e82d4e6aa6f7))
* design quality audit — theme breaks, responsive padding, CSS variables ([ecc84d8](https://github.com/rbkhan007/ollamomui/commit/ecc84d8e6f65b931c0288683254d1e604dcea399))
* **desktop:** GUI fixes – import paths, Theme, ApiClient @Slots, SettingsPage import order ([7bbd5b8](https://github.com/rbkhan007/ollamomui/commit/7bbd5b8df88f0853709cb1ad9eaac13dddad4551))
* enlarge indie-dev avatar to 117x127 on About page ([a0b64ed](https://github.com/rbkhan007/ollamomui/commit/a0b64ed1fe91791bd07140ff92395846332868b0))
* **frontend:** use named import for BrandIcon to fix next build type error ([e051699](https://github.com/rbkhan007/ollamomui/commit/e05169997712fee92768da8babcf3012fb7ae881))
* hero section — max-width container, color-mix alpha vars, gradient-text fix, theme-adaptive badges/buttons ([db96854](https://github.com/rbkhan007/ollamomui/commit/db968544d6155157e505222fb61f351414d74568))
* import Request in acl.py, support Render  env var ([8a67166](https://github.com/rbkhan007/ollamomui/commit/8a6716646c6490b49c8be2f0ce578e354400de8f))
* **lighthouse:** audit live Vercel URL, continue-on-error ([a8d207a](https://github.com/rbkhan007/ollamomui/commit/a8d207a51a4b89cc1ea1c5566c33756457e83642))
* mobile menu z-index, slide-in animation, responsive content padding ([abcdc73](https://github.com/rbkhan007/ollamomui/commit/abcdc73a21dd91cf78653269dc5ddfbf0d2925dd))
* move vercel.json into frontend/ for Vercel project rootDirectory setting ([bd8e24c](https://github.com/rbkhan007/ollamomui/commit/bd8e24c4e259ad6491917c2e0296cb0ffcbfe8d5))
* **nav:** mobile visibility - solid bg fallback, z-index for menu overlay ([669a4cb](https://github.com/rbkhan007/ollamomui/commit/669a4cb7061e367caed3ac17095f078a2ad87436))
* prevent preload warnings and 404 console errors ([960d075](https://github.com/rbkhan007/ollamomui/commit/960d075b8914f403ee23a9e2cba6beee747e64ec))
* re-add InteractiveWireframe to homepage with TS build fix (removed xmlns from foreignObject divs) ([bf81e90](https://github.com/rbkhan007/ollamomui/commit/bf81e9028c4bbbfa9ab4c3972923e14ddeab96a1))
* **release-please:** add config/manifest files, checkout step ([3ab2fcc](https://github.com/rbkhan007/ollamomui/commit/3ab2fcc2547893dd0f59f1bbddaa90d40ca25dcd))
* remove hardcoded secrets flagged by GitHub secret scanning ([8046683](https://github.com/rbkhan007/ollamomui/commit/804668312891cefb6f5496e35167e0c98b2f4ee5))
* remove rewrite conflict, add security headers, update email to rbkhan00009, add lint/type-check scripts ([898d6a4](https://github.com/rbkhan007/ollamomui/commit/898d6a4df0a418ea497c6c9504463bcc3f4dd289))
* remove stale public/sitemap.xml (conflicted with app/sitemap.ts, had dead routes /login /usage). Google can now read fresh generated sitemap. ([5d4fdcf](https://github.com/rbkhan007/ollamomui/commit/5d4fdcf987d96a6f3187c70f62da090d975c9f5c))
* responsive sizing across all pages for mobile/tablet ([177bfde](https://github.com/rbkhan007/ollamomui/commit/177bfded3ec26e889c4f5a7848c642270a222563))
* root route returns API info instead of 'Frontend not built' error ([24d27d3](https://github.com/rbkhan007/ollamomui/commit/24d27d310d307653e1faa21c9de0f72ff8bcd64f))
* security audit fixes + NeonDB integration ([222d31e](https://github.com/rbkhan007/ollamomui/commit/222d31e035eb305f8c16656e5d4862a950fed06a))
* simplify InteractiveWireframe visual effects and remove extra layers per request (remove complex filters, animations, text labels) ([f6a7590](https://github.com/rbkhan007/ollamomui/commit/f6a759085475987af9a62f2be2310153fb38af87))
* **theme:** replace all hardcoded text colors with CSS variables for theme compatibility ([baca007](https://github.com/rbkhan007/ollamomui/commit/baca007960163401d3e3f0faf9e38397d5957167))
* **ui:** responsive nav (3-bar burger, fullscreen dropdown), theme-correct colors, clamp() padding ([fab11f4](https://github.com/rbkhan007/ollamomui/commit/fab11f4f3ba32159924b63338c37e41cf5ad6870))
* use /api/memory/stats for status check (works on current Render) ([91fd880](https://github.com/rbkhan007/ollamomui/commit/91fd880dc6253256e44096610e637f268e482c0e))
* use local Rhasan@dev.jpg instead of NeonDB API on About page ([86265f3](https://github.com/rbkhan007/ollamomui/commit/86265f340a854f0e68b0b1c25aec9ba6a122f6ee))
* **vercel:** remove invalid rootDirectory property that broke all builds ([693551e](https://github.com/rbkhan007/ollamomui/commit/693551e070ce5c42d21e1450d9585e785b5f44a2))


### Performance Improvements

* enable Turbopack for faster dev/build; verify instant theme toggle (beforeInteractive init) and all pages 200 ([90039ff](https://github.com/rbkhan007/ollamomui/commit/90039ff044e6f288e12c82aa0f9487704ca7f4f3))
* lucide icons, scroll fixes, ReactFlow custom edges, memo optimizations ([1da1db1](https://github.com/rbkhan007/ollamomui/commit/1da1db1aff80a8e4d7048fceccf2f256ccc40a56))
* preconnect/dns-prefetch hints, mobile touch targets (min-height:44px), overscroll-behavior, BreadcrumbList schemas, sitemap expansion, SoftwareApp screenshot field ([d056b7c](https://github.com/rbkhan007/ollamomui/commit/d056b7c86918d046fd225cd299c2b5ec5145172e))


### Documentation

* add accurate execution guide for remaining launch steps ([25fc837](https://github.com/rbkhan007/ollamomui/commit/25fc837664a6d8b88bed641d59b3ec2041a3c3bf))
* add Mermaid diagrams to README, docs/API.md, docs/SECURITY.md — system arch, request flow, deployment, security pillars ([e9c1fed](https://github.com/rbkhan007/ollamomui/commit/e9c1fed9f54076f19b946da37b9ff5324dd62c5e))
* fix stale references across README, docs, CHANGELOG (ollama_emu_desktop.py, build_exe.bat, broken requirements, Lemon Squeezy framing) ([54aca8e](https://github.com/rbkhan007/ollamomui/commit/54aca8eb9f4ec653b0b2f4a2cb46402171812713))
* improve README mermaid diagrams for reliable GitHub rendering (quoted labels, balanced subgraphs) ([93bcb54](https://github.com/rbkhan007/ollamomui/commit/93bcb54fe1393473410c578856d1fc7a001bcdce))
* qualify Lemon Squeezy as optional since manual WhatsApp sales works ([c9ccc38](https://github.com/rbkhan007/ollamomui/commit/c9ccc38d0edf2a65465fdfae725cd3c72e98d55c))
* **readme:** add Work Log section (responsive overhaul, Settings page, CORS fix, deploy fixes) ([5b94f72](https://github.com/rbkhan007/ollamomui/commit/5b94f7248364bd6daf1fcdbe7360773853fe1f79))
* rewrite README for portfolio/hire-me positioning — new pages, security pillars, repo details updated ([8557364](https://github.com/rbkhan007/ollamomui/commit/8557364ed5a027d38e6f7822b0e57b59926ddd61))
* update CHANGELOG, README, desktop README with GUI fixes and build details ([17c2eae](https://github.com/rbkhan007/ollamomui/commit/17c2eaec4c21494050055a60bc47de5cf0731ce9))
* update HANDOFF.md with session 2 worklog (ReactFlow v12, animated edges) ([c19ba6b](https://github.com/rbkhan007/ollamomui/commit/c19ba6bf6e0a86bc62f9f9ea41d75fc606e68f57))
* update HANDOFF.md with session 3 (status fixes, playground UX) ([24f35a3](https://github.com/rbkhan007/ollamomui/commit/24f35a3bc9cbc405a589b2778c25755e5d6c0867))
* update README — resume route, playground status, 23 pages, work log ([d7a509c](https://github.com/rbkhan007/ollamomui/commit/d7a509c80ce6e5884cacd2f90fac9c17f644d675))

## [1.0.5] — Unreleased

### Fixed
- Switched the PostgreSQL driver from `psycopg2-binary` to `psycopg` (v3) to resolve TLS
  handshake failures against Neon's connection pooler.
- `TrustedHostMiddleware` now allows deployment hostnames (Render/Vercel/custom domains) and is
  configurable via `ALLOWED_HOSTS`, so the Render health check passes.
- `setup_env.py` merges with existing Render env vars instead of overwriting them.
- Database pool now degrades gracefully when PostgreSQL is unavailable.
- Fixed frontend `next build` type error: `Navbar.tsx` now uses a named import for `BrandIcon` (it was a default import that broke the static export).
- Fixed `desktop/requirements.txt` broken `file:///${PROJECT_ROOT}` editable reference; the `ollamomui` package is now installed from the repo root (`pip install -e .`).
- Fixed documentation references to the non-existent `ollama_emu_desktop.py` (now `desktop/src/launcher.py` / `python -m ollama_emu.main`) and `build_exe.bat` (now `python desktop/build.py --onefile`).
- **Desktop GUI** — 3 root-cause bugs resolved:
  - `qml_engine.py` now adds `pages/` to the QML import path, so all page types resolve at load time.
  - `api_client.py` gained a `base_url` Q_PROPERTY with `NOTIFY`, a `token_changed` signal, and **28 `@Slot` camelCase wrappers** (`getUsage`, `getModelList`, `getMemoryMessages`, etc.) so every QML page can call its data-fetching methods directly.
  - `Theme.qml` `dark` property now binds to `themeManager.darkTheme` instead of hardcoding `true`, making the dark/light toggle functional.
  - `import OllamoMUI 1.0` added to all QML pages and components (fixes unresolved `Theme.*` references).
  - `SettingsPage.qml` import order fixed (`QtQuick.Dialogs 1.3` before `QtQuick.Controls 2.15`) to avoid `Dialog` type shadowing.
  - `HomePage.qml` "Launch Playground" nav target corrected from index 1 (Register) to index 3 (Playground).
  - `RAGPage.qml` added `Qt.labs.platform 1.0` import for `FileDialog`.
- Desktop EXE verified building on Python 3.14 / PySide6 6.11 via `python desktop/build.py --onefile` (374 MB output).

### Changed
- Payments & licensing migrated from SSLCommerz/Stripe to **Lemon Squeezy** as the primary provider.
- Documentation, README, and brand references updated to Lemon Squeezy.
- Manual WhatsApp sales pipeline is the active licensing path; Lemon Squeezy remains an optional, not-yet-live payment provider.
- Test instructions corrected: the suite is a standalone script (`python backend/tests/test_api.py --online`), not `pytest`.
- Desktop EXE auto-updater config points to GitHub Releases for update checks.

## [1.0.4] — 2026-07-12

### Changed
- Rebranded to **OllamoMUI** – new name, logo, and identity
- Updated all documentation and references

## [1.0.2] — 2026-07-12

### Added
- Full CRUD operations for all data models (providers, users, memory, RAG)
- New endpoints: `PUT /api/providers/{name}`, `GET/PUT/DELETE /api/users/{email}`, `DELETE /api/memory/messages/{msg_id}`, `GET /api/rag/chunks/{doc_id}`, `PUT /api/rag/chunks/{chunk_id}`
- Export/Import system: `GET /api/export`, `POST /api/import`
- Auto-refresh free model list from OpenRouter (`GET /api/models/free`)
- Re-embed single chunk on content update (`rag.reembed_chunk`)
- Desktop QML client with PySide6
  - Toast notification system
  - Progress spinner indicators
  - Keyboard shortcuts (Ctrl+1-9 navigation, Ctrl+Return send, Ctrl+N new chat)
  - Export/Import data dialogs in Settings
- Desktop QML pages: Login, Register, Home, Playground, Usage, Settings, RAG, Memory, Terminal
- Desktop sidebar with theme toggle and account navigation
- API Client in `api_client.py` — 40+ methods matching all backend endpoints

### Changed
- Pydantic models now have `field_validator` constraints on all inputs
- Unified error response format: `{"detail": "..."}` across all endpoints
- Added `RequestValidationError` handler for consistent 422 responses
- Added `ValueError` and connection error handlers in global exception handler
- QML import paths configured in `qml_engine.py` for component resolution
- `UsagePage.qml` uses correct `/api/usage/stats` endpoint

### Fixed
- autoflake cleanup: removed unused imports across `backend/src/` and `desktop/src/`
- `ConfigRequest` model has provider name validation
- Provider update now validates `auth_type` and `type` fields
- `MemorySearchRequest` validates query length and limit
- `MemoryFactRequest` validates fact, importance, session_id
- `UserUpdateRequest` validates role against allowed values
- `RagChunkUpdateRequest` validates content length
- `AuthRequest` validates email and password at model level
- Chunk re-embedding updates both `rag_chunks.embedding` and `rag_fts` FTS index

### Database
- PostgreSQL schema unchanged (v1)
- New Python methods: `get_provider`, `update_provider`, `load_all_users`, `update_user_role`, `delete_user`, `get_memory_message`, `delete_memory_message`, `clear_all_messages`, `get_rag_document`, `list_rag_chunks`, `update_rag_chunk`, `get_usage_stats`

## [1.0.1] — 2026-07-10

### Added
- Professional Python package restructure (`backend/src/ollama_emu/`)
- `pyproject.toml` with installable package configuration
- Launcher scripts for Windows and Unix (`run.bat`, `run.sh`, `ollamaemu.bat`, `ollamaemu.sh`)
- PyInstaller EXE build script (`build.py`)
- Documentation directory with README, SECURITY, MOBILE, ASSETS docs
- Resource directory with branding assets (SVG icons, favicons, diagrams)
- Configs directory with `.env.example`, `setup_database.sql`, CI configs
- `__init__.py` with package version (`1.0.2`)

### Changed
- All imports updated to `ollama_emu.*` package paths
- All launcher scripts use `-m ollama_emu.main` module entry
- Test script starts server via `python -m ollama_emu.main`

### Fixed
- Password update bug: now uses `UPDATE` instead of `INSERT ON CONFLICT DO NOTHING`
- Admin email default unified to `admin@localhost` across `acl.py` and `db.py`
- Dead files removed from git (Prisma, platform-tools, stale Next.js files)
- Duplicate `import re` removed
- Duplicate `ip` assignment removed in login endpoint
- `setup_database.sql` seed data synced with `DEFAULT_PROVIDERS`
- Memory search changed from `AND` to `OR` for better recall

## [1.0.0] — 2026-07-08

### Added
- Initial release of OllamoMUI
- FastAPI backend with PostgreSQL + pgvector
- Multi-provider support: OpenAI, Anthropic, Gemini, OpenRouter, Groq, DeepSeek, Mistral, Together
- RAG engine (TF-IDF, sentence-transformers, OpenAI embedding backends)
- Memory system with session-based message storage
- ACL with RBAC, rate limiting, API key management, IP filtering
- Next.js web frontend with dark/light theme
- React Native mobile app (Expo)
- GitHub Pages deployment workflow
- pgvector HNSW/IVFFlat indexing for vector search
