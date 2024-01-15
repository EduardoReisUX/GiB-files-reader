// @ts-check

const API_URL = "http://localhost:3000";
let counter = 0;

async function consumeAPI(signal) {
  const request = await fetch(API_URL, {
    signal,
  });

  const reader = request.body
    ?.pipeThrough(new TextDecoderStream()) // binary to string
    .pipeThrough(parseNDJSON()); // string to json

  return reader;
}

function parseNDJSON() {
  let ndjsonBuffer = "";

  return new TransformStream({
    // transformando
    transform(chunk, controller) {
      ndjsonBuffer += chunk;
      const items = ndjsonBuffer.split("\n");
      items.slice(0, 1).forEach((item) => controller.enqueue(JSON.parse(item)));

      ndjsonBuffer = items[items.length - 1];
      ++counter;
    },

    // terminou o processamento
    flush(controller) {
      if (!ndjsonBuffer) {
        return;
      }

      controller.enqueue(JSON.parse(ndjsonBuffer));
    },
  });
}

/**
 *
 * @param {HTMLElement} element
 */
function appendToHTML(element) {
  return new WritableStream({
    write({ title, description, url_anime }) {
      element.innerHTML += `
      <article>
            <div class="text">
                <h3>[${counter}] ${title}</h3>
                <p>${description.slice(0, 100)}</p>
                <a href="${url_anime}">Here's why</a>
            </div>
        </article>
      `;
    },
    abort(reason) {
      console.log("aborted:", reason);
    },
  });
}

const start = document.getElementById("start");
const stop = document.getElementById("stop");
const cards = document.getElementById("cards");

let abortController = new AbortController();

start?.addEventListener("click", async () => {
  const readable = await consumeAPI(abortController.signal);
  readable.pipeTo(appendToHTML(cards));
});

stop?.addEventListener("click", () => {
  abortController.abort();
  abortController = new AbortController();
});

export {};
