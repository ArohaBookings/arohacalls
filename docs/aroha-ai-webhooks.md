# Aroha Calls <-> Aroha AI Webhooks

Production URLs:

- Stripe -> Aroha Calls: `https://www.arohacalls.com/api/stripe/webhook`
- Aroha AI -> Aroha Calls: `https://www.arohacalls.com/api/aroha-ai/webhook`
- Aroha Calls retry worker: `https://www.arohacalls.com/api/aroha-ai/retry`

Retell production orchestration is owned by Aroha AI. Aroha Calls keeps its existing Retell live-demo webhook for browser demo summaries only.

## Security

All Aroha webhooks are sent over HTTPS with HMAC SHA-256 signatures.

Required headers:

- `X-Aroha-Timestamp`: Unix timestamp in seconds.
- `X-Aroha-Nonce`: Unique random nonce per delivery.
- `X-Aroha-Signature`: Hex HMAC SHA-256.
- `X-Aroha-Event`: Event type.
- `X-Aroha-Idempotency-Key`: Stable event key for replay protection.

Signature base string:

```text
{timestamp}.{nonce}.{raw_request_body}
```

Outbound Aroha Calls -> Aroha AI uses `AROHA_AI_WEBHOOK_SECRET`.

Inbound Aroha AI -> Aroha Calls uses `AROHA_CALLS_WEBHOOK_SECRET`.

Replay window is controlled by `AROHA_WEBHOOK_MAX_SKEW_SECONDS`, default `300`.

## Optional Payload Encryption

If both systems set `AROHA_WEBHOOK_ENCRYPTION_KEY`, payloads are AES-256-GCM encrypted. The key must be 32 bytes as raw text or base64.

Encrypted body:

```json
{
  "encrypted": true,
  "alg": "A256GCM",
  "iv": "base64",
  "tag": "base64",
  "ciphertext": "base64"
}
```

The HMAC signs the encrypted JSON body exactly as sent.

Plain signed body:

```json
{
  "id": "stripe:evt_123:managed.subscription.updated",
  "type": "managed.subscription.updated",
  "created": "2026-06-02T00:00:00.000Z",
  "source": "arohacalls",
  "data": {
    "userId": "user-id",
    "customerEmail": "customer@example.com",
    "businessName": "Example Trades",
    "planId": "professional",
    "subscriptionStatus": "active",
    "stripeSubscriptionId": "sub_...",
    "onboardingStatus": "received"
  }
}
```

## Aroha Calls -> Aroha AI Events

- `managed.customer.created`
- `managed.subscription.created`
- `managed.subscription.updated`
- `managed.subscription.payment_failed`
- `managed.subscription.cancelled`
- `managed.onboarding.updated`
- `managed.onboarding.completed`
- `managed.plan.capabilities.updated`

Delivery is logged in `aroha_ai_webhook_event`. Failed events are retried by `/api/aroha-ai/retry` with exponential backoff.

## Aroha AI -> Aroha Calls Events

Aroha AI should send these events to `https://www.arohacalls.com/api/aroha-ai/webhook`:

- `managed.setup.received`
- `managed.setup.in_progress`
- `managed.setup.needs_review`
- `managed.setup.ready`
- `managed.setup.complete`
- `managed.login.ready`
- `managed.provisioning.failed`
- `managed.account.paused`
- `managed.account.reactivated`

Recommended data fields:

```json
{
  "userId": "Aroha Calls user id if known",
  "customerEmail": "customer@example.com",
  "businessName": "Example Trades",
  "arohaAiOrgId": "org_...",
  "loginUrl": "https://arohaai.app/...",
  "message": "Human-readable setup status"
}
```

The inbound webhook updates the customer setup status in the Aroha Calls dashboard and records the inbound event for admin audit.
