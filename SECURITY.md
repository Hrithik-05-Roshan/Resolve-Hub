# Security Policy

## Reporting Vulnerabilities

The ResolveHub team takes security, data integrity, and privacy seriously. If you discover a potential security vulnerability in this application, please report it immediately.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please send an email to:
📧 **security@resolvehub.ai** or **hrithikrocks124@gmail.com**

In your email, please include:
1. Description of the vulnerability and its potential impact.
2. Step-by-step instructions or proof-of-concept (PoC) script to reproduce the issue.
3. Any affected endpoints, components, or configurations.

You will receive an acknowledgment within 24 to 48 hours.

---

## 🔒 Security Best Practices Implemented

### 1. API Key Isolation
* **Server-Only Secrets**: Sensitive keys such as `GEMINI_API_KEY` are read strictly server-side and never exposed to client-side bundles or `import.meta.env`.
* **Environment Separation**: Public variables use the `VITE_` prefix, while confidential credentials remain unexposed.

### 2. AI Safety Boundaries & Governance
* **Financial Threshold Guardrails**: Auto-refund execution is constrained by merchant-configured dollar thresholds. Transactions exceeding limits require human agent sign-off.
* **Confidence Floor**: Automatic escalation triggers whenever AI resolution confidence drops below 85%.
* **Audit Logging**: All AI tool executions, parameter inputs, and system actions are immutably logged to Firestore audit trails.

### 3. Database Security (Firebase Firestore)
* **Rule Enforced Authentication**: Unauthenticated reads and writes are blocked by `firestore.rules`.
* **User Isolation**: Users can only modify documents under their own UID namespace (`/users/{userId}`).

---

## 📋 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| `1.x.x` | ✅ Supported       |
| `< 1.0` | ❌ End of Life     |
