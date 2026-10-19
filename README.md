# Emprest.AI Backend

API REST criada com NestJS.

## Requisitos

- Node.js 20.11.1 ou superior
- npm

## Executar

```bash
npm install
npm run start:dev
```

A API fica disponível em `http://localhost:3000`. A porta pode ser alterada pela variável de ambiente `PORT`.

### Endpoint

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
