#!/usr/bin/env node
// npm install fastify@3.2
const fs = require("fs");
const server = require("fastify")();
const graphql = require("mercurius");
const schema = fs
  .readFileSync(__dirname + "/../shared/graphql-schema.gql")
  .toString();
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 4001;
const resolvers = {
  Query: {
    pid: () => process.pid,
    recipe: async (_obj, { id }) => {
      if (id != 42) throw new Error(`recipe ${id} not found`);
      return {
        id,
        name: "Frango frito",
        steps: "Sei la manokkk",
      };
    },
  },
  Recipe: {
    ingredients: async (obj) => {
      return obj.id != 42
        ? []
        : [
            { id: 1, name: "Frango", qtd: "324" },
            { id: 2, name: "Molho", qtd: "32 copos" },
          ];
    },
  },
};
server
  .register(graphql, { schema, resolvers, graphiql: true })
  .listen(PORT, HOST, () => {
    console.log("running at " + HOST + " " + PORT);
  });
