# Epione Care 🏥  
*AI-Powered Healthcare Platform for Intelligent Diagnostics*

Epione Care is a full-stack web platform that leverages deep learning to assist both patients and doctors in healthcare management. It supports secure user authentication, AI-based medical image analysis, appointment scheduling, and report generation — all within a user-friendly web interface.

---

## 🌟 Features

- 🔐 **JWT Authentication** for secure, role-based access
- 👨‍⚕️ **Doctor Dashboard**: Manage patients, view medical reports, and analyze AI results
- 🧑‍💼 **Patient Dashboard**: Book doctors, upload images, and view/download diagnostic reports
- 🧠 **AI Model Integration**: Detects Pneumonia, Diabetic Retinopathy, and Tuberculosis
- 📄 **PDF Report Generation**: Includes prediction results, confidence scores, and medical images
- 💳 **Dummy Payment Flow** for booking appointments
- 💬 **Real-Time Analysis** via FastAPI ML microservices

---

## 🧠 Technologies Used

| Frontend        | Backend             | AI/ML           | Database        | Other           |
|----------------|---------------------|-----------------|-----------------|-----------------|
| React.js        | Node.js, Express.js | TensorFlow, Keras | MongoDB Atlas   | FastAPI, JWT, OpenCV, Tailwind CSS |

---

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- Python 3.8+
- MongoDB Atlas account
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/epione-care.git
cd epione-care/minorProject

# Start backend
cd minor_backend
npm install
npm start

# Start frontend
cd ../minor_frontend
npm install
npm start

# Activate virtual environment and run ML model services
cd ../minor_modeldeploy
# Example (adjust path to your virtual environment):
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn predict_api:app --reload
```

## 📁 Project Structure

minorProject/
│
├── minor_backend/       # Node.js + Express backend
├── minor_frontend/      # React.js frontend
├── minor_modeldeploy/   # FastAPI + TensorFlow model APIs


## ✍️ Contributors

- **Ritaja Tarafder** – Backend Developer, Model Integration  
- **Kaushiki Ghosh** – Frontend Developer, UI/UX Design  
- **Ritika Banerjee** – ML Engineer, Model Training and Optimization

## 📬 Contact

### 👤 Ritaja Tarafder  
📧 **Email**: tonnitarafder2004@gmail.com 
🔗 **LinkedIn**: [linkedin.com/in/ritaja](https://www.linkedin.com/in/ritaja-tarafder-8b8a8b30b)  
🌐 **Portfolio**: [ritaja-portfolio.com](https://my-portfolio-delta-brown-72.vercel.app/)  

---

### 👤 Kaushiki Ghosh  
📧 **Email**: ghoshkaushiki2004@gmail.com  
🔗 **LinkedIn**: [linkedin.com/in/kaushiki](https://www.linkedin.com/in/kaushikighosh)  
🌐 **Portfolio**: [kaushiki-portfolio.com](https://kaushiki.vercel.app/)  

---

### 👤 Ritika Banerjee  
📧 **Email**:  ritikabanerjee444@gmail.com 
🔗 **LinkedIn**: [linkedin.com/in/ritika](https://www.linkedin.com/in/ritika-banerjee/)  
🌐 **Portfolio**: [ritika-portfolio.com](https://ritikab.vercel.app/)  

We’d love to connect and discuss how I can contribute. Looking forward to the opportunity!


