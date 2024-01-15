// @ts-check

import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { Readable, Transform } from "node:stream";
import { WritableStream, TransformStream } from "node:stream/web";

import csvtojson from "csvtojson";
import { setTimeout } from "node:timers/promises";

const PORT = 3000;

// curl -i -X OPTIONS -N localhost:3000
// curl -N localhost:3000

/** @type {import("node:http").RequestListener} */
async function handler(request, response) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  };

  if (request.method === "OPTIONS") {
    response.writeHead(204, headers);
    response.end();
    return;
  }

  let items = 0;
  request.once("close", () => console.log("connection was closed!", items));

  const readFileStream = createReadStream("./animeflv.csv");
  const webReadFileStream = Readable.toWeb(readFileStream);

  const convertCsvToJson = Transform.toWeb(csvtojson());

  const enqueueMappedData = new TransformStream({
    transform(chunk, controller) {
      const data = JSON.parse(Buffer.from(chunk).toString());
      const mappedData = {
        title: data.title,
        description: data.description,
        url_anime: data.url_anime,
      };

      // Quebra de linha pois é um NDJSON
      controller.enqueue(JSON.stringify(mappedData).concat("\n"));
    },
  });

  const sendToClient = new WritableStream({
    /** @param {Uint8Array} chunk  */
    async write(chunk) {
      await setTimeout(1000);
      items++;
      response.write(chunk);
    },

    close() {
      response.end();
    },
  });

  webReadFileStream
    .pipeThrough(convertCsvToJson)
    .pipeThrough(enqueueMappedData)
    .pipeTo(sendToClient);

  response.writeHead(200, headers);
}

export const server = createServer(handler).listen(PORT, () =>
  console.log(`server is running at ${PORT}`)
);
