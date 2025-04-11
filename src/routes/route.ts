import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { UserRoutes } from "./user/user.routes";
import { AuthRoutes } from "./auth/auth.routes";
import { MessageRoutes } from "./message/message.routes";
import { errorMiddleware } from "../middlewares/error/Error";
import { isTokenValid } from "../middlewares/auth/isTokenValid";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

const app = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// 3. Registrando o Swagger

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "You Messenger API",
      description:
        "API de mensageria focada em aprender conceitos de back-end e estudar mais sobre.",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/api/docs",
});

// liberando o cors e configurando o token
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
