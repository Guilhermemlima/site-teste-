# Memórias do Casal ♥

Sistema web privado para organizar informações, preferências, datas importantes,
fotos e lembranças de uma pessoa especial. Feito com Next.js (App Router),
Tailwind CSS e Supabase (banco de dados + storage de imagens).

> Conteúdo pessoal, sensível e de acesso restrito. Use apenas com o consentimento
> de todas as pessoas envolvidas.

## Stack

- **Next.js 14** (App Router, Server Actions, Server Components)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Postgres + Storage) — acessado apenas pelo servidor, via
  service role key
- **jose** (JWT) para sessão de login, **bcryptjs** para hash de senha
- **Vercel** para deploy

## Como funciona a segurança

- O app nunca usa a chave pública (`anon key`) do Supabase — todo acesso ao
  banco e ao storage acontece no servidor (Server Components / Server Actions)
  usando a `service role key`, que nunca é exposta ao navegador.
- Row Level Security (RLS) está habilitado em todas as tabelas e **nenhuma
  policy é criada** para as chaves públicas — ou seja, mesmo que a chave anon
  vaze, ninguém consegue ler ou escrever nada além do próprio backend.
- O bucket de imagens é **privado**. As imagens nunca têm URL pública — o
  servidor gera *Signed URLs* de curta duração (30 minutos) sempre que uma
  página precisa exibir uma foto.
- Login principal: senha única, guardada como hash bcrypt (nunca em texto
  puro), validada em um Server Action e liberando um cookie `httpOnly`
  assinado (JWT) por 7 dias.
- Área Privada: exige um segundo PIN, também em hash, com sessão de apenas
  20 minutos, cookie próprio (`httpOnly`) e checagem tanto no `middleware.ts`
  (protege a rota antes mesmo de renderizar) quanto dentro da própria página
  (defesa em profundidade).
- Uploads são validados no servidor: apenas `image/jpeg`, `image/png` e
  `image/webp`, com limite de 8MB por arquivo.
- Todas as páginas têm `robots: { index: false, follow: false }` — não são
  indexadas por buscadores.

## 1. Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, cole e rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql).
   Isso cria todas as tabelas, os triggers de `updated_at` e habilita RLS.
3. Vá em **Storage** → **New bucket**:
   - Nome: `casal-memorias` (ou outro nome — só ajuste `SUPABASE_STORAGE_BUCKET`)
   - **Public bucket: desligado** (o bucket precisa ser privado)
4. Em **Project Settings → API**, copie:
   - `Project URL` → vai em `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` key (⚠️ nunca exponha essa chave no front-end) → vai em
     `SUPABASE_SERVICE_ROLE_KEY`

## 2. Configurar variáveis de ambiente

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Preencha:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_STORAGE_BUCKET=casal-memorias
SESSION_SECRET=...   # string aleatoria longa, ex: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Gere os hashes das duas senhas iniciais (a senha de login e o PIN da área
privada):

```bash
npm install
npm run hash-password "sua-senha-principal"
npm run hash-password "seu-pin-da-area-privada"
```

Cole cada hash gerado em `APP_PASSWORD_HASH` e `PRIVATE_AREA_PASSWORD_HASH`
no `.env.local`. Esses valores só são usados **uma vez**, para popular a
tabela `app_settings` no primeiro acesso — depois disso a senha vive apenas
no banco (em hash) e pode ser trocada pela tela **Configurações** dentro do
sistema.

## 3. Rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000` — você será redirecionado para `/login`.

## 4. Estrutura do projeto

```
app/
  actions/          Server Actions (auth, perfil, preferências, datas, fotos, memórias, presentes)
  (app)/            Rotas protegidas (dashboard, perfil, preferencias, datas, galeria, memorias, presentes, privado, configuracoes)
  login/            Tela de login pública
components/         Componentes de UI reutilizáveis
lib/                Clientes Supabase, auth/sessão, storage, tipos, utilitários de data
supabase/schema.sql Schema completo do banco (tabelas, triggers, RLS)
middleware.ts       Protege todas as rotas exceto /login; segunda camada para /privado/conteudo
scripts/hash-password.js  Utilitário de linha de comando para gerar hashes bcrypt
```

## 5. Funcionalidades

- **Login** com senha em hash + cookie de sessão assinado (JWT/HS256).
- **Dashboard** com atalhos e contagem regressiva das próximas datas importantes.
- **Perfil**: nome, apelido, foto principal, aniversário (com signo calculado
  automaticamente), cidade, início do relacionamento, descrição, como se
  conheceram e observações.
- **Preferências**: comidas/bebidas, presentes, entretenimento e lugares,
  organizados por categoria, com adicionar/editar/excluir.
- **Datas importantes**: título, data, categoria, descrição, foto opcional,
  destaque no dashboard e contagem regressiva automática (recorrente por ano).
- **Galeria de fotos**: upload com validação de tipo/tamanho, categorias,
  favoritar, marcar como privada, visualização em modal com navegação entre
  fotos.
- **Nossas Memórias**: histórias com categoria, emoção, múltiplas fotos e
  opção de marcar como privada.
- **Ideias de presentes**: quadro por status (ideia / comprado / dado), com
  prioridade, preço estimado e link.
- **Área Privada**: PIN extra, aviso de privacidade, fotos e memórias
  privadas nunca aparecem fora dela.
- **Configurações**: trocar a senha principal e o PIN da área privada
  (ambos exigem a senha/PIN atual).
- Tema claro/escuro com preferência salva no navegador.

## 6. Deploy na Vercel

1. Suba o projeto para um repositório Git (GitHub/GitLab/Bitbucket).
2. Em [vercel.com](https://vercel.com), clique em **New Project** e importe
   o repositório.
3. Em **Environment Variables**, adicione as mesmas variáveis do seu
   `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_STORAGE_BUCKET`
   - `SESSION_SECRET`
   - `APP_PASSWORD_HASH` e `PRIVATE_AREA_PASSWORD_HASH` (apenas para o
     primeiro deploy — depois disso pode remover, já que a senha passa a
     viver no banco)
4. Clique em **Deploy**.
5. Depois do primeiro acesso bem-sucedido (que grava as senhas no banco),
   você pode remover `APP_PASSWORD_HASH`/`PRIVATE_AREA_PASSWORD_HASH` das
   variáveis de ambiente da Vercel, se quiser.

## Possíveis melhorias futuras

Ideias que ficaram fora do escopo inicial e podem ser adicionadas depois:
exportação de memórias em PDF, backup automático dos dados, modo
apresentação (slideshow), sistema de tags livres e busca global.
