# 🧾 AuditThis!
<img width="3000" height="3000" alt="Audit This" src="https://github.com/user-attachments/assets/d14f406b-b13a-4f78-8c87-0ad4577222f3" />

**AuditThis!** was built over a weekend out of a simple need.

As two self-employed people, my wife and I were tired of being forced into overpriced accounting software like *[insert monopolistic bookkeeping app here]* just to track expenses and stay organized for tax season. Between constant subscription price hikes and being locked into proprietary ecosystems, we realized what we really needed was something simple — and ours.

So, [bolt.new](https://bolt.new) built it (mostly)... 😄

---

## 💡 What Is AuditThis!?

**AuditThis!** is a lightweight, user-friendly accounting app built for personal and small business bookkeeping. It does exactly what it should — no more, no less.

- 📂 **No subscriptions.**
- 🔧 **Fully open source.**
- 💻 **Cross-platform installers available.**
- 🛠️ **Easily modifiable and developer-friendly.**

If you're looking for an alternative to bloated or restrictive bookkeeping software, this one's for you.

> Also check out:  
> - [GNUCash](https://www.gnucash.org/)  
> - [Wave Accounting](https://www.waveapps.com/)

---

## 🚀 Getting Started

### 1. Download & Open the Project

- Download the ZIP file or clone this repository.
- Open the `AuditThis!` folder in your preferred code editor (e.g., VSCode).

### 2. Install Node.js

- Make sure [Node.js](https://nodejs.org/) is installed on your machine.
- Verify that the `node` and `npm` commands are available in your terminal (check your PATH).

### 3. Install Dependencies

In the terminal, navigate (`cd`) to the project folder and run:

```bash
npm install
npm audit fix --force
```

### 4. Build the App

You can now build AuditThis! for your desired platform:

#### 🔗 Web App

```bash
npm run build:dev
```

#### 🪟 Windows

```bash
npm run build:win
```

#### 🍎 Mac

```bash
npm run build:mac
```

#### 🐧 Linux

```bash
npm run build:linux
```

### 5. Find the Installer

After building, you'll find the installer inside the `dist-electron` folder in the project directory.

### 6. Install & Enjoy!

You're ready to use AuditThis! — no subscriptions, no nonsense.

---

### ⚠️ Notes

- If the `dist-electron` folder already exists, it's safe to delete it before building a new version to avoid conflicts.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Feel free to fork, submit issues, or contribute features via pull requests! This is a labor of love — let’s make it better together.

---

## 💬 Feedback

If you find this useful or have suggestions, we'd love to hear from you. File an issue or open a discussion right here on GitHub.

---

Made with 💻, ☕, and a mild distaste for overpriced software.
