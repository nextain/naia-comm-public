# naia-comm survey site (archived example)

> 한국어 요약: 이 사이트는 2026년 8월에 보관된 정적 설문 예제입니다. 현재 응답을 받지 않으며, 아래 명령은 로컬 확인용입니다.

This is an archived August example of a static participation survey for the
Naia community kickoff meetup. The page preserves the calendar and form
interaction for local learning, but it does not accept registrations. The
minimal Azure Functions relay remains available for contract tests and a
future, separately approved event; it forwards submissions to a private
Discord channel. No database, no stored PII, no secrets in this repository.

## Structure

- `index.html` / `styles.css` / `app.js` — the public survey page
- `api/submit/` — Azure Functions HTTP endpoint (`POST /api/submit`) that
  relays the submission to Discord via a webhook

## Required app setting (Azure Static Web Apps (SWA))

| Name | Description |
|---|---|
| `DISCORD_WEBHOOK_URL` | Discord webhook URL for the organizer-private channel. Set via `az staticwebapp appsettings set`, never committed. |

## Local check

```bash
python3 -m http.server 8080   # serve index.html/styles.css/app.js only; /api needs Azure Functions Core Tools or a deployed SWA to exercise
```

The function bounds the complete Discord message to Discord's 2,000 UTF-16
code-unit content limit after clipping each field, disables content mentions,
and ignores requests that fill its hidden honeypot field. It returns generic
status bodies and does not echo the request or the webhook response. The
anonymous endpoint has no rate limiting or complete bot protection; the
honeypot is only a bounded additional check, and Discord or platform limits
remain possible. The repository test uses a fake `fetch` implementation, so it
checks validation, bounded relay content, mention handling, the honeypot and
relay failures without contacting Discord. The static-server command above
does not execute the API, and the archived page does not submit responses.
