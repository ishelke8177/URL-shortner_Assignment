# 🔗 URL Shortener - Core Node.js Project

A simple yet secure URL shortening service built using **core Node.js**, **HTML**, and **CSS** — without any external frameworks or libraries. This project supports user registration, login, session-based authentication, custom aliases, and persistent URL storage.

---

## 📌 Features

- ✅ User registration and login (with password hashing and salting)
- ✅ Session-based authentication using cookies (no third-party session manager)
- ✅ Custom alias support (e.g. `short.ly/my-alias`)
- ✅ URL validation
- ✅ Persistent data storage using JSON file
- ✅ Clean inline-styled UI using pure HTML + CSS
- ✅ Logout functionality
- ✅ Modular code structure (utility functions in `utils.js`)
- ✅ Unit tests using Node.js `assert` module

---

## 📁 Project Structure

```
project/
│
├── public/               # Static files
│   ├── index.html        # Home page for URL shortening
│   ├── login.html        # Login page
│   ├── register.html     # Registration page
│   ├── index.css         # Stylesheet for home
│   ├── login.css         # Stylesheet for login
│   └── register.css      # Stylesheet for registration
│
├── urlData.json          # JSON file to persist user and URL data
├── server.js             # Main server file
├── views.js              # Views files
├── utils.js              # Utility functions (hashing, cookies, rendering etc.)
└── test/
    └── testUtils.js      # Unit tests for utility functions
```

---

## 🚀 How to Run

> ⚠️ Requires **Node.js v20+**

### 1. Clone the Repo

```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Start the Server

```bash
node server.js
```

Server runs at:

```
http://localhost:3000
```

### 3. Run Unit Tests

```bash
node test/testUtils.js
```

---

## 🛠️ Tech Used

- **Node.js (core modules only)**
- **HTML + CSS**
- No external libraries or frameworks

---

## 🔐 Authentication & Security

- Passwords are hashed using SHA-256 + salted with random hex
- Session management is done via secure cookies
- User data and URL mappings are stored in a local JSON file

---

## 📎 Example Flow

1. Register as a user → `/register`
2. Login with credentials → `/login`
3. Once logged in, use `/` page to:
   - Enter a long URL
   - Add a custom alias
4. Submit to generate and display a shortened URL
5. Logout using the button → `/logout`

---

## 📷 Screenshots

- Custom url shortner
<img width="1366" height="768" alt="cutrom url short" src="https://github.com/user-attachments/assets/ba6bfa3c-272f-4c42-b969-834838a895d0" />

- Anonymous url shortner
<img width="1366" height="768" alt="ano url short" src="https://github.com/user-attachments/assets/85f6be49-f8d9-4052-a390-acff277cdace" />

- Login page
<img width="1366" height="768" alt="login" src="https://github.com/user-attachments/assets/1cb205b9-ecb9-4db4-b556-f2a4d5ff3b47" />

- Register page
<img width="1366" height="768" alt="register" src="https://github.com/user-attachments/assets/388a746f-fc20-4ba6-adc2-af7c8bc46c17" />

- Short URL result screen
<img width="1366" height="768" alt="result" src="https://github.com/user-attachments/assets/93c2094b-e3ce-48e0-ab76-5d592b43728b" />

- Invalid URL entered screen
<img width="1366" height="768" alt="invalidURL" src="https://github.com/user-attachments/assets/f57a8d29-4d49-41e6-8d0b-d2171a5d4250" />

- Alias already exists screen
<img width="1366" height="768" alt="alias exists" src="https://github.com/user-attachments/assets/36a21458-1caa-4ff5-8738-05c21a2ffe2d" />


---

## ✍️ Author

**Ishwar Shelke**

---
