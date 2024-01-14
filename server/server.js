// @ts-check

import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { Readable, Transform } from "node:stream";
import { WritableStream, TransformStream } from "node:stream/web";

import csvtojson from "csvtojson";

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
  const readStream = createReadStream;
  const readFileStream = readStream("./animeflv.csv");
  const webReadStream = Readable.toWeb(readFileStream);
  const webTransformStream = Transform.toWeb;

  webReadStream
    .pipeThrough(webTransformStream(csvtojson()))
    .pipeThrough(
      new TransformStream({
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
      })
    )
    .pipeTo(
      new WritableStream({
        /** @param {Uint8Array} chunk  */
        write(chunk) {
          items++;
          response.write(chunk);
        },

        close() {
          response.end();
        },
      })
    );

  response.writeHead(200, headers);
}

export const server = createServer(handler).listen(PORT, () =>
  console.log(`server is running at ${PORT}`)
);
