# Emprest.AI Backend

API REST criada com NestJS.

## Requisitos

- Node.js 20.11.1 ou superior
- npm

## Executar

```bash
npm install
npm run prisma:generate
npm run start:dev
```

A API fica disponível em `http://localhost:3000`. A porta pode ser alterada pela variável de ambiente `PORT`.

Crie `.env.local` a partir de `.env.example` e configure `DATABASE_URL`,
`SUPABASE_URL` e `SUPABASE_ANON_KEY`. Use somente a chave pública anon/
publishable do Supabase; o Backend valida o access token com Supabase Auth e
encaminha a identidade à transação PostgreSQL para preservar RLS.

### Endpoints autenticados

- `GET /api/equipment` lista o catálogo real e as URLs de imagem/atribuição.
- `GET /api/loans` lista somente os empréstimos abertos do usuário autenticado.
- `POST /api/loans` cria imediatamente um empréstimo disponível.

Todos exigem `Authorization: Bearer <access-token-do-Supabase>`. O pedido de
empréstimo aplica o limite, o bloqueio por atraso, o prazo de 14 dias corridos
e a concorrência atômica no banco pela função `public.request_loan`.

### Endpoint de verificação

`GET /` retorna:

```json
{
  "message": "Hello World!"
}
```

Para gerar e iniciar a versão compilada:

```bash
npm run build
npm start
```

## Prisma e carga inicial

1. Copie `.env.example` para `.env.local` e configure `DATABASE_URL` localmente.
   Não compartilhe nem versione o valor real; não use uma URL de produção nos
   comandos locais.
2. Gere o Prisma Client:

   ```bash
   npm run prisma:generate
   ```

3. Após confirmar que `.env.local` aponta para o Supabase local e autorizar a
   operação, crie a migration sem aplicá-la:

   ```bash
   npm run prisma:migrate:create
   ```

4. Após aplicar e revisar a migration no ambiente local, rode os testes e o
   seed local. O seed exige o UUID Auth como argumento e não cria conta nem
   recebe senha:

   ```bash
   npm test
   npm run db:seed -- <uuid-auth>
   ```

Migration, seed e demais escritas em produção ficam sob execução e aprovação
manual da usuária.
