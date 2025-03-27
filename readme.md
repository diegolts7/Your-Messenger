# 📩 Projeto de Mensageria Assíncrona

Este projeto utiliza **Node.js**, **Fastify**, **Prisma** e **Docker** para processar mensagens de forma assíncrona.

## 🚀 Tecnologias Utilizadas

- **Node.js** + TypeScript
- **Fastify** (Framework leve e rápido para APIs)
- **Prisma** (ORM para banco de dados)
- **Docker** (Containers para serviços)
- **Mensageria** (Kafka, RabbitMQ ou outro broker)
- **dotenv** (Gerenciamento de variáveis de ambiente)
- **@tanstack/react-query** (Para cache e reatividade, caso tenha frontend)

---

## 📦 Configuração e Instalação

### 1️⃣ **Clone o repositório**

```bash
  git clone https://github.com/seu-usuario/seu-repositorio.git
  cd seu-repositorio
```

### 2️⃣ **Instale as dependências**

```bash
  pnpm install
```

### 3️⃣ **Configuração do Ambiente**

Crie um arquivo **.env** baseado no modelo **.env.example** e configure as variáveis de ambiente.

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/bd_messeger"
POSTGRES_HOST=database  -- nome do conteiner do banco
POSTGRES_USER= "o user para seu banco"
POSTGRES_PASSWORD= "a senha do seu banco"
POSTGRES_DB= "o nome do seu banco"
POSTGRES_PORT=5432  -- a porta do conteiner do banco
PORT=3000  -- a porta da aplicação
```

### 4️⃣ **Suba os containers com Docker**

```bash
  docker-compose up -d
```

Isso irá iniciar os containers do banco de dados e do broker de mensagens.

### 5️⃣ **Execute as migrações do Prisma**

```bash
  docker exec -it you-messeger bash
  npx prisma migrate dev
```

### 6️⃣ **Inicie o servidor**

```bash
  npm run dev
  # ou
  yarn dev
```

---

## 🛠 Endpoints da API

- **GET** `/messages` → Retorna todas as mensagens processadas.
- **POST** `/messages` → Envia uma nova mensagem para a fila.
- **GET** `/status` → Verifica o status do servidor.

---

## 🔥 Testes

Se houver testes configurados, execute:

```bash
  npm test
  # ou
  yarn test
```

---

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo **LICENSE** para mais detalhes.
