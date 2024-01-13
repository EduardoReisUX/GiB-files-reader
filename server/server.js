import { createServer } from "node:http";

const PORT = 3000;

// curl -i -X OPTIONS -N localhost:3000
// curl -N localhost:3000
export const server = createServer(async (request, response) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  };

  if (request.method === "OPTIONS") {
    response.writeHead(204, headers);
    response.end();
    return;
  }

  response.writeHead(204, headers);
  response.end("ok");
})
  .listen(PORT)
  .on("listening", (_) => console.log(`server is running at ${PORT}`));
