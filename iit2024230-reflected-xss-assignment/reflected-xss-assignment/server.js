const express = require("express");
const path = require("node:path");

const app = express();
const PORT = 3000;


const HOST = "127.0.0.1";

app.use("/static", express.static(path.join(__dirname, "public")));

function page({ title, mode, search, resultHtml, explanation }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="/static/style.css">
</head>
<body>
  <main class="container">
    <header>
      <p class="eyebrow">Cyber Security · Web Server Security</p>
      <h1>Reflected XSS demonstration</h1>
      <p class="subtitle">A local lab comparing unsafe reflection with HTML output encoding.</p>
    </header>

    <nav class="tabs" aria-label="Demo versions">
      <a class="${mode === "vulnerable" ? "active danger" : ""}" href="/vulnerable">Vulnerable version</a>
      <a class="${mode === "secure" ? "active safe" : ""}" href="/secure">Mitigated version</a>
    </nav>

    <section class="panel">
      <h2>${mode === "vulnerable" ? "Version A: vulnerable" : "Version B: secured"}</h2>
      <p>${explanation}</p>
      <form action="/${mode}" method="get">
        <label for="search">Search term</label>
        <div class="form-row">
          <input id="search" name="search" value="${escapeHtmlAttribute(search)}"
                 placeholder="Enter a search term" autocomplete="off">
          <button type="submit">Search</button>
        </div>
      </form>
      <div class="result">
        <h3>Server response</h3>
        <p>You searched for: ${resultHtml}</p>
      </div>
    </section>

    <section class="panel note">
      <h2>How to test</h2>
      <p>Use only the harmless alert payload described in the README, on this local application.</p>
      <p><strong>Vulnerable:</strong> the browser executes the injected script.</p>
      <p><strong>Secured:</strong> the payload appears as literal text and no alert runs.</p>
    </section>
    <footer>Educational lab · Bound to 127.0.0.1 only</footer>
  </main>
</body>
</html>`;
}

// HTML text encoding for untrusted content placed inside an HTML text node.
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}


app.get("/", (_req, res) => {
  res.redirect("/vulnerable");
});


// User input is concatenated into HTML without output encoding.
app.get("/vulnerable", (req, res) => {
  const search = String(req.query.search ?? "");
  const html = page({
    title: "Vulnerable Reflected XSS Demo",
    mode: "vulnerable",
    search: "",
    // The flaw is this unescaped interpolation:
    resultHtml: search,
    explanation: "This route deliberately reflects the query parameter into HTML without encoding it."
  });
  res.status(200).type("html").send(html);
});

// MITIGATED ROUTE: the same input is encoded before being placed in HTML.
app.get("/secure", (req, res) => {
  const search = String(req.query.search ?? "");
  const html = page({
    title: "Secured Reflected XSS Demo",
    mode: "secure",
    search: "",
    resultHtml: escapeHtml(search),
    explanation: "This route encodes HTML-significant characters before displaying the untrusted search term."
  });
  res.status(200).type("html").send(html);
});

app.listen(PORT, HOST, () => {
  console.log(`Reflected XSS lab running at http://${HOST}:${PORT}`);
  console.log("Use /vulnerable to demonstrate the flaw and /secure to demonstrate the fix.");
});
