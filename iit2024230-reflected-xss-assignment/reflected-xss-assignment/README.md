# Reflected XSS Assignment (Local Lab)

## Goal

Demonstrate reflected Cross-Site Scripting (XSS), explain the root cause, then show one mitigation blocking the same payload. This project is intended for a local educational demonstration only.

## Requirements

- Node.js (LTS recommended)
- npm
- A web browser

Check your installation:

```bash
node --version
npm --version
```

## Run 

From this directory:

```bash
npm install
npm start
```

Open:

- Vulnerable page: http://127.0.0.1:3000/vulnerable
- Secured page: http://127.0.0.1:3000/secure


## ScreenShots
 Screenshot directory has the output image of code exceution

## Demonstration steps

1. Open `http://127.0.0.1:3000/vulnerable`.
2. Enter this harmless test payload in the search box:

   ```html
   <script>alert('Reflected XSS demo')</script>
   ```

3. Submit the form. The alert should appear. 
4. Open `http://127.0.0.1:3000/secure`.
5. Submit the exact same payload. It should appear as literal text, and no alert should execute.


URL-encoded version for the address bar:

```text
http://127.0.0.1:3000/vulnerable?search=%3Cscript%3Ealert(%27Reflected%20XSS%20demo%27)%3C%2Fscript%3E
```

## Vulnerable code and root cause

In `server.js`, the vulnerable route assigns the query parameter directly to `resultHtml`:

```js
resultHtml: search
```

The `page()` function inserts `resultHtml` into the HTML response. Because `search` is untrusted and is not encoded, the browser parses the injected `<script>` element as markup and executes it.

## Implemented mitigation

The secured route uses:

```js
resultHtml: escapeHtml(search)
```

`escapeHtml()` encodes HTML-significant characters such as `<`, `>`, `&`, quotes and apostrophes. The browser therefore displays the payload as text instead of interpreting it as a script element.



## Other mitigations 

- **Context-aware output encoding:** encode untrusted values according to where they are inserted.
- **Framework auto-escaping:** React escapes ordinary text children by default; avoid unsafe HTML insertion APIs such as `dangerouslySetInnerHTML` unless content is properly sanitised.
- **HTML sanitisation:** use a maintained sanitiser when the product intentionally accepts limited rich HTML.
- **Content Security Policy (CSP):** restrict script execution as an additional layer; it does not replace safe output handling.
- **HttpOnly cookies:** prevent JavaScript from reading cookies marked `HttpOnly`, but do not prevent XSS from executing.
- **Safe DOM sinks:** use `textContent` for plain text rather than parsing untrusted strings with `innerHTML`.





## Ownership declaration template


| Member name | Roll number | Category | Variant implemented |
|---|---|---|---|
| Himanshu | IIT2024230 | Cross-Site Scripting (XSS) | Reflected XSS |

