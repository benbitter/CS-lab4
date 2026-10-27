# SQL Injection — Authentication Bypass

A Node.js web application demonstrating **SQL Injection (SQLi) and Authentication Bypass**, developed as part of the Web Server Security assignment for the Cyber Security course at IIIT Allahabad.

The project demonstrates how improper handling of user input can allow an attacker to bypass a login mechanism, and how **parameterized SQL queries** prevent this vulnerability.

## 📌 Project Overview

SQL Injection is a web application vulnerability that occurs when untrusted user input is incorporated directly into SQL queries. An attacker may manipulate the query's logic to perform unauthorized database operations.

In this project, we demonstrate an authentication-bypass attack against a deliberately vulnerable login implementation and compare it with a secured implementation.

### Objectives

- Understand the fundamentals of SQL Injection.
- Demonstrate an SQL injection authentication-bypass attack in a controlled local environment.
- Identify the root cause of the vulnerability.
- Implement and demonstrate a mitigation using parameterized queries.
- Compare vulnerable and secured authentication behavior.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Backend:** Express.js
- **Database:** SQLite
- **Frontend:** HTML and CSS
- **Security Mitigation:** Parameterized SQL queries

## ⚙️ Application Architecture

The application consists of three main components:

1. **Frontend:** Provides separate forms for testing vulnerable and secured authentication.
2. **Backend:** Processes login requests using Node.js and Express.
3. **Database:** SQLite stores the demonstration user credentials and processes authentication queries.

Two login routes are implemented:

| Route               | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| `/login-vulnerable` | Intentionally vulnerable login using SQL string concatenation |
| `/login-secure`     | Secured login using parameterized SQL queries                 |

## 🚨 Vulnerability: SQL Injection Authentication Bypass

### Root Cause

The vulnerability occurs when user-controlled values are concatenated directly into an SQL query.

Example of vulnerable code:

```javascript
const sql = `SELECT id, username FROM users
             WHERE username = '${username}'
             AND password = '${password}' LIMIT 1`;
```

Because user input is embedded directly into the query, specially crafted input can modify its intended logic.

### Exploitation

Under normal circumstances, authentication succeeds only when the supplied username and password match a database record.

However, an SQL injection payload can manipulate the query's conditional logic. In the demonstration, the vulnerable implementation may return a user record without validating the intended password.

The application then treats the returned record as successful authentication, resulting in an authentication bypass.

**Impact:** Depending on the application and database permissions, SQL injection may allow unauthorized access, exposure of sensitive information, or other unintended database operations.

## 🛡️ Mitigation: Parameterized Queries

The implemented mitigation uses parameterized SQL queries to separate SQL instructions from user-supplied values.

Example of secured code:

```javascript
const sql =
  "SELECT id, username FROM users WHERE username = ? AND password = ? LIMIT 1";

db.get(sql, [username, password], (err, row) => {
    // Process the authentication result.
});
```

The placeholders (`?`) represent values supplied separately to the database driver.

Consequently, user input is treated as data rather than executable SQL syntax. An SQL injection payload is therefore unable to modify the intended query structure.

### Before vs. After Mitigation

| Test Case                                  | Vulnerable Implementation         | Secured Implementation |
| ------------------------------------------ | --------------------------------- | ---------------------- |
| Valid credentials                          | Login succeeds                    | Login succeeds         |
| Invalid password                           | Login fails                       | Login fails            |
| SQL injection payload                      | Authentication bypass may succeed | Authentication fails   |
| Query construction                         | Direct string concatenation       | Parameterized query    |
| User input separated from SQL instructions | No                                | Yes                    |

## 🔐 Additional Security Measures

Other defenses that can strengthen an application against SQL injection include:

- **Input validation:** Enforce appropriate input formats and length limits.
- **Least privilege:** Restrict database permissions to the minimum required by the application.
- **Safe error handling:** Avoid exposing detailed database errors to users.
- **Password hashing:** Store passwords using a suitable password-hashing algorithm rather than plaintext.
- **Login rate limiting:** Limit repeated login attempts to reduce automated abuse.

Parameterized queries are the primary mitigation implemented in this project. The other measures are additional security recommendations.

## 🚀 Installation and Execution

### Prerequisites

Install Node.js and npm.

Verify the installation:

```bash
node --version
npm --version
```

### Step 1: Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd sql-injection-auth-bypass
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with your repository URL.

Alternatively, download the repository and open its folder in VS Code.

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the Application

```bash
npm start
```

### Step 4: Open the Application

Navigate to:

```text
http://127.0.0.1:3000
```

The SQLite database is initialized automatically when the application starts.

### Demonstration Credentials

For the local demonstration:

```text
Username: admin
Password: ClassroomDemo123!
sql-injection: ' OR '1'='1' -- (include trailing space after -- )
```

Use the application's two login forms to compare normal authentication, the vulnerable implementation, and the secured implementation.

## 🧪 Testing Procedure

1. Start the application locally.
2. Verify that the demonstration credentials work.
3. Enter an incorrect password and verify that authentication fails.
4. Test the SQL injection payload against the vulnerable login form.
5. Observe the authentication result and the SQL query printed in the server terminal.
6. Submit the same payload to the secured login form.
7. Verify that authentication fails in the secured implementation.
8. Compare the vulnerable and parameterized query implementations in `server.js`.

This procedure demonstrates both the vulnerability and the effectiveness of the implemented mitigation.

## 📁 Project Structure

```text
sql-injection-auth-bypass/
├── public/
│   └── index.html       # Login interface
├── server.js            # Express server and authentication routes
├── package.json         # Project dependencies and scripts
├── README.md            # Project documentation
├── speech.md            # Presentation speech
└── .gitignore           # Excluded files
```

The SQLite database file (`demo.db`) is generated locally when the application runs and should not be committed to Git.

## ⚠️ Security Disclaimer

This application intentionally contains a vulnerable login endpoint for educational purposes.

- Run the demonstration only in a controlled local environment.
- Do not expose the vulnerable endpoint to public networks.
- Test only systems that you own or are explicitly authorized to assess.
- Do not use this demonstration implementation in production.
- Real applications must use secure password hashing, appropriate session management, parameterized queries, and other necessary security controls.

## 🎓 Learning Outcomes

Through this project, we demonstrate:

- How SQL Injection arises from unsafe query construction.
- How an attacker can manipulate SQL logic to bypass authentication.
- How parameterized queries prevent user input from changing the intended SQL query structure.
- The importance of secure database access and defense-in-depth principles.

## 👤 Author

**Name:** [Your Name]
**Institution:** Indian Institute of Information Technology Allahabad (IIIT Allahabad)
**Course:** Cyber Security — Web Server Security Assignment
**Topic:** SQL Injection — Authentication Bypass
