# Server

## Lessons I learned

### Dealing with CORS without frameworks

Letting anyone in anyway access the server.

```javascript
createServer(async (request, response) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  };

  response.writeHead(/* statusCode */, headers)
})
```

### Stream

- Readable is the input of the file and Writable is the output.
- pipeThrough() is the transform step. Can use many times necessary.
- pipeTo() is the last step. Can use only once.


### Converting node stream to web stream

`Readable.toWeb()` converts the nodejs stream (that doesn't work on the frontend) to web stream. The browser can only manipulate web streams.

```javascript
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";

// ...

Readable.toWeb(createReadStream("pathToFile.csv"))
```

### setTimeout in promise instead of callback

You can use the `setTimout` as a promise instead of callback by importing it from node `node:timers/promises`. It has a much cleaner syntax: 

```javascript
import { setTimeout } from "node:timers/promises";

async function usingPromise() {
  await setTimeout(1000); // time out for one second
}
```

### http 204 status code

`204 No Content` status code does NOT send data to the requester. I was stuck because of this, without receiving any data at all from the server. 

Learned the hard way...

## Errors

### Cannot find modules node:internal/modules/cjs/loader:1051

It happens when trying to run node test runner with `node test` INSTEAD OF `node --test` which is the correct command.

## Sources

- [204 No Content](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/204)
- [Timers - Node.js v21.5.0 documentation](https://nodejs.org/api/timers.html#timerspromisessettimeoutdelay-value-options)