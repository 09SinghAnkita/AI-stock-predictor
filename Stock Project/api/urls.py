from django.urls import path
from .views import static_prediction, model_prediction, chat_stream

urlpatterns = [
    path('prediction/',static_prediction, name = 'static_pre'),
    path('model_prediction/',model_prediction, name = 'model_pre'),
    path ('chat/stream', chat_stream, name="chat_stream")
]