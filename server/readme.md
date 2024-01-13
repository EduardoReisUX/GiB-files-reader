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

Readable is the input of the file and Writable is the output.

### Converting node stream to web stream

`Readable.toWeb()` converts the nodejs stream (that doesn't work on the frontend) to web stream.

```javascript
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";

// ...

Readable.toWeb(createReadStream("pathToFile.csv"))
```