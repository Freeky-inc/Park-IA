# 🅿️ Park-IA  
*A smart parking assistant powered by AI*  

---

## 🧠 Overview  

**Park-IA** is an intelligent parking assistant that leverages AI to help users find available parking spots in real time.  
Due to the lack of access to public camera feeds, the system currently operates on **predefined parking spaces** for demonstration and testing purposes.  

The long-term goal is to provide a scalable solution that can later integrate live data sources to dynamically detect and predict parking availability.  

---

## ⚙️ Tech Stack  

- **Frontend:** React  
- **Backend:** FastAPI (Python)  
- **Middleware / API Handling:** Axios  

This architecture ensures smooth communication between the user interface and the backend AI logic.  

---

## 🚀 Getting Started  

To launch the backend server, run one of the following commands in your terminal:  

```bash
uvicorn app.main:app --reload
If the above command doesn’t work, try:

```

If the first command doesn't work, try this:
```bash
python -m uvicorn app.main:app --reload
```
This starts the FastAPI server in development mode with automatic reload enabled whenever changes are made to the codebase.
