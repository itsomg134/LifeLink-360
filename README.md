# LifeLink 360

### A Patient Practice Partner for Language Learners

**Learn a new language hands-free — one blink at a time.**

[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2026-orange?style=for-the-badge&logo=hacktoberfest)](https://hacktoberfest.com/)
[![DigitalOcean](https://img.shields.io/badge/DigitalOcean-App%20Platform-0080FF?style=for-the-badge&logo=digitalocean&logoColor=white)](https://www.digitalocean.com/)
[![Backboard.io](https://img.shields.io/badge/AI%20Agent-Backboard.io-7C3AED?style=for-the-badge)](https://backboard.io/)
[![MediaPipe](https://img.shields.io/badge/Vision-MediaPipe-00A67E?style=for-the-badge&logo=google)](https://developers.google.com/mediapipe)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[Live Demo](https://lifelink-eight-indol.vercel.app/) • [Features](#-features) • [Setup](#-quick-start) • [How It Works](#-how-it-works) • [Tech Stack](#-tech-stack)

</div>

---

## Overview

**LifeLink 360** is a hands-free language practice partner built for a friend who is learning a new language. Instead of tapping, swiping, or typing, learners use **eye-blink patterns** detected through a standard webcam to trigger conversational AI responses.

The app turns any laptop or tablet into a **blink-controlled language tutor** — perfect for practicing while commuting, cooking, or resting when hands are busy.

> **Why?** Traditional language apps break immersion because they require constant physical interaction. LifeLink 360 lets learners focus entirely on *listening, speaking, and thinking in the target language* — no hands required.

---

## 🚀 Live Demo

🔗 **[Try LifeLink 360 Live](INSERT_YOUR_DIGITALOCEAN_URL_HERE)**

🎥 **Watch the Demo Video:** [INSERT_YOUTUBE_OR_LOOM_LINK_HERE]

---

## ✨ Features

- 👁️ **Real-time Eye Blink Detection** — Uses MediaPipe Face Mesh to track 468 facial landmarks in the browser.
- 🧠 **16 Blink Patterns** — Single, double, triple, long blinks, and gazes map to different conversational prompts.
- 🤖 **AI Language Tutor** — Powered by Backboard.io to generate contextual, patient responses in your target language.
- 🔊 **Text-to-Speech Output** — Uses the native Web Speech API to speak responses out loud for pronunciation practice.
- 📱 **Fully Hands-Free** — No keyboard, mouse, or touch required after starting the app.
- 🌐 **Runs in the Browser** — No installation, no special hardware. Just a webcam.
- ☁️ **Cloud-Ready** — Deployed on DigitalOcean App Platform with a scalable architecture for GPU inference.

---

## 📖 Blink Guide

| Blink Pattern | Action |
| :--- | :--- |
| **1 Blink** | "Hello dear" |
| **2 Blinks** | "What do you want?" |
| **3 Blinks** | "Yes, please" |
| **4 Blinks** | "No, thank you" |
| **1 Long Blink** | "I need water" |
| **2 Long Blinks** | "I am in pain" |
| **Look Up** | "I want to watch TV" |
| **Look Down** | "I want to sleep" |
| **Left Wink** | "Call the nurse" |
| **Right Wink** | "Call my family" |
| **Rapid Blinks (3+)** | "Emergency! Help!" |

> 💡 *The blink patterns are fully customizable — edit them in `app.js` to match your personal vocabulary list.*

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Vision** | [MediaPipe Face Mesh](https://developers.google.com/mediapipe) | Real-time facial landmark detection in the browser |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | Lightweight, accessible, and fast UI |
| **Backend** | Node.js + Express | Secure API key handling and static file serving |
| **AI Agent** | [Backboard.io](https://backboard.io/) | Contextual language tutor powered by GPT-4o |
| **Voice** | Web Speech API (`SpeechSynthesis`) | Text-to-speech output for pronunciation |
| **Hosting** | [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform) | Automatic HTTPS, CDN, and global scaling |

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- A modern browser (**Chrome** or **Edge** recommended for best MediaPipe support)
- A working **webcam**
- A **Backboard.io API key** ([Get one free](https://app.backboard.io/dashboard/api-calls))

### 1. Clone the Repository

```bash
git clone https://github.com/omgedam123098/lifelink-360.git
cd lifelink-360
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
BACKBOARD_API_KEY=your_backboard_api_key_here
```

> ⚠️ **Never commit your `.env` file to GitHub.** It is already listed in `.gitignore`.

### 4. Run the App

```bash
npm start
```

Open your browser and navigate to:

```
http://localhost:3000
```

**Allow camera permissions** when prompted. You're ready to start blinking! 👁️

---

## 🧠 How It Works

### 1. Eye Blink Detection

The app uses **MediaPipe Face Mesh** to track facial landmarks in real time. It calculates the **Eye Aspect Ratio (EAR)** using this formula:

```
EAR = distance(vertical eye landmarks) / distance(horizontal eye landmarks)
```

When the EAR drops below a threshold (default: `0.22`), the app registers a blink. Timing logic then determines if it was a **short blink** or a **long blink**.

### 2. Pattern Recognition

Blink counts are accumulated within a 1.5-second window. A `setTimeout` delay of 600ms distinguishes between:
- Single blink
- Double blink
- Triple blink
- Quadruple blink

### 3. AI Response

The detected pattern is sent to the **Node.js backend**, which securely forwards it to **Backboard.io** with a custom system prompt:

```
You are a patient, encouraging language tutor helping a student practice Spanish.
The student communicates via eye blinks. Respond conversationally and keep
responses under 25 words.
```

### 4. Audio Output

The AI's response is displayed on screen **and** spoken aloud using the browser's `SpeechSynthesis` API — so the learner hears correct pronunciation.

---

## 📁 Project Structure

```
lifelink-360/
├── public/
│   ├── index.html       # Main UI
│   ├── style.css        # Accessible dark-mode styling
│   └── app.js           # Blink detection + API calls
├── server.js            # Express backend
├── .env                 # API keys (not committed)
├── .gitignore
├── package.json
└── README.md
```

---

## 🎨 Customization

### Change the Target Language

Edit the system prompt in `server.js`:

```javascript
content: "You are a patient, encouraging language tutor helping a student practice FRENCH."
```

### Adjust Blink Sensitivity

If the app is too sensitive (or not sensitive enough), tweak the threshold in `public/app.js`:

```javascript
const BLINK_THRESHOLD = 0.22; // Lower = harder to trigger, Higher = easier
```

### Add New Blink Patterns

Extend the `executePattern()` function in `public/app.js`:

```javascript
case 5: message = "Can you repeat that?"; break;
```

---

## ☁️ Deploy to DigitalOcean

1. **Fork** this repository to your GitHub account.
2. Log in to [DigitalOcean](https://cloud.digitalocean.com/).
3. Click **Create → Apps** and connect your GitHub repo.
4. Add the environment variable `BACKBOARD_API_KEY` in the App Platform settings.
5. Click **Create Resources** — your app will be live in ~2 minutes.

### 🚀 Scaling with GPU Droplets

For **100% private, low-latency inference**, deploy an open-weight model (e.g., Llama 3 8B) on a [DigitalOcean GPU Droplet](https://www.digitalocean.com/products/gpu-droplets) using the **1-Click Models** feature. Then update the API endpoint in `server.js` to point to your own inference server.

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👥 Team

| Name | DEV.to | GitHub |
| :--- | :--- | :--- |
| **Om Gedam** | [@omgedam123098](https://dev.to/omgedam123098) | [@omgedam123098](https://github.com/omgedam123098) |
| **Niradari** | [@niradari0614](https://dev.to/niradari0614) | [@niradari0614](https://github.com/niradari0614) |

---

## 🏆 Hacktoberfest 2026 Submission

This project was built for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01).

**Prize Categories:**
- 🏅 Best Use of DigitalOcean
- 🏅 Best Use of Backboard.io

📝 **[Read the full submission post →](INSERT_DEV_TO_LINK_HERE)**

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [MediaPipe](https://developers.google.com/mediapipe) — Open-source face tracking
- [Backboard.io](https://backboard.io/) — AI agent platform
- [DigitalOcean](https://www.digitalocean.com/) — Cloud infrastructure
- [Hacktoberfest](https://hacktoberfest.com/) — For inspiring open-source innovation

---

<div align="center">

**Made with ❤️ for learners everywhere.**

⭐ Star this repo if you found it useful!

</div>
```

---

### 📋 Before You Commit — Replace These Items:

1. **`INSERT_YOUR_DIGITALOCEAN_URL_HERE`** → Your live app URL
2. **`INSERT_YOUTUBE_OR_LOOM_LINK_HERE`** → Your demo video
3. **`INSERT_DEV_TO_LINK_HERE`** → Your DEV.to submission post URL
4. **Verify GitHub usernames** for both team members

### 🎨 Optional: Add Screenshots

For maximum impact, add a `screenshots/` folder to your repo and insert images like this:

```markdown
## 📸 Screenshots

![LifeLink 360 UI](screenshots/lifelink-ui.png)
![Doctor Hero GIF](screenshots/doctor-hero.gif)
```

### 📜 Optional: Add a LICENSE File

Create a `LICENSE` file in the root with the [MIT License text](https://opensource.org/licenses/MIT) to make your repo fully open-source and compliant with Hacktoberfest rules.
