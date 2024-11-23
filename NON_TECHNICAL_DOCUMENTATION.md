
# Non-Technical Documentation

## About the Project
The **AI Stock Predictor** is a platform that predicts stock performance based on historical price data and financial metrics. Designed for retail investors, it offers insights to make informed investment decisions.

---

## Key Features
1. **Stock Predictions**: Get future stock price trends based on advanced machine learning models.
2. **Historical Data**: Access processed and cleaned stock data for analysis.
3. **Secure Data**: Sensitive information like credentials is securely managed.

---

## How to Use
### API Endpoints
- **Prediction Endpoint**: Submit stock data to receive predictions.
- **Data Retrieval**: Fetch historical stock data for any stock symbol.

---

## Technology Stack
- **Backend**: Django
- **Database**: MySQL
- **Machine Learning**: Jupyter Notebook (Python)

---

## Deployment Steps
1. Clone the repository.
2. Install dependencies with:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure the `.env` file for your environment.
4. Run the server:
   ```bash
   python manage.py runserver
   ```

---

## Security
To ensure data security:
- All sensitive information (e.g., API keys, database credentials) is stored in a `.env` file.
- Logs and unnecessary files are excluded from version control using `.gitignore`.

---

## Why Use This Platform?
This platform helps retail investors make data-driven decisions, offering transparency and reliability in stock performance analysis.

---
 
