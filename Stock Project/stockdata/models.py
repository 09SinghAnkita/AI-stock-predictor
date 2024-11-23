from django.db import models
from django.contrib.auth.models import User  # Import the User model for authentication

# Stock model to store stock symbols and names
class Stock(models.Model):
    symbol = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

# Portfolio model to associate stocks with users
class Portfolio(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    date_purchased = models.DateField()

    def __str__(self):
        return f"{self.user.username}'s Portfolio - {self.stock.symbol}"
    
# Historical Data model to store stock price history
class HistoricalData(models.Model):
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    date = models.DateField()
    open_price = models.DecimalField(max_digits=10, decimal_places=2)
    close_price = models.DecimalField(max_digits=10, decimal_places=2)
    high_price = models.DecimalField(max_digits=10, decimal_places=2)
    low_price = models.DecimalField(max_digits=10, decimal_places=2)
    volume = models.BigIntegerField()

    def __str__(self):
        return f"Data for {self.stock.symbol} on {self.date}"
