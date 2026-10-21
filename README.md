# VITRYNE

Plataforma de lojas online para vendedores angolanos de roupa e calçado. O cliente escolhe tamanho e cor e pede no WhatsApp do vendedor. A tua loja. O teu mundo.

## Como correr

```bash
npm install
cp .env.example .env.local   # preenche as chaves do Supabase
npm run dev
```

Abre http://localhost:3000.

## Supabase

1. Cria um projecto em supabase.com e copia o URL e a chave pública (`sb_publishable_...`) para `.env.local`.
2. Corre as migrações de `supabase/migrations/` por ordem (SQL Editor ou CLI).
3. Em Authentication > Providers > Email, decide se exiges confirmação de email.

A leitura pública só devolve lojas e produtos activos. Cada vendedor só vê e edita o que é seu (RLS ligado em todas as tabelas). As fotos ficam no bucket público `vitryne`, com escrita só do dono, na pasta com o seu id.

## Publicar na Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

Na primeira vez, a CLI cria o projecto. Define em Settings > Environment Variables as duas chaves do Supabase. `NEXT_PUBLIC_SITE_URL` só é preciso com domínio próprio; sem ela, o site usa o domínio `.vercel.app` do projecto.

No Supabase, em Authentication > URL Configuration, põe o endereço publicado em Site URL e acrescenta `https://<o-teu-dominio>/**` em Redirect URLs, para os emails de confirmação voltarem ao site.

## Rotas

- `/` página da VITRYNE
- `/[loja]` montra da loja
- `/[loja]/[produto]` ficha do produto com o botão "Pedir no WhatsApp"
- `/entrar`, `/registo` e `/painel` (protegido por login)

Loja de exemplo: `/kianda-style`.

## Estrutura

- `app/` rotas e acções do servidor (`app/painel/actions.ts`)
- `components/` interface
- `lib/` dados, formatação de preços, mensagem do WhatsApp, clientes Supabase
- `proxy.ts` renova a sessão e protege o painel
- `supabase/migrations/` esquema da base de dados
- `brand/` logótipo (símbolo, horizontal, favicon)
