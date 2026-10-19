# ADR-001 — Stack

## Decisões

| Item | Escolha |
| --- | --- |
| Host | Supabase |
| Front | TypeScript, React |
| Back | TypeScript, Nest |
| ORM | Prisma, ZOD |
| Autenticação | RLS |
| Autorização | Supabase |
| Banco | Postgres (Supabase) |
| API | REST, MVC |
| Testes | Jest, Migration |

## Justificativa

- **Host → Supabase** — o host fica do lado do banco e da autenticação, que já são Supabase, em vez de virar mais um provedor para cuidar.


- **Front → TypeScript e React** — TypeScript pela mesma linguagem da API, e React porque a interface precisa de uma biblioteca e é essa que entra.



- **Back → TypeScript e Nest** — TypeScript pela mesma linguagem do front, e Nest porque o back precisa de um framework e a estrutura de camadas já vem nele.



- **ORM → Prisma e ZOD** — Prisma porque o schema e o acesso ao banco saem da mesma ferramenta, e ZOD porque valida o que entra e sai na borda da API.



- **Autenticação → RLS** — a regra de quem acessa o quê fica no banco;não fica checagem espalhada na API.



- **Autorização → Supabase** — identidade e permissão ficam no mesmo lugar do host e do banco.


- **Banco → Postgres (Supabase)** — o banco é o que o Supabase entrega, sem operar servidor de banco.


- **API → REST e MVC** — REST porque o modelo de recurso casa com o CRUD que domina o app, e MVC porque cada endpoint sabe em que camada mora.


- **Testes → Jest e Migration** — Jest porque a suíte de testes é uma só e roda nele, e Migration porque a mudança de schema anda versionada junto com o código.

## Alternativas descartadas

| Alternativa | Motivo do descarte |
| --- | --- |
| Vercel, Railway, Fly.io (host) | o host ficaria num provedor e o banco e a auth em outro;seria mais um serviço para integrar |
| Vue, Angular, Svelte (front) |a biblioteca de UI já é decidida;não muda o problema de interface |
| JavaScript puro (front e back) |sem TypeScript o tipo da API não chega do outro lado sem reescrever |
| Express, Fastify (back) | entregam só o HTTP;a estrutura de MVC e injeção de dependência teria que ser montada na mão |
| TypeORM, Knex, Drizzle (ORM) | acesso ao banco e validação já ficam no Prisma + ZOD;dividir schema entre ferramentas diverge sem ninguém notar |
| Joi, Yup (validação) |a entrada e a saída já usam o mesmo schema (ZOD);mais uma biblioteca de validação é mais um formato para manter |
| Auth0, Clerk (autenticação) |a identidade já fica no Supabase;mais um provedor externo é mais uma integração para manter |
| MySQL, MongoDB (banco) |o banco é o Postgres que o Supabase entrega;sair disso é trocar banco e provedor ao mesmo tempo |
| GraphQL, tRPC (API) |REST já é o contrato decidido;GraphQL e tRPC trazem schema, resolver e cache sem volume de tela que pague isso |
| Código sem camadas (API) |sem um padrão de organização, cada endpoint vira um jeito diferente de fazer a mesma coisa |
| Vitest (testes) |a suíte já é decidida com Jest;segunda suíte em paralelo é pipeline duplicado |
| Migration na mão, SQL solto |dois donos de schema no mesmo banco se sobrescrevem;ficar versionado no Prisma é ter um dono só |

## Consequências

**Fica mais fácil**

- front e back em TypeScript: o tipo e o código de validação circulam entre os dois sem reescrever.
- banco, auth, autorização e host no mesmo provedor: menos integração entre serviços diferentes.
- RLS no banco + autorização no Supabase: a regra de acesso tem um lugar só, em vez de `if` espalhado pela API.
- Nest e MVC:o caminho de cada request é conhecido;não se discute onde cada arquivo mora.
- ZOD na borda:o que a API aceita é o que o front já conhece.

**Fica mais difícil**

- RLS exige pensar e testar as policies;erro de permissão aparece do lado do banco, não da API.
- o ritmo de recurso e preço é o do Supabase, não o nosso;se ele mudar algo, o projeto muda junto.
- MVC vira obrigação:fluxo fora do padrão (job, notificação, processo longo) tem que se adaptar à estrutura em vez de nascer solto.
- Migration versionada:adicionar coluna exige passar pelo fluxo de migration + validação de schema;não dá para só rodar um script.

**Impede de fazer depois sem custo**

- sair do Supabase: banco, RLS, autorização e host estão todos no mesmo provedor.
- adotar GraphQL ou tRPC depois:a API já nasce REST/MVC.
- trocar de ORM:o schema e a migration estão no Prisma.
- trocar React ou Nest depois:a camada de UI e a estrutura de camadas já são escritas neles.

## O que este ADR NÃO decide

- build e dev server do front (não decidido)
- roteamento no front (não decidido)
- estado de servidor e de cliente no front (não decidido)
- estilização e biblioteca de componentes (não decidido)
- as regras exatas do RLS e da autorização por papel (não decidido)
- CI/CD (não decidido)
- observabilidade/logs (não decidido)
- estratégia de backup e recuperação (não decidido)
- modelagem de domínio e tabelas (não decidido)
- qualquer item que não está na tabela de decisões fica **não decidido** até um ADR novo