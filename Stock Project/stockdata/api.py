import requests

API_KEY = 'OQJ4ER1FJIKJQ2MX'
BASE_URL = 'https://www.alphavantage.co/query'

def fetch_real_time_price(stock_symbol):
    params = {
        'function': 'TIME_SERIES_INTRADAY',
        'symbol': stock_symbol,
        'interval': '5min',
        'apikey': API_KEY
    }
    response = requests.get(BASE_URL, params=params)
    data = response.json()
    return data

def fetch_historical_data(stock_symbol):
    params = {
        'function': 'TIME_SERIES_DAILY',
        'symbol': stock_symbol,
        'apikey': API_KEY
    }
    response = requests.get(BASE_URL, params=params)
    data = response.json()
    return data
