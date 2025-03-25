# Usa a imagem do Node.js como base
FROM node:alpine

# Define o diretório de trabalho dentro do container
WORKDIR /api

RUN npm install -g pnpm

# Copia apenas o package.json para instalar as dependências primeiro
COPY package.json ./

# Instala as dependências
RUN pnpm install 

# Copia o restante dos arquivos do projeto para dentro do container
COPY . .

# Expõe a porta 5000 para o container
EXPOSE 5000

# Comando para rodar o aplicativo
CMD ["pnpm", "run", "dev"]