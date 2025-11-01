import os
import pickle
import numpy as np
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from sklearn.preprocessing import MinMaxScaler
import logging
import json, time, os
from django.http import HttpResponseBadRequest, StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import Allowany
from .serializer import ChatPayloadSerialize

#Initialize the logger for this module
logger = logging.getLogger(__name__)

#A simple api to reutrn static prediction values
@api_view(['GET'])
def static_prediction(request):
    logger.info("Static prediction endpoint called.")
    return Response({'prediction' : 'Static prediction Value'})

# Create your views here.


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
model_path = os.path.join(BASE_DIR,'model_AAPL.pkl' )

#Api to predict stock price using the trained LSTM model.
#Expects an 'input' key in the request body with a list of numbers.
@api_view(['POST'])
def model_prediction(request):

    try : 
        # Get input data from the request
        input_data = request.data.get('input')

        #validate if "input" key is present in the request data

        if input_data is None : 
            logger.warning("No input data provided in the request.")
            return Response ({'error' : 'No input data provided in the request. Please provide input in the format : {"input" : [...]}'}, status=400)

        #Vaildate input data is list of numbers

        if not isinstance(input_data, list) or not all(isinstance(i,(int, float)) for i in input_data) : 
            logger.warning ("Invalid input format the input should be list of number")
            return Response({'error' : 'Invalid input data format. Expected a list of numbers'},status=400)

        logger.info(f"Valid input recieved : {input_data}")

        # Convert input_data to the correct format (assume it's already in the right shape, else adjust it)
        input_data = np.array(input_data).reshape(-1, 1)

        # Normalize the input data using the same scaler as during training
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_input_data = scaler.fit_transform(input_data)

        # Reshape the input to fit the LSTM model's expected input (e.g., [1, 60, 1] for 60 time steps)
        scaled_input_data = scaled_input_data.reshape(1, scaled_input_data.shape[0], 1)

        logger.info("Input data successfully normalized and reshaped.")

        # Load the LSTM model
        with open(model_path, 'rb') as model_file:
            model = pickle.load(model_file)
            logger.info("Model successfully loaded.")

        # Get prediction from the model
        predicted_price = model.predict(scaled_input_data)
        logger.info(f"Prediction made by model : {predicted_price}")

        # Inverse scale the predicted value back to the original price scale
        predicted_price_actual = scaler.inverse_transform(predicted_price)
        logger.info(f"Prediction made by model after inverse scaling : {predicted_price_actual[0][0]}")

        # Return the prediction as a response
        return Response({'prediction': predicted_price_actual[0][0]})

    except Exception as e :
        # log the error and return a 500 response for unexpected errors
        logger.error(f"An error occured during prediction : {str(e)}", exc_info = True)
        return Response({'error' : 'Internal server error occured. Please Try again later'}, status=500)
    
# chat shell 
def _sse_btye (data : str) -> bytes:
     # convert the response in the sse format
     return f"data:{data}\n\n".encode("utf-8")

@api_view(['POST'])
@authentication_classes([])
@permission_classes([Allowany])
def chat_stream(request):
    ser = ChatPayloadSerialize(data=request.data)
    ser.is_valid(raise_exception=True)
    q=ser.validated_data['q']

    token = [
        f"here is your question {q}",
        "Here is your response0,"
        "with the `code`",
        "ans -1",
        "ans - 2",
        "done"
    ]

    def generator():
        start_time = time.time()
        request._ttft = None
        for chunks in token:
            if request._ttft is None:
                request._ttft = int((time.time()-start_time)*1000)
            yield _sse_btye(chunks)
            time.sleep(0.25)
        request._duration_ms = int((time.time()-start_time)*1000) 

    return StreamingHttpResponse(generator(), content_type="text/event-stream", headers={"Cache-Control":"no-cache"})