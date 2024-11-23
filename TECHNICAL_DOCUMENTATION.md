
# Technical Documentation

## Project Overview
This project, **AI Stock Predictor**, is a Django-based backend integrated with Jupyter Notebook for stock price prediction using machine learning models. It provides APIs for fetching, predicting, and serving stock-related data.

---

## Backend Setup

### 1. Database
- **Database Used**: MySQL
- **Configuration**:  
  Database credentials are managed securely using environment variables.

  Example configuration in `settings.py`:
  ```python
  from decouple import config

  DATABASES = {
      'default': {
          'ENGINE': 'django.db.backends.mysql',
          'NAME': config('DB_NAME'),
          'USER': config('DB_USER'),
          'PASSWORD': config('DB_PASSWORD'),
          'HOST': config('DB_HOST'),
          'PORT': config('DB_PORT'),
      }
  }
  ```

---

### 2. API Endpoints
#### `/api/model_prediction/` (POST)
<!-- Endpoint for model prediction API -->

**URL**: `http://localhost:8000/api/model_prediction/`

- **Description**: Accepts input stock prices and returns predicted stock prices using the trained machine learning model.
- **URL**: `http://localhost:8000/api/predict/`
- **Method**: POST
- **Request Format**:
  - **Content-Type**: `application/json`
  - **Body**:
    ```json
    {
      "input": [210.50, 211.20, 210.85, 211.50, 212.00, 212.85, 213.10, 213.50]
    }
    ```
- **Response Format**:
  - **Content-Type**: `application/json`
  - **Body**:
    ```json
    {
      "prediction": [213.00, 213.50, 214.00, 214.50, 215.00]
    }
    ```

---

### 3. Install Dependencies
1. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
2. Generate a `requirements.txt` file:
   ```bash
   pip freeze > requirements.txt
   ```

---

### 4. Project Structure
```
Project/
├── Stock Project/
│   ├── manage.py                # Django project manager
│   ├── stocks_simplified/       # Main project folder
│   │   ├── settings.py          # Contains project settings
│   │   ├── urls.py              # URL configuration
│   │   ├── celery.py            # Celery task manager
│   │   ├── tasks.py             # Asynchronous tasks
│   ├── api/                     # API-related code
│   │   ├── views.py             # API logic
│   │   ├── urls.py              # API endpoints
│   │   ├── models.py            # Database models
│   ├── stockdata/               # Stock data processing
│   │   ├── templates/           # HTML templates
│   │   ├── models.py            # Data models
│   │   ├── views.py             # Business logic
├── requirements.txt             # List of dependencies
├── fetch_stock_data.ipynb       # Jupyter Notebook for data processing
├── TECHNICAL_DOCUMENTATION.md   # This file
├── NON_TECHNICAL_DOCUMENTATION.md
```

---

## Model Integration

### Training and Saving Models
Use the Jupyter Notebook `fetch_stock_data.ipynb` to process data and train the model.  
Save the trained model as a `.pkl` file:
```python
import pickle

with open("model_AAPL.pkl", "wb") as file:
    pickle.dump(model, file)
```

### Loading Models in Django
Load the saved `.pkl` file in the Django views:
```python
with open("model_AAPL.pkl", "rb") as file:
    model = pickle.load(file)

prediction = model.predict(input_data)
```

---

## Logging
Logs are stored in a `logs` directory. Ensure this directory is added to `.gitignore`.

Example `LOGGING` setup in `settings.py`:
```python
LOGGING = {
    'version': 1,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'logs/django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
```

---

## Celery Configuration
Set up Celery for asynchronous tasks:

1. Install Celery and Redis:
   ```bash
   pip install celery[redis]
   ```
2. Update `celery.py`:
   ```python
   from celery import Celery

   app = Celery('stocks_simplified')
   app.config_from_object('django.conf:settings', namespace='CELERY')
   app.autodiscover_tasks()
   ```
3. Start the Celery worker:
   ```bash
   celery -A stocks_simplified worker --loglevel=info
   ```

---

## JupyterLab Integration

### Folder Structure
```
jupyter_env/
├── fetch_stock_data.ipynb  # Data fetching and preprocessing
├── cleaned_data.csv        # Preprocessed data
├── model.pkl               # Saved ML model
```

### Steps
1. Run the notebook `fetch_stock_data.ipynb` to:
   - Fetch stock data.
   - Preprocess and clean data.
   - Train the model.
   - Save the model as `model.pkl`.
2. Serve predictions through the API.

---
