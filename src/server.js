const Hapi = require("@hapi/hapi");
const routes = require("./routes");

const servInit = async () => {
  const server = Hapi.server({
    port: 5000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route(routes);

  await server.start();
};

servInit();