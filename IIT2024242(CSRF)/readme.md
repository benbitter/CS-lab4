# GET-Based CSRF Vulnerability Demonstration

## Overview

This project demonstrates a **Cross-Site Request Forgery (CSRF)** vulnerability in a sample wallet application.

In vulnerable mode, the server accepts a wallet transfer through a `GET` request. A simulated attacker webpage contains a hidden request that the browser sends when the page loads. If the victim is logged in and the server accepts the request, a transfer can occur without the victim intentionally submitting the wallet form.

This is a local educational demonstration. Run it only on your own machine and use the supplied demo accounts.

## Technologies Used

- **Node.js** — JavaScript runtime
- **Express.js** — web server framework
- **HTML, CSS, and JavaScript** — wallet and simulated attacker webpages
- **Visual Studio Code** — development environment
- **Web browser** — to run and test the demonstration

## Project Structure

```text
IIT2024242(CSRF)/
├── package.json
├── server.js
├── README.md
├── .gitignore
└── attacker/
    ├── server.js
    ├── index.html
    └── csrf-get.html
```

The main demonstration uses `attacker/csrf-get.html`.

## How the Vulnerability Works

1. The victim logs in to the wallet application.
2. The vulnerable transfer endpoint accepts the recipient and amount through URL query parameters.
3. The simulated attacker webpage contains a hidden image request to the transfer endpoint.
4. When the browser loads the attacker page, it automatically makes that request.
5. If the server accepts the request, the wallet transfer occurs without the victim intentionally submitting a transfer form.

For the demonstration, the intended transfer is **$500 from Rishit's wallet to Balaji's account**.

## Setup

### 1. Open the project folder

Open the project folder in Visual Studio Code. Make sure the terminal is in the folder containing `package.json`.

Check the current directory in PowerShell:

```powershell
dir
```

You should see `package.json`, `server.js`, and the `attacker` folder.

### 2. Install dependencies

Run:

```powershell
npm install
```

Wait for the command to finish before starting the servers.

## Run the Demonstration

You will need **two terminals** in Visual Studio Code.

### Terminal 1: Start the wallet application

From the project root, run:

```powershell
npm start
```

The wallet application should run at `http://localhost:3000`.

If port `3000` is already in use, check whether the wallet server is running in another terminal before starting another copy.

### Terminal 2: Start the simulated attacker website

From the project root, run:

```powershell
npm run attacker
```

The attacker website should run at `http://localhost:3001`.

### 3. Log in to the wallet

Open `http://localhost:3000/login` in your browser and use the demonstration credentials:

- **Username:** `rishit`
- **Password:** `RBJ7`

The demo wallet starts with a balance of **$8,914**. Balaji's account starts with **$0**.

### 4. Trigger the GET-based CSRF demonstration

With the victim logged in, open `http://localhost:3001/csrf-get.html`.

The page simulates an ordinary ParcelTrack webpage but sends a hidden request to the wallet application's transfer endpoint. In vulnerable mode, the request attempts to transfer **$500 to Balaji**.

Return to the wallet and check whether the balances changed.

## Testing Secure Mode

The project includes a secure mode intended to demonstrate mitigation.

1. Stop the wallet server with `Ctrl+C` in Terminal 1.
2. In the same PowerShell terminal, enable secure mode and restart the server:

   ```powershell
   $env:SECURE="true"
   npm start
   ```

3. Log in again at `http://localhost:3000/login`.
4. Open `http://localhost:3001/csrf-get.html` again.
5. Verify that the GET-based transfer is rejected.

To return to vulnerable mode in the same PowerShell terminal, stop the server and run:

```powershell
$env:SECURE=$null
npm start
```

The environment variable applies only to that PowerShell session. If you open a new terminal, set it again as needed.

## Mitigations Demonstrated

### 1. Do not change state through GET requests

GET requests should retrieve information, not perform actions such as transferring money. In secure mode, the application rejects the transfer GET request with a method-not-allowed response.

### 2. Validate a CSRF token

The secure implementation uses a session-associated CSRF token. The server checks the token before accepting a protected transfer and rejects requests that do not provide a valid token.

### 3. Configure cookies appropriately

Cookie settings such as `SameSite` provide an additional layer of protection. They should complement, not replace, CSRF-token validation and correct request handling.

Changing a state-changing request from GET to POST is good design, but **changing the HTTP method alone does not prevent CSRF**.

## Additional CSRF Mitigation Techniques

### SameSite cookies

The `SameSite` cookie attribute controls when browsers send cookies with cross-site requests.

- **`SameSite=Lax`:** Generally withholds cookies from cross-site subrequests such as images and iframes, while allowing certain top-level navigations.
- **`SameSite=Strict`:** Applies stronger restrictions to cookies on cross-site requests.
- **`Secure`:** Sends cookies only over HTTPS.
- **`HttpOnly`:** Prevents client-side JavaScript from reading the cookie.

Example Express session cookie configuration:

```javascript
cookie: {
  sameSite: "lax",
  secure: true,
  httpOnly: true
}
```

`SameSite` cookies are defense in depth, not a replacement for CSRF tokens. In this local demonstration, `localhost:3000` and `localhost:3001` are different origins but generally belong to the same site, so `SameSite` alone may not block the simulated request.

### CSRF token validation

A CSRF token is an unpredictable value associated with the user's session. The legitimate webpage submits it with a sensitive request, and the server validates it before processing the action. Requests with missing or invalid tokens should be rejected.

### Origin and Referer validation

The server can validate the `Origin` or `Referer` headers and reject requests from unexpected origins. Missing headers should be handled carefully, and this check should complement other CSRF defenses.

### Fetch Metadata validation

Modern browsers can send Fetch Metadata headers such as `Sec-Fetch-Site`, which describe the relationship between the page initiating a request and the destination. A server can use these headers to identify and reject inappropriate cross-site requests to protected endpoints.

### Re-authentication and transaction confirmation

For sensitive operations such as transferring money, an application can require the user to re-enter their password, complete multi-factor authentication, or confirm the recipient and amount through a secure verification step. The final confirmation endpoint must still validate the request securely.

### Framework-provided CSRF protection

Use a maintained CSRF protection mechanism compatible with the application framework and configure it for relevant state-changing endpoints. Do not assume that changing GET to POST automatically prevents CSRF.

## Expected Learning Outcomes

After running the project, you should understand:

- What CSRF is and how it abuses an authenticated browser session.
- Why state-changing GET endpoints are unsafe.
- How a hidden browser request can trigger an unwanted action.
- Why changing the HTTP method alone does not prevent CSRF.
- How rejecting state-changing GET requests and validating CSRF tokens help protect an application.

## Troubleshooting

### `ENOENT: no such file or directory, open 'package.json'`

The terminal is probably in the wrong directory. Navigate to the folder containing `package.json` and run the command again.

### `Cannot find module 'express-session'`

From the project root, run:

```powershell
npm install
```

If the error persists and `express-session` is listed as a dependency, run:

```powershell
npm install express-session
```

### `EADDRINUSE: address already in use :::3000`

Another process may already be using port `3000`. Check whether the wallet server is running in another terminal and reuse it or stop it before restarting.

### The transfer does not occur

- Confirm both servers are running.
- Confirm that you logged in to the wallet first.
- Confirm that you opened the correct attacker page.
- Check the wallet-server terminal for errors.
- If secure mode is enabled, the GET request should be rejected by design.

## References

- OWASP, [Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

## Security Disclaimer

This project is for **authorized local learning and demonstration only**. Do not use it against real accounts, websites, or systems without explicit permission. The credentials and balances described here are demo values.
