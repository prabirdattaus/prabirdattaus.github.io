import { extname, isAbsolute, relative, resolve } from "node:path";

const rootDirectory = import.meta.dir;
const port = Number(Bun.env.PORT ?? 3000);
const contentTypeOverrides: Record<string, string> = {
  ".jfif": "image/jpeg",
};

const server = Bun.serve({
  port,
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    let pathname: string;

    try {
      pathname = decodeURIComponent(new URL(request.url).pathname);
    } catch {
      return new Response("Bad request", { status: 400 });
    }

    const requestedFile = pathname === "/" ? "index.html" : pathname.slice(1);
    const filePath = resolve(rootDirectory, requestedFile);
    const relativePath = relative(rootDirectory, filePath);

    if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
      return new Response("Forbidden", { status: 403 });
    }

    const file = Bun.file(filePath);

    if (!(await file.exists())) {
      return new Response("Page not found", { status: 404 });
    }

    return new Response(request.method === "HEAD" ? null : file, {
      headers: {
        "Content-Type":
          contentTypeOverrides[extname(filePath).toLowerCase()] ||
          file.type ||
          "application/octet-stream",
      },
    });
  },
});

console.log(`Local website: ${server.url}`);
console.log("Press Ctrl+C to stop the server.");
