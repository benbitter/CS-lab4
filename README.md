# GET-Based CSRF Vulnerability Demonstration

## Overview

This project demonstrates a **Cross-Site Request Forgery (CSRF)**
vulnerability in a sample wallet application.

The vulnerable server accepts a wallet transfer through a `GET` request.
A simulated attacker webpage contains a hidden request that the browser
sends when the page loads. If the victim is logged in and the server
accepts the request, the transfer can happen without the victim
intentionally submitting the wallet form.

This is a local educational demonstration. Run it only on your own
machine and use the supplied demo accounts.

## Technologies Used

-   **Node.js** --- JavaScript runtime
-   **Express.js** --- web server framework
-   **HTML, CSS, and JavaScript** --- wallet and simulated attacker
    webpages
-   **Visual Studio Code** --- development environment
-   **Web browser** --- to run and test the demonstration

## Project Structure

``` text
csrf-demo-project/
├── package.json
├── victim/
│   └── server.js
└── attacker/
    ├── server.js
    ├── index.html
    ├── csrf-get.html
    └── csrf-post.html
```

The main demonstration in this README is the **GET-based CSRF attack**
using `csrf-get.html`.

## How the Vulnerability Works

1.  The victim logs in to the wallet application.
2.  The vulnerable transfer endpoint accepts the recipient and amount
    through URL query parameters.
3.  The simulated attacker webpage contains a hidden image request to
    the transfer endpoint.
4.  When the browser loads the attacker page, it automatically makes
    that request.
5.  If the server accepts it, the wallet transfer occurs without the
    victim intentionally submitting a transfer form.

For the demonstration, the intended transfer is **\$500 from Rishit's
wallet to Balaji's account**.

## Setup

### 1. Open the project folder

Open the `csrf-demo-project` folder in Visual Studio Code. Make sure the
terminal is in the folder containing `package.json`.

Check the current directory:

``` powershell
dir
```

You should see `package.json`, `victim`, and `attacker`.

### 2. Install dependencies

Run:

``` powershell
npm install
```

Wait for the command to finish before starting the servers.

## Run the Demonstration

You will need **two terminals** in Visual Studio Code.

### Terminal 1: Start the wallet application

From the project root, run:

``` powershell
npm start
```

The victim application should run on `http://localhost:3000`.

If the terminal reports that port `3000` is already in use, check
whether the wallet server is already running in another terminal before
starting another copy.

### Terminal 2: Start the simulated attacker website

From the project root, run:

``` powershell
npm run attacker
```

The attacker website should run on `http://localhost:3001`.

### 3. Log in to the wallet

Open `http://localhost:3000/login` in your browser.

Use the demonstration credentials:

-   **Username:** `rishit`
-   **Password:** `RBJ7`

The demo wallet starts with a balance of **\$8,914**. Balaji's account
starts with **\$0**.

### 4. Trigger the GET-based CSRF demonstration

With the victim logged in, open `http://localhost:3001/csrf-get.html`.

The page simulates an ordinary ParcelTrack webpage but sends a hidden
request to the wallet application's transfer endpoint. In vulnerable
mode, the request attempts to transfer **\$500 to Balaji**.

Return to the wallet and check the balances to see whether the transfer
occurred.


## Testing the Secure Mode

The project also includes a secure mode intended to demonstrate
mitigation.

1.  Stop the victim server with `Ctrl+C` in Terminal 1.

2.  In PowerShell, enable secure mode and restart the victim server:

    ``` powershell
    $env:SECURE="true"
    npm start
    ```

3.  Log in again at `http://localhost:3000/login`.

4.  Open `http://localhost:3001/csrf-get.html` again.

5.  Verify that the GET-based transfer is rejected.

To return to vulnerable mode in the same PowerShell terminal, stop the
server and run:

``` powershell
$env:SECURE=$null
npm start
```

The environment variable is specific to that PowerShell session. If you
open a new terminal, set it again as needed.

## Mitigations Demonstrated

### 1. Do not change state through GET requests

GET requests should be used to retrieve information, not to perform
actions such as transferring money. In secure mode, the application
rejects the transfer GET request with a method-not-allowed response.

### 2. Use POST for state-changing actions

Transfers should use a POST request rather than a GET request. Changing
the HTTP method alone is **not** sufficient protection against CSRF.

### 3. Validate a CSRF token

The secure implementation uses a session-bound CSRF token. The server
checks the token before accepting a transfer and rejects requests that
do not provide a valid token.

### 4. Configure cookies appropriately

Cookie settings such as `SameSite` provide an additional layer of
protection. They should complement, not replace, server-side CSRF-token
validation and correct request handling.

## Expected Learning Outcomes

After running the project, you should understand:

-   What CSRF is and how it abuses an authenticated browser session.
-   Why state-changing GET endpoints are unsafe.
-   How a hidden browser request can trigger an unwanted action.
-   Why POST alone does not prevent CSRF.
-   How rejecting state-changing GET requests and validating CSRF tokens
    help protect an application.

