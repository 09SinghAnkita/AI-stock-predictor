from django.shortcuts import render
from .models import Stock, HistoricalData  # Import your models
from .api import fetch_real_time_price, fetch_historical_data  # Import your API functions

# Clean data before saving
def clean_stock_data(data):
    cleaned_data = {}
    time_series = data.get('Time Series (Daily)', {})
    for date, values in time_series.items():
        # Ensure no null values
        if all(v is not None for v in values.values()):
            cleaned_data[date] = values  # Keep rows without missing values
    return cleaned_data

def stock_data_view(request, stock_symbol):
    # Fetch real-time and historical data from the API
    real_time_data = fetch_real_time_price(stock_symbol)
    historical_data = fetch_historical_data(stock_symbol)

    # Extract the stock name and symbol
    stock_name = real_time_data['Meta Data']['2. Symbol']  # Modify this as per API response
    stock_symbol = stock_symbol.upper()

    # Store the stock in the Stock model (insert or update)
    stock, created = Stock.objects.get_or_create(
        symbol=stock_symbol,
        defaults={'name': stock_name}
    )
    
    # Store historical data in the HistoricalData model
    cleaned_time_series = clean_stock_data(historical_data)

    for date, data in cleaned_time_series.items():
        HistoricalData.objects.update_or_create(
            stock=stock,
            date=date,
            defaults={
                'open_price': data['1. open'],
                'close_price': data['4. close'],
                'high_price': data['2. high'],
                'low_price': data['3. low'],
                'volume': data['5. volume'],
            }
        )

    return render(request, 'stockdata/stock_landing_page.html', {
        'real_time_data': real_time_data,
        'historical_data': cleaned_time_series,  # Pass cleaned data to the template
    })
