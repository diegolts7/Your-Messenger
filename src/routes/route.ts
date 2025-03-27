import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { UserRoutes } from "./user/user.routes";
import { AuthRoutes } from "./auth/auth.routes";
import { MessageRoutes } from "./message/message.routes";

const app = Fastify({
  logger: true,
});

// permitindo os metodos acessores na minha aplicação

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

//configurando o jwt

const secret = process.env.JWT_SECRET;

if (!secret) throw new Error("JWT não está definido");

app.register(fastifyJwt, {
  secret,
});

// função principal que abriga todas as rotas da aplicação

const routes = () => {
  AuthRoutes.register(app, "/auth");
  UserRoutes.register(app, "/users");
  MessageRoutes.register(app, "/messages");
};

app.register(routes, { prefix: "/api" });

export { app };
