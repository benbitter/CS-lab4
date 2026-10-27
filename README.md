## Table 3. Ownership

| Member name | Roll number | Category | Variant implemented |
|---|---|---|---|
| Rishit Balaji | IIT2024242 | Cross-Site Request Forgery (CSRF) | GET-based forged action |
| Prince Raj | IIT2024232 | SQL Injection | Authentication Bypass |
| Himanshu | IIT2024230 | Cross-Site Scripting (XSS) | Reflected XSS |

---

## Project Overview

This project demonstrates three common web application security vulnerabilities: **SQL Injection (SQLi), Cross-Site Request Forgery (CSRF), and Cross-Site Scripting (XSS)**.

Each group member implements a specific vulnerability variant, demonstrates how it can be exploited in a controlled environment, identifies its root cause, and explains appropriate mitigation techniques.

The objective is to understand how insecure web application design can compromise authentication, user actions, and browser security, and how secure coding practices can prevent these vulnerabilities.

## Project Objectives

- Understand common web application security vulnerabilities.
- Implement controlled demonstrations of SQL Injection, CSRF, and XSS.
- Analyze the root cause and potential impact of each vulnerability.
- Demonstrate the vulnerabilities using authorized test scenarios.
- Implement and explain appropriate security mitigations.
- Compare vulnerable and secured application behavior.

## Vulnerabilities Implemented

### 1. SQL Injection (SQLi) — Authentication Bypass

**Implemented by:** Prince Raj  
**Roll Number:** IIT2024232  
**Variant:** Authentication Bypass

SQL Injection occurs when untrusted user input is incorporated directly into SQL queries, allowing the intended query logic to be manipulated.

In this implementation, a deliberately vulnerable login mechanism demonstrates how a crafted input can bypass the intended password verification.

**Mitigation:** Parameterized SQL queries separate user-supplied values from SQL instructions, preventing input from changing the query structure.

### 2. Cross-Site Request Forgery (CSRF) — GET-Based Forged Action

**Implemented by:** Rishit Balaji  
**Roll Number:** IIT2024242  
**Variant:** GET-Based Forged Action

Cross-Site Request Forgery is a vulnerability in which a victim's authenticated browser can be induced to send an unintended request to a web application.

This variant demonstrates the risks of implementing state-changing actions through GET requests, particularly when the application relies on automatically attached authentication credentials without adequate request validation.

**Mitigation:** Use appropriate HTTP methods, CSRF tokens, and suitable cookie protections. State-changing operations should not be implemented through GET requests.

### 3. Cross-Site Scripting (XSS) — Reflected XSS

**Implemented by:** Himanshu  
**Roll Number:** IIT2024230  
**Variant:** Reflected XSS

Reflected Cross-Site Scripting occurs when an application includes untrusted input in an HTTP response without appropriate handling, potentially allowing injected JavaScript to execute in a victim's browser.

This variant demonstrates the risks of reflecting untrusted input into a web page without context-appropriate output encoding.

**Mitigation:** Apply context-aware output encoding, validate input where appropriate, and use a suitable Content Security Policy as an additional layer of defense.

## Testing and Evaluation

Each vulnerability is evaluated using a controlled demonstration that includes:

1. **Vulnerable implementation:** Identify and demonstrate the security weakness.
2. **Exploit demonstration:** Show the vulnerability using an authorized test case.
3. **Root cause analysis:** Explain the programming or design mistake responsible for the vulnerability.
4. **Mitigation:** Explain or implement an appropriate security control.
5. **Verification:** Test the application after mitigation to assess whether the original attack is prevented.
6. **Security analysis:** Discuss the potential impact and limitations of the implemented defense.

## Security Considerations

All vulnerability demonstrations are intended exclusively for educational use in a controlled environment.

- Test only applications and systems for which authorization has been granted.
- Keep intentionally vulnerable endpoints isolated from public networks.
- Avoid using real credentials or sensitive personal information in demonstrations.
- Do not deploy intentionally vulnerable implementations in production.
- Apply appropriate security controls before deploying any application.

## Learning Outcomes

Through this project, the group explores three distinct classes of web security vulnerabilities:

- **SQL Injection:** The risks of unsafe database query construction.
- **CSRF:** The risks of unauthorized requests performed through a victim's authenticated browser.
- **Reflected XSS:** The risks of incorporating untrusted input into browser-rendered responses.

The project reinforces the importance of secure coding, input handling, request validation, and defense-in-depth principles in web application development.