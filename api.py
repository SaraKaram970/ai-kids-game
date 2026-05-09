from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
import joblib
from pydantic import BaseModel

# Create FastAPI app
app = FastAPI()

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

# Define input data structure
class InputData(BaseModel):
    data: list

# Load trained model and encoder
model = tf.keras.models.load_model("tmnist_model.keras")
encoder = joblib.load("tmnist_encoder.joblib")

# Prediction endpoint
@app.post("/predict")
def predict(input_data: InputData):

    # Convert list to numpy array
    input_array = np.array(input_data.data)
   
    # Reshape input
    input_array = input_array.reshape(1, 784)

    # Normalize data
    input_array = input_array / 255.0

    # Make prediction
    prediction = model.predict(input_array)
  
    # Get predicted class
    predicted_label = np.argmax(prediction)

    # Convert number back to original label
    predicted_inverse_label = encoder.inverse_transform([predicted_label])
    

    # Return prediction
    return {
        "prediction": predicted_inverse_label[0]
    }