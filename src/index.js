export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/shorten") {
      if (request.method !== "POST") {
        return json({ error: "Method not allowed" }, 405);
      }

      if (!env.GOOSU_API_KEY) {
        return json({ error: "Server is not configured with GOOSU_API_KEY." }, 500);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Invalid JSON body." }, 400);
      }

      const target = typeof body?.url === "string" ? body.url.trim() : "";
      if (!target) return json({ error: "Please provide a URL." }, 400);

      let parsed;
      try {
        parsed = new URL(target);
      } catch {
        return json({ error: "Please enter a valid URL." }, 400);
      }

      if (!["http:", "https:"].includes(parsed.protocol)) {
        return json({ error: "Only HTTP and HTTPS URLs are supported." }, 400);
      }

      try {
        const response = await fetch("https://goo.su/api/links/create", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "X-Goo-Api-Token": env.GOOSU_API_KEY
          },
          body: JSON.stringify({ url: target, is_public: true })
        });

        const data = await response.json();

        if (!response.ok || data?.successful !== true || !data?.short_url) {
          return json(
            { error: data?.message || "Goo.su could not shorten this URL." },
            response.status >= 400 ? response.status : 502
          );
        }

        const shortUrl = data.short_url;
        return json({
          shortUrl,
          markdown: `[${shortUrl}](${shortUrl})`
        });
      } catch {
        return json({ error: "Unable to contact Goo.su right now." }, 502);
      }
    }

    if (url.pathname.startsWith("/api/")) {
      return json({ error: "Not found" }, 404);
    }

    return env.ASSETS.fetch(request);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store"
    }
  });
}
