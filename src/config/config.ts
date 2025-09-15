import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    port: Number(process.env.SERVER_PORT) || 4000,
  },
  db: {
    uri: process.env.DB_URI,
    password: process.env.DB_PASSWORD,
  },
  router: {
    v1: "/api/v1",
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
  },
  uploads: {
    pizzas: "uploads/pizzas",
  },
};

export default config;
