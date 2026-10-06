# Sxull Hyperlink

Cloudflare Worker URL shortener using the Goo.su API.

## Cloudflare secret

Create a Worker secret named `GOOSU_API_KEY`.

Never commit the Goo.su API token to GitHub.

## API

POST `/api/shorten`

Request:
```json
{"url":"https://example.com"}
```

Response:
```json
{
  "shortUrl": "https://goo.su/...",
  "markdown": "[https://goo.su/...](https://goo.su/...)"
}
```

## Discord

The frontend currently has a Discord button placeholder. Replace its `href` with the server invite once the invite is supplied.
