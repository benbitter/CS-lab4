const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database(path.join(__dirname, "demo.db"));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);
  db.run(
    "INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)",
    ["admin", "ClassroomDemo123!"]
  );
});

function loginPageResult(res, ok, message, username = "") {
  res.status(ok ? 200 : 401).send(`
    <!doctype html><html><head><meta charset="utf-8"><title>Login result</title>
    <style>body{font:16px system-ui;max-width:720px;margin:50px auto;padding:0 20px}
    .box{padding:18px;border-radius:10px;background:${ok ? "#e7f8ed" : "#fff0f0"}}
    a{display:inline-block;margin-top:18px}</style></head><body>
    <h1>${ok ? "Login successful" : "Login failed"}</h1>
    <div class="box">${message}</div>
    ${ok ? `<p>Demo account: <strong>${username}</strong></p>` : ""}
    <a href="/">← Back to demo</a></body></html>`);
}

app.post("/login-vulnerable", (req, res) => {
  const username = String(req.body.username || "");
  const password = String(req.body.password || "");
  const sql = `SELECT id, username FROM users
               WHERE username = '${username}' AND password = '${password}' LIMIT 1`;

  console.log("\n[VULNERABLE DEMO] Executing query with user input embedded:");
  console.log(sql);

  db.get(sql, (err, row) => {
    if (err) {
      console.error("SQLite error:", err.message);
      return loginPageResult(res, false, "The query failed. Check the server terminal.");
    }
    if (row) return loginPageResult(res, true,
      "The vulnerable query returned a user row, so the app treated the request as authenticated.", row.username);
    return loginPageResult(res, false, "Username or password was incorrect.");
  });
});


app.post("/login-secure", (req, res) => {
  const username = String(req.body.username || "");
  const password = String(req.body.password || "");
  const sql = "SELECT id, username FROM users WHERE username = ? AND password = ? LIMIT 1";

  console.log("\n[SECURE DEMO] Executing parameterized query:");
  console.log(sql, "[values supplied separately]");

  db.get(sql, [username, password], (err, row) => {
    if (err) {
      console.error("Database error:", err.message);
      return loginPageResult(res, false, "Login could not be completed.");
    }
    if (row) return loginPageResult(res, true, "Credentials matched a stored user.", row.username);
    return loginPageResult(res, false, "Username or password was incorrect.");
  });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`SQL injection classroom demo running at http://127.0.0.1:${PORT}`);
  console.log("Use only this local demo. Stop it with Ctrl+C.");
});