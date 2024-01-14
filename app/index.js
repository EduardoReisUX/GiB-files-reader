// @ts-check

const API_URL = "http://localhost:3000";

async function consumeAPI(signal) {
  const request = await fetch(API_URL, {
    signal,
  });

  let counter = 0;
  const reader = request.body?.pipeThrough(new TextDecoderStream()).pipeTo(
    new WritableStream({
      write(chunk) {
        console.log(++counter, "chunk", chunk);
      },
    })
  );

  return reader;
}

const abortController = new AbortController();
await consumeAPI(abortController.signal);

export {};
