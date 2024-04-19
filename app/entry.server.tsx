import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import {
  RendererProvider,
  SSRProvider,
  createDOMRenderer,
  renderToStyleElements,
} from "@fluentui/react-components";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const renderer = createDOMRenderer();

  let markup = renderToString(
    <RendererProvider renderer={renderer}>
      <SSRProvider>
        <RemixServer context={remixContext} url={request.url} />
      </SSRProvider>
    </RendererProvider>
  );

  const style = renderToStaticMarkup(renderToStyleElements(renderer));
  markup = markup.replace("__STYLES__", style);

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
