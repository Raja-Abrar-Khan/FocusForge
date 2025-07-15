# 🚀 FocusForge

**FocusForge** is an innovative Chrome extension and web application designed to transform productivity tracking.

Powered by advanced AI models (DistilBERT and BART via Hugging Face), it intelligently classifies your browsing activities as productive or unproductive, offering **real-time insights** to optimize your workflow.

With a sleek, futuristic React dashboard featuring **glassmorphism** and **neon gradients**, FocusForge empowers students, professionals, and anyone seeking to **maximize efficiency**.

---

## 🌟 Features

- 🔍 **AI-Driven Activity Classification**  
  Utilizes **DistilBERT** for text classification and **BART** for zero-shot activity typing (e.g., Studying, Coding, Meetings) with high precision.

- ⏱️ **Real-Time Tracking**  
  Automatically logs browser activity via the Chrome extension and syncs data with a **MongoDB backend** through RESTful APIs.

- 📊 **Futuristic Dashboard**  
  A responsive React dashboard (coming soon) with circular progress bars, heatmaps, bar charts, and productivity streaks.

- 💡 **Motivational Tips**  
  Provides personalized, AI-generated suggestions to maintain focus and motivation.

- ⚙️ **Seamless Setup**  
  Install the extension and start tracking with minimal configuration.

- 🔐 **Secure Authentication**  
  Implements **JWT-based authentication** for secure user data management.

- 🖼️ **Screenshot Analysis**  
  Captures and processes screenshots (e.g., Google Meet sessions) to enhance classification accuracy.

---

## 🛠 Tech Stack

| Layer      | Technologies                                     |
|------------|--------------------------------------------------|
| Frontend   | React, Tailwind CSS, Framer Motion               |
| Backend    | Node.js, Express.js, MongoDB                     |
| AI/ML      | Hugging Face (DistilBERT, BART)                  |
| Tools      | Chrome Extension APIs, Axios, JWT, Vite          |

---

## 🔧 Installation

### Prerequisites

- Node.js (v16+)
- MongoDB (local/cloud)
- Hugging Face API token
- Chrome browser

---

### Backend Setup


-git clone https://github.com/your-username/focusforge.git
-cd focusforge/backend
-npm install

**Create a .env file in the backend directory with:**

-PORT=5000
-MONGO_URI=your_mongodb_connection_string
-JWT_SECRET=your_jwt_secret
-HUGGING_FACE_TOKEN=your_hugging_face_token
-Start the server:

-npm start

---
Frontend Setup

cd ../frontend
npm install
npm run dev

Chrome Extension Setup

cd ../extension
Open Chrome and go to chrome://extensions/

Enable Developer Mode

Click Load unpacked

Select the extension/ folder

Make sure the backend is running to enable syncing.

🧠 Usage
Install the Extension
Load manually or install from the Chrome Web Store (link coming soon).

Create an Account
Register through the popup and log in to begin tracking.

Browse Naturally
The extension analyzes text, URLs, and screenshots in real-time.

View Analytics
Visit the dashboard at http://localhost:5173 for productivity visualizations:

Heatmaps

Activity streaks

Hourly data

**🖼️ Screenshots**
---
<img width="1920" height="1080" alt="Screenshot (29)" src="https://github.com/user-attachments/assets/7ffc5f55-98fa-4c75-abae-c9199aee3224" />
---
<img width="1920" height="1080" alt="Screenshot (30)" src="https://github.com/user-attachments/assets/d6a38e90-8e14-4a2d-952d-fb91472d9921" />
---
<img width="1920" height="1080" alt="Screenshot (31)" src="https://github.com/user-attachments/assets/9c82ebb4-b3ab-4018-8353-5a0ef1f9b15a" />
---
<img width="1920" height="1080" alt="Screenshot (32)" src="https://github.com/user-attachments/assets/3633edf7-66c0-4032-b7e8-6140dc350126" />
---
<img width="1920" height="1080" alt="Screenshot (33)" src="https://github.com/user-attachments/assets/a5d3b4d8-0366-4673-b315-30dbe3b37c6c" />
---
<img width="1920" height="1080" alt="Screenshot (36)" src="https://github.com/user-attachments/assets/8ddebffd-f2e1-4193-9196-314114f3f8c7" />
---
***📁 Project Structure***

focusforge/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx
├── extension/
│   ├── background.js
│   ├── content.js
│   ├── popup.jsx
│   └── manifest.json
└── README.md
---
**🤝 Contributing**
Pull requests are welcome!

-Fork the repo

-Create a feature branch:

-git checkout -b feature/your-feature

-Commit changes:

-git commit -m "Add new feature"

-Push and open a PR

Please follow the coding standards and include tests when applicable.
---

**📜 License**
This project is licensed under the MIT License. See the LICENSE file for details.

**👤 Author**
Raja Abrar Khan
📧 abrarkhan778008@gmail.com

**✅ TODOs**

 -Add deployed link once hosted
 -Add dashboard screenshots
 -Improve error handling in backend
