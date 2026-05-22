# Firestore Security Specification

This document details the security specification, validation constraints, and test suite for the `chix9ja` Firebase Firestore security rules under the Zero-Trust Architecture model.

## 1. Data Invariants

1. **User Identity Isolation**: A user's document path `/users/{email}` must strictly belong to the user with the corresponding `request.auth.token.email`. Only authenticated and verified emails can access their respective documents.
2. **PII Protection**: User details containing emails and monetary balances are Classified Personally Identifiable Information (PII) and cannot be read by other unprivileged users.
3. **Verified Authentication**: Any write (creates and updates) requires the user's email to be verified: `request.auth.token.email_verified == true`.
4. **ID Preservation**: Document ID variable `{email}` must match the lowercased custom email address defined inside the payload to prevent ID hijacking/poisoning.
5. **Immutable Identity Fields**: The email and registration creation fields must remain immutable post-creation.

## 2. The "Dirty Dozen" Malicious Payloads

The following payloads attempt to bypass identity or integrity rules and must be blocked with `PERMISSION_DENIED`:

1. **Spoofed Email Read**: Attempt to read `/users/victim@example.com` while authenticated as `attacker@example.com`.
2. **Unverified Email Signup**: Attempt to create document `/users/attacker@example.com` with `email_verified == false`.
3. **Mismatched Document ID Payload**: Create `/users/victim@example.com` with email `"attacker@example.com"` inside the map.
4. **Balance Overwrite / Injection**: Update someone else's document to increment their own balance.
5. **No-Auth Profile Creation**: Create a user profile without an active Firebase Auth authentication token.
6. **Admin Spoofing**: Attempt to write into `/admins/{uid}` to self-assign root privileges.
7. **Malformed Balance Injection**: Write negative balance mapping like `"balance": -500000`.
8. **Malicious Giant String Injection**: Provide a 2MB string for the `name` field to trigger Denial of Wallet resources.
9. **Mutable Email Modification**: Attempt update of `email` from `"user@example.com"` to `"changed@example.com"` on active document.
10. **Hijack Subscription Status**: Unauthenticated or self-assigned subscription bypass by sending `isSubscribed: true`.
11. **Bypass Verification Mode**: Set `vModeSubscriptionUsed: true` without matching validation checks.
12. **Malformed Types Injection**: Sending a Boolean or deep Array on fields expects custom object shapes.

---

## 3. Test Suite (firestore.rules.test.ts)

```typescript
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';

let testEnv: RulesTestEnvironment;

describe('chix9ja Firestore Security Rules Suite', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'responsible-bearing-gtgzl',
      firestore: {
        rules: readFileSync('firestore.rules', 'utf8'),
        host: 'localhost',
        port: 8080,
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  test('PII Isolation: Users cannot read other user profiles', async () => {
    const attackerDb = testEnv.authenticatedContext('attacker_uid', {
      email: 'attacker@example.com',
      email_verified: true,
    }).firestore();

    await assertFails(
      attackerDb.doc('users/victim@example.com').get()
    );
  });

  test('Verified Write: Unverified users cannot create user profile', async () => {
    const unverifiedDb = testEnv.authenticatedContext('unverified_uid', {
      email: 'unverified@example.com',
      email_verified: false,
    }).firestore();

    await assertFails(
      unverifiedDb.doc('users/unverified@example.com').set({
        name: 'Unverified Test',
        email: 'unverified@example.com',
        balance: 10000,
      })
    );
  });

  test('ID Preservation: Mismatched payload email is rejected', async () => {
    const userDb = testEnv.authenticatedContext('user_uid', {
      email: 'user@example.com',
      email_verified: true,
    }).firestore();

    await assertFails(
      userDb.doc('users/user@example.com').set({
        name: 'Test Account',
        email: 'victim@example.com', // Mismatched
        balance: 10000,
      })
    );
  });
});
```