## Troubleshooting

### `ENOENT: no such file or directory, open 'package.json'`

The terminal is probably in the wrong directory. Navigate to the folder
that contains `package.json`, then run the commands again.

### `Cannot find module 'express-session'`

From the project root, run:

``` powershell
npm install
```

If the error persists and `express-session` is listed as a project
dependency, install it with:

``` powershell
npm install express-session
```

### `EADDRINUSE: address already in use :::3000`

Another process may already be using port `3000`. Check whether the
wallet server is running in another terminal and reuse it or stop that
server before restarting it.

### The transfer does not occur

-   Confirm both servers are running.
-   Confirm that you logged in to the wallet first.
-   Confirm that you opened the correct attacker page.
-   Check the victim-server terminal for errors.
-   If secure mode is enabled, the GET request should be rejected by
    design.


## Additional CSRF Mitigation Techniques

Apart from preventing state-changing GET requests, several other techniques can help protect web applications against Cross-Site Request Forgery (CSRF) attacks.

### 1. SameSite Cookies

The `SameSite` cookie attribute controls when browsers send cookies with cross-site requests.

- **SameSite=Lax:** Generally prevents cookies from being sent with cross-site subrequests, such as images and iframes, while allowing certain top-level navigations.
- **SameSite=Strict:** Applies stronger restrictions on sending cookies with cross-site requests.
- **Secure:** Ensures cookies are sent only over HTTPS.
- **HttpOnly:** Prevents client-side JavaScript from reading the cookie.

Example Express.js configuration:

```javascript
cookie: {
    sameSite: "lax",
    secure: true,
    httpOnly: true
}
```

SameSite cookies provide an additional layer of protection but should not be the only CSRF defense. In this project, `localhost:3000` and `localhost:3001` are different origins but generally belong to the same site, so SameSite cookies alone may not prevent the simulated attack.

### 2. CSRF Token Validation

A CSRF token is a unique, unpredictable value associated with the user's session.

- The server generates a token and provides it to the legitimate webpage.
- The webpage submits the token with a sensitive request.
- The server validates the token before processing the action.
- Requests with missing or invalid tokens are rejected.

A hidden image request cannot normally include a session-specific token that the attacker does not know.

### 3. Origin and Referer Header Validation

The server can check the `Origin` or `Referer` HTTP headers to determine whether a request came from an expected website.

For this project:
- The wallet application runs at `http://localhost:3000`.
- The simulated attacker website runs at `http://localhost:3001`.

The server can reject requests with an unexpected origin. Missing or invalid headers should be handled carefully, with other CSRF protections used as appropriate.

Header validation should not be the only defense because these headers may be absent in some circumstances.

### 4. Fetch Metadata Header Validation

Modern browsers can send Fetch Metadata headers, such as `Sec-Fetch-Site`, to describe the relationship between the webpage initiating a request and the destination.

For example:

```http
Sec-Fetch-Site: cross-site
```

The server can use these headers to identify and reject inappropriate cross-site requests to protected endpoints. This technique should complement CSRF tokens and other server-side checks.

### 5. Re-authentication for Sensitive Actions

For sensitive operations, such as transferring money, the application can require the user to verify their identity again before completing the action.

Examples include:
- Re-entering the account password.
- Completing multi-factor authentication (MFA).
- Confirming the transaction through a trusted verification step.

This adds protection against unauthorized transfers, provided the confirmation process is also designed securely.

### 6. Explicit Transaction Confirmation

Before executing a transfer, the application can display the recipient and amount and require the user to confirm the transaction.

The final confirmation endpoint must still validate the request securely. A confirmation page alone is not sufficient if an attacker can trigger the final action automatically.

### 7. Framework-Provided CSRF Protection

Using a maintained CSRF protection mechanism compatible with the Express application can help reduce implementation errors.

The protection should be configured to validate relevant state-changing endpoints. Avoid relying only on custom checks or assuming that changing GET to POST automatically prevents CSRF.

## Recommended Mitigations for This Project

The following techniques are recommended for the GET-based CSRF demonstration:

1. **Reject state-changing GET requests:** Ensure GET endpoints retrieve information rather than modify wallet balances.
2. **Validate CSRF tokens:** Reject sensitive requests that do not contain a valid session-associated token.
3. **Configure SameSite cookies:** Add cookie-based protection as a defense-in-depth measure.
4. **Validate request origins:** Check Origin or Referer headers where appropriate.
5. **Require additional verification:** Consider re-authentication for high-value transactions.

Using multiple complementary defenses provides stronger protection than relying on a single technique.

## References

- OWASP, [Cross-Site Request Forgery (CSRF) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

## Security Disclaimer

This project is for **authorized local learning and demonstration
only**. Do not use it against real accounts, websites, or systems
without explicit permission. The credentials and balances described here
are demo values.
