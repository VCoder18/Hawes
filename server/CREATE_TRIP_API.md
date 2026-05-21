# Create Trip API Documentation

This document explains how to create a trip using the backend endpoint implemented in `server/src/trips/trips.controller.ts`.

## Endpoint

- Method: `POST`
- URL: `/trips`
- Auth: Required (`Bearer <supabase_access_token>`)
- Content types:
  - `application/json` (no file uploads)
  - `multipart/form-data` (with optional `images` and `attachment` files)

## Authentication

All trips routes are protected by `AuthGuard`.

Send a valid Supabase JWT in the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

If missing/invalid, the API returns `401 Unauthorized`.

## Request Body Fields

Validation is based on `TripCreateDTO` (`server/src/trips/dto/create.dto.ts`).

### Required fields

- `title` (`string`)
- `category` (`"adventure" | "cultural" | "nature" | "historical" | "relaxation" | "photography"`)
- `difficulty` (`"easy" | "moderate" | "challenging" | "difficult"`)
- `start_date` (`ISO date string`, e.g. `2026-07-01`)
- `end_date` (`ISO date string`, e.g. `2026-07-03`)
- `stops` (`TripStopDTO[]`)

### Optional fields

- `id` (`uuid`)
- `slug` (`string`)
- `description` (`string`)
- `activities` (`string[]`)
- `itinerary` (`string[]`)
- `included` (`string[]`)
- `not_included` (`string[]`)
- `what_to_bring` (`string[]`)
- `min_participants` (`integer >= 1`)
- `max_participants` (`integer >= 1`)
- `price` (`number >= 0`)
- `returns_to_start` (`boolean`)
- `status` (`"draft" | "published" | "completed" | "cancelled"`)

## Stops Format

Each stop follows `TripStopDTO` (`server/src/trips/dto/stop.dto.ts`):

- `type` (required): `"meeting" | "destination"`
- `location` (required):
  - `type`: must be `"Point"`
  - `coordinates`: `[longitude, latitude]`
- `label` (optional): string
- `destination` (required only when `type = "destination"`): destination UUID

## File Uploads

The endpoint accepts these file fields in multipart requests:

- `images`: up to 5 files
  - allowed MIME: `image/jpeg`, `image/png`, `image/webp`
  - max size per file: `5 MB`
- `attachment`: up to 1 file
  - allowed MIME:
    - `application/pdf`
    - `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (`.docx`)
  - max size: `10 MB`

Uploaded file URLs are written to:

- `images` (array of public URLs)
- `attachment_url` (public URL or `null`)

## Example 1: JSON request (no files)

```bash
curl -X POST "http://localhost:3000/trips" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Djurdjura Weekend Escape",
    "category": "nature",
    "difficulty": "easy",
    "start_date": "2026-07-05",
    "end_date": "2026-07-07",
    "status": "draft",
    "price": 6500,
    "min_participants": 4,
    "max_participants": 12,
    "activities": ["hiking", "camping"],
    "stops": [
      {
        "type": "meeting",
        "label": "Tizi Ouzou Bus Station",
        "location": {
          "type": "Point",
          "coordinates": [4.0459, 36.7118]
        }
      }
    ]
  }'
```

## Example 2: Multipart request (with files)

Use bracket notation for nested array/object fields in multipart form-data.

```bash
curl -X POST "http://localhost:3000/trips" \
  -H "Authorization: Bearer <access_token>" \
  -F "title=Sahara Stars Camp" \
  -F "category=adventure" \
  -F "difficulty=moderate" \
  -F "start_date=2026-10-10" \
  -F "end_date=2026-10-13" \
  -F "status=draft" \
  -F "price=15000" \
  -F "stops[0][type]=meeting" \
  -F "stops[0][label]=Tamanrasset Meetup" \
  -F "stops[0][location][type]=Point" \
  -F "stops[0][location][coordinates][0]=5.5228" \
  -F "stops[0][location][coordinates][1]=22.7850" \
  -F "images=@./cover.webp;type=image/webp" \
  -F "images=@./camp-2.jpg;type=image/jpeg" \
  -F "attachment=@./trip-brief.pdf;type=application/pdf"
```

## Success Response

Returns the created trip plus inserted stops (`TripWithStops`).

```json
{
  "id": "8f5d6e53-2a99-42c4-a8f8-0e34d0a7a5bd",
  "title": "Djurdjura Weekend Escape",
  "category": "nature",
  "difficulty": "easy",
  "start_date": "2026-07-05",
  "end_date": "2026-07-07",
  "status": "draft",
  "images": ["https://..."],
  "attachment_url": "https://...",
  "organizer": "<user-id-from-jwt>",
  "stops": [
    {
      "id": "7b8f...",
      "trip": "8f5d...",
      "type": "meeting",
      "label": "Tizi Ouzou Bus Station",
      "location": {
        "type": "Point",
        "coordinates": [4.0459, 36.7118]
      },
      "destination": null
    }
  ]
}
```

## Common Error Responses

- `400 Bad Request`
  - invalid enum value
  - invalid number/date format
  - failed trip insert
  - failed trip stops insert
- `401 Unauthorized`
  - missing/invalid bearer token
- `422 Unprocessable Entity`
  - uploaded file has invalid type or exceeds file size limits

## Notes

- Unknown body fields are rejected (`ValidationPipe` with `forbidNonWhitelisted: true`).
- Primitive fields in multipart requests are strings; validation/transform converts numeric fields when possible.
- The backend sets `organizer` from JWT subject (`user.sub`), not from request body.
