import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { UserRoutes } from "./user/user.routes";
import { AuthRoutes } from "./auth/auth.routes";
import { MessageRoutes } from "./message/message.routes";
import { errorMiddleware } from "../middlewares/error/Error";
import { isTokenValid } from "../middlewares/auth/isTokenValid";
import ajvErrors from "ajv-errors";

const app = Fastify({
  logger: true,
  ajv: {
    plugins: [ajvErrors], // Se estiver usando ajv-errors
    customOptions: {
      allErrors: true,
    },
  },
});

// 3. Registre outros plugins APÓS o Swagger
app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || "secret",
});
// função principal que abriga todas as rotas da aplicação

const routes = () => {
  AuthRoutes.register(app, "/auth");
  UserRoutes.register(app, "/users");
  MessageRoutes.register(app, "/messages");
};

app.register(routes, { prefix: "/api" });

// middlewares de erro e os demais

app.addHook("onRequest", isTokenValid);
app.setErrorHandler(errorMiddleware);

export { app };
