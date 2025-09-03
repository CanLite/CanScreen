# CanScreen

**CanScreen** is a middleware designed to protect your games or proxy site from being profiled by automated content filters.  
It works by presenting a **proof-of-work (PoW) based captcha system**.

- Real users solve the lightweight PoW automatically in their browser and gain access to the real site.
- Content filters and crawlers get stuck on the decoy site, unable to progress.

---

## Installation & Setup

1. Add CanScreen to your Express app:

```js
const { setupCanScreen } = require("./CanScreen");
setupCanScreen(app);
```

2. Make sure your app is using **express-session**. CanScreen requires sessions to function correctly. Example configuration can be seen in `implement.js`.

3. Provide your own **cover site**. CanScreen will redirect unverified sessions to this cover site until the PoW is solved.
    - Replace the static routing in `CanScreen.js` to point to your own decoy/cover site.
    - Include the client-side verifier script (`screener.js`) in your cover site, after the DOM is loaded.
    - This script solves the PoW and verifies the session with the server.

---

## Customization

- **Cover site (required):**  
  You must provide your own static cover site. This is what bots and content filters will see until they solve the challenge.

- **Difficulty:**  
  The PoW difficulty can be tuned in `CanScreen.js`. The higher the difficulty, the more time it takes to solve the challenge.

- **Static files:**  
  `screener.js` is injected with the current challenge and difficulty values at runtime. You can adapt this file if you want to change how the PoW is solved or how verification is handled.

---

## Example

A minimal implementation is provided in `implement.js`:

```js
const express = require("express");
const session = require("express-session");
const { setupCanScreen } = require("./CanScreen");

const app = express();

app.use(session({
  secret: process.env.EXPRESSJS_SECRET,
  resave: true,
  saveUninitialized: true,
  rolling: true
}));

setupCanScreen(app);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/static/real.html");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

---

## How It Works

1. A user requests your site.
2. CanScreen intercepts the request:
    - If the session is already verified, the request is passed through.
    - Otherwise, the user is redirected to your cover site.
3. The cover site loads `screener.js`, which:
    - Solves the PoW challenge (finding a nonce such that the hash meets difficulty).
    - Submits the solution to `/cnscrn/verify`.
4. On success, the session is marked as passed and the user is redirected to the real site.

---

## Notes

- CanScreen depends on **express-session**. Ensure sessions are configured before initializing.
- You must provide your own cover site. This should look convincing enough to stall content filters.
- The proof-of-work system is designed to slow down automated profiling, not humans.

---
