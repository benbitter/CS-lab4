const express = require('express');
const session = require('express-session');
const crypto = require('crypto');

const app = express();
const PORT = 3000;
const SECURE = process.env.SECURE === 'true';

const initialBalances = { rishit: 8914, balaji: 0 };
const users = {
  rishit: { password: 'RBJ7', balance: initialBalances.rishit, email: 'rishit@example.com' },
  balaji: { password: 'attk', balance: initialBalances.balaji, email: 'balaji@example.com' }
};
let transactions = [];

app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'local-csrf-demo-change-this-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: SECURE ? 'strict' : 'lax'
  }
}));

function shell(title, body) {
  const mode = SECURE
    ? '<div class="mode secure">SECURE MODE · CSRF protections enabled</div>'
    : '<div class="mode vulnerable">LAB MODE · intentionally vulnerable</div>';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} · Northstar Wallet Lab</title>
<style>
:root{font-family:Inter,Segoe UI,Arial,sans-serif;color:#172033;background:#f3f6fb}
*{box-sizing:border-box}body{margin:0;min-height:100vh}
.mode{text-align:center;padding:10px 16px;font-size:12px;font-weight:800;letter-spacing:.08em;color:white}
.vulnerable{background:#b45309}.secure{background:#047857}
header{background:#101b33;color:white;padding:22px max(22px,calc((100% - 980px)/2));display:flex;align-items:center;justify-content:space-between;gap:14px}
.brand{font-size:19px;font-weight:800;letter-spacing:-.03em}.brand span{color:#6ee7b7}
main{max-width:980px;margin:34px auto;padding:0 20px}
.panel{background:white;border:1px solid #e3e9f2;border-radius:18px;padding:26px;box-shadow:0 12px 35px #1720330c;margin-bottom:20px}
h1{font-size:28px;letter-spacing:-.04em;margin:0 0 8px}h2{font-size:18px;margin:0 0 16px}
.sub{color:#64748b;margin:0 0 24px;line-height:1.5}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
.stat{background:#f7fafc;border:1px solid #e7edf5;border-radius:14px;padding:18px}
.label{font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.08em;font-weight:700}
.amount{font-size:30px;font-weight:800;margin-top:8px;letter-spacing:-.04em}
label{display:block;font-weight:700;font-size:13px;margin:14px 0 7px}
input{width:100%;padding:12px 13px;border:1px solid #cbd5e1;border-radius:10px;font:inherit;background:white}
button,.button{display:inline-block;border:0;border-radius:10px;padding:12px 17px;background:#2563eb;color:white;text-decoration:none;font-weight:800;font-size:14px;cursor:pointer;margin-top:16px}
button:hover,.button:hover{filter:brightness(.95)}.secondary{background:#e8eef8;color:#23314a}
a{color:#2563eb}.toplinks{display:flex;gap:14px;align-items:center}.toplinks a{color:#dbeafe;font-size:13px}
.notice{padding:12px 14px;border-radius:10px;background:#ecfdf5;color:#065f46;margin:0 0 16px}
.error{padding:12px 14px;border-radius:10px;background:#fef2f2;color:#991b1b;margin:0 0 16px}
table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:12px;border-bottom:1px solid #e8edf4;font-size:14px}th{color:#64748b;font-size:12px;text-transform:uppercase}
.small{font-size:12px;color:#64748b;line-height:1.5}.pill{display:inline-block;padding:5px 9px;border-radius:99px;background:#edf2ff;color:#3949ab;font-size:12px;font-weight:800}
@media(max-width:600px){header{align-items:flex-start;flex-direction:column}.panel{padding:20px}h1{font-size:24px}}
</style></head><body>${mode}
<header><div class="brand">◈ Northstar <span>Wallet</span></div>
<div class="toplinks"><a href="/">Home</a><a href="/dashboard">Dashboard</a><a href="/logout">Log out</a></div></header>
<main>${body}<p class="small">Local security lab only. Do not use these demo credentials or this simplified app for real financial activity.</p></main>
</body></html>`;
}

function requireAuth(req, res, next) {
  if (req.session.username && users[req.session.username]) return next();
  return res.redirect('/login');
}
function currentUser(req) { return users[req.session.username]; }

app.get('/', (req, res) => res.redirect(req.session.username ? '/dashboard' : '/login'));

app.get('/login', (req, res) => {
  const invalid = req.query.msg === 'invalid';
  res.send(shell('Sign in', `<section class="panel" style="max-width:520px;margin:0 auto">
    <span class="pill">DEMO ACCOUNT</span><h1 style="margin-top:16px">Welcome back</h1>
    <p class="sub">Sign in to your Northstar Wallet test account.</p>
    ${invalid ? '<div class="error">That username or password was not recognised.</div>' : ''}
    <form method="POST" action="/login">
      <label for="username">Username</label><input id="username" name="username" autocomplete="username" placeholder="rishit" required>
      <label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" placeholder="Enter demo password" required>
      <button type="submit">Sign in securely →</button>
    </form>
    <div class="stat" style="margin-top:20px"><div class="label">Demo credentials</div><p style="margin:8px 0 0">rishit / RBJ7<br>balaji / attk</p></div>
  </section>`));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username].password === password) {
    req.session.regenerate(err => {
      if (err) return res.status(500).send('Could not create session.');
      req.session.username = username;
      return res.redirect('/dashboard');
    });
  } else {
    res.redirect('/login?msg=invalid');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

app.get('/dashboard', requireAuth, (req, res) => {
  const username = req.session.username;
  const user = currentUser(req);
  let csrfField = '';
  if (SECURE) {
    if (!req.session.csrfToken) req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    csrfField = `<input type="hidden" name="_csrf" value="${req.session.csrfToken}">`;
  }
  const transferMethod = SECURE ? 'POST' : 'GET';
  const related = transactions.filter(t => t.from === username || t.to === username);
  const rows = related.length ? related.map(t =>
    `<tr><td>${t.from}</td><td>${t.to}</td><td>$${t.amount.toFixed(2)}</td><td>${t.timestamp}</td></tr>`
  ).join('') : '<tr><td colspan="4">No transactions yet.</td></tr>';

  res.send(shell('Dashboard', `
    <section class="panel">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
        <div><span class="pill">ACCOUNT OVERVIEW</span><h1 style="margin-top:14px">Good to see you, ${username}</h1>
        <p class="sub">Here is a snapshot of your demo wallet.</p></div>
        <a class="button secondary" href="/reset">Reset demo</a>
      </div>
      <div class="grid">
        <div class="stat"><div class="label">Available balance</div><div class="amount">$${user.balance.toFixed(2)}</div></div>
        <div class="stat"><div class="label">Account holder</div><div class="amount" style="font-size:19px">${user.email}</div><p class="small">Demo wallet · USD</p></div>
      </div>
    </section>
    <section class="panel">
      <h2>Send money</h2><p class="sub">Transfer demo funds to another lab account.</p>
      <form method="${transferMethod}" action="/transfer">
        ${csrfField}
        <label for="to">Recipient username</label><input id="to" name="to" placeholder="balaji" required>
        <label for="amount">Amount (USD)</label><input id="amount" name="amount" type="number" min="1" step="1" placeholder="500" required>
        <button type="submit">Review transfer →</button>
      </form>
      <p class="small" style="margin-top:14px">Transfer method: ${transferMethod}. ${SECURE ? 'A session-bound CSRF token is required.' : 'This lab mode intentionally permits state changes through GET and POST.'}</p>
    </section>
    <section class="panel"><h2>Recent activity</h2><table><thead><tr><th>From</th><th>To</th><th>Amount</th><th>Time</th></tr></thead><tbody>${rows}</tbody></table></section>
  `));
});

function executeTransfer(from, to, amount) {
  if (!users[from] || !users[to]) return { ok: false, message: 'Recipient not found.' };
  if (from === to) return { ok: false, message: 'You cannot transfer to yourself.' };
  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, message: 'Enter a valid amount.' };
  if (users[from].balance < amount) return { ok: false, message: 'Insufficient funds.' };
  users[from].balance -= amount;
  users[to].balance += amount;
  transactions.push({ from, to, amount, timestamp: new Date().toLocaleTimeString() });
  return { ok: true, message: 'Transfer completed.' };
}
function transferResult(req, res, to, amount, method) {
  const from = req.session.username;
  const result = executeTransfer(from, to, Number(amount));
  console.log(`[${result.ok ? 'SUCCESS' : 'FAILED'}] ${method} /transfer from=${from} to=${to} amount=${amount}`);
  if (!result.ok) {
    return res.status(400).send(shell('Transfer not completed', `<section class="panel"><h1>Transfer not completed</h1><div class="error">${result.message}</div><a class="button" href="/dashboard">Back to dashboard</a></section>`));
  }
  res.redirect('/dashboard');
}

if (SECURE) {
  app.all('/transfer', requireAuth, (req, res, next) => {
    if (req.method === 'GET') {
      console.log(`[BLOCKED] GET /transfer from=${req.session.username}`);
      return res.status(405).send(shell('Method not allowed', `<section class="panel"><h1>405 · Method not allowed</h1><p class="sub">GET requests cannot change account state in secure mode.</p><a class="button" href="/dashboard">Back to dashboard</a></section>`));
    }
    if (req.method !== 'POST') return res.sendStatus(405);
    next();
  });
  app.post('/transfer', requireAuth, (req, res) => {
    const token = req.body._csrf || '';
    const expected = req.session.csrfToken || '';
    const valid = token.length === expected.length && token.length > 0 &&
      crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
    if (!valid) {
      console.log(`[BLOCKED] POST /transfer from=${req.session.username} - invalid CSRF token`);
      return res.status(403).send(shell('Request blocked', `<section class="panel"><h1>403 · Request blocked</h1><div class="error">CSRF token missing or invalid. No transfer was made.</div><a class="button" href="/dashboard">Back to dashboard</a></section>`));
    }
    transferResult(req, res, req.body.to, req.body.amount, 'POST');
  });
} else {
  // Intentionally vulnerable lab mode: both GET and POST perform state changes without a CSRF token.
  app.get('/transfer', requireAuth, (req, res) => transferResult(req, res, req.query.to, req.query.amount, 'GET'));
  app.post('/transfer', requireAuth, (req, res) => transferResult(req, res, req.body.to, req.body.amount, 'POST'));
}

app.get('/reset', requireAuth, (req, res) => {
  users.rishit.balance = initialBalances.rishit;
  users.balaji.balance = initialBalances.balaji;
  transactions = [];
  res.redirect('/dashboard');
});

app.listen(PORT, () => {
  console.log('Northstar Wallet CSRF lab');
  console.log('Mode: ' + (SECURE ? 'SECURE' : 'VULNERABLE'));
  console.log('Victim app: http://localhost:' + PORT);
});
