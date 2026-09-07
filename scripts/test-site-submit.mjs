import assert from 'node:assert/strict';

const apiPath = new URL('../projects/naia-comm/site/api/submit/index.js', import.meta.url);
const module = await import(apiPath.href);
const submit = module.default;

assert.equal(typeof submit, 'function', 'site submit handler must export a function');

function invoke(body) {
  const context = { log: { error() {} }, res: undefined };
  return submit(context, { body }).then(() => context.res);
}

function restoreEnvironment(name, value) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

const originalFetch = globalThis.fetch;
const originalWebhook = process.env.DISCORD_WEBHOOK_URL;
let calls = 0;
let lastBody;

try {
  process.env.DISCORD_WEBHOOK_URL = 'https://example.invalid/webhook';
  globalThis.fetch = async (_url, options) => {
    calls += 1;
    lastBody = JSON.parse(options.body);
    return { ok: true, status: 204 };
  };

  const valid = await invoke({
    name: 'Fixture participant',
    contact: 'fixture@example.invalid',
    role: 'r'.repeat(200),
    intent: 'i'.repeat(200),
    dates: Array.from({ length: 40 }, () => 'd'.repeat(200)),
    datesTime: 't'.repeat(200),
    venue: 'v'.repeat(1000),
    interests: Array.from({ length: 40 }, () => 'x'.repeat(200)),
    notes: 'n'.repeat(1000)
  });
  assert.equal(valid.status, 200);
  assert.equal(calls, 1);
  assert.equal(typeof lastBody.content, 'string');
  assert.ok(lastBody.content.length <= 2000, 'Discord content must remain within 2,000 characters');
  assert.deepEqual(lastBody.allowed_mentions, { parse: [] }, 'Discord mentions must be disabled');

  const callsBeforeHoneypot = calls;
  const honeypot = await invoke({
    name: 'Fixture participant',
    contact: 'fixture@example.invalid',
    website: 'https://bot.invalid'
  });
  assert.equal(honeypot.status, 200);
  assert.equal(calls, callsBeforeHoneypot, 'populated honeypot must not call the webhook');

  const emoji = '😀';
  const unicode = await invoke({
    name: 'Fixture participant',
    contact: 'fixture@example.invalid',
    role: 'r'.repeat(200),
    intent: 'i'.repeat(200),
    dates: 'd'.repeat(200),
    datesTime: 't'.repeat(200),
    venue: 'v'.repeat(1000),
    interests: 'x'.repeat(40),
    notes: emoji.repeat(1000)
  });
  assert.equal(unicode.status, 200);
  assert.ok(lastBody.content.length <= 2000, 'Discord content must remain within 2,000 UTF-16 code units');
  assert.equal(lastBody.content.at(-1), '…', 'long content must use the bounded ellipsis');
  assert.doesNotMatch(lastBody.content, /[\uD800-\uDBFF](?![\uDC00-\uDFFF])/u, 'content must not end with a lone high surrogate');
  assert.doesNotMatch(lastBody.content, /(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u, 'content must not contain a lone low surrogate');

  globalThis.fetch = async () => {
    calls += 1;
    throw new Error('invalid input must not be relayed');
  };
  const callsBeforeInvalid = calls;
  const invalid = await invoke({ name: 'Fixture participant' });
  assert.equal(invalid.status, 400);
  assert.equal(calls, callsBeforeInvalid, 'invalid input must not call the webhook');

  globalThis.fetch = async () => ({ ok: false, status: 429 });
  const failed = await invoke({ name: 'Fixture participant', contact: 'fixture@example.invalid' });
  assert.equal(failed.status, 502);
  assert.deepEqual(failed.body, { error: 'relay failed' });

  console.log('site submit API contract passed: bounded content, mention defense, honeypot, validation rejection, and safe relay errors');
} finally {
  globalThis.fetch = originalFetch;
  restoreEnvironment('DISCORD_WEBHOOK_URL', originalWebhook);
}
