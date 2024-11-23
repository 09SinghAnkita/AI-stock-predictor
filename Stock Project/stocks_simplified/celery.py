import os
from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stocks_simplified.settings')

# Create a Celery application instance
app = Celery('stocks_simplified')

# Load task modules from all registered Django app configs.
app.config_from_object('django.conf:settings', namespace =  'CELERY')
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
