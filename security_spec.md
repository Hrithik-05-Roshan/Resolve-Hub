# Security Specification & Test Matrix

## Data Invariants
1. A user can only access, create, update, or delete records inside their own subcollection `/users/{userId}/...` where `request.auth.uid == userId`.
2. All strings and payloads must be constrained in length to prevent Denial of Wallet attacks.
3. User profiles cannot have their owner ID altered upon update.
4. Issue descriptions and resolutions must be length-capped (<= 2000 chars).
5. Only verified auth tokens (`request.auth.token.email_verified == true`) or standard authenticated users can perform mutations.

## Dirty Dozen Payloads (Rejection Scenarios)
1. Impersonation: Reading another user's issue document (`/users/otherUser/issues/ISS-1`).
2. ID Poisoning: Inserting a 100KB string as a document ID.
3. Shadow Update: Updating an issue with extra unauthorized fields like `isAdmin: true`.
4. Spoofed Owner: Setting `userId` in issue to a different user's UID.
5. Oversized Payload: Inserting a 50,000 character description in an issue payload.
6. Unauthenticated Mutation: Writing to `/users/uid1/orders/123` without an auth header.
7. Unverified Email: Performing sensitive state mutation with unverified token if verification required.
8. Orphaned Write: Adding an issue under a non-existent user path without user authentication matching.
9. System-Field Modification: Overwriting `createdAt` timestamp with arbitrary backdated dates.
10. Malformed Types: Passing a boolean or array for a required string field like `description`.
11. Blanket Read/List Query Scraping: Unfiltered collectionGroup query without owner filtering.
12. Terminal State Bypassing: Modifying a completed/resolved issue's resolution history illegally.
