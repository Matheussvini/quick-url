import { app } from "./app";
import { env } from "./env";
app
  .listen({
    host: "0.0.0.0", // importante para que funcione com outros frontend
    port: env.PORT,
  })
  .then(() => {
    console.log("🚀 HTTP Server URLS running!");
  });
