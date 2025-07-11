from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from model import AnimalCNN
import torch
from torchvision import transforms
from PIL import Image
import io

app = FastAPI()

# CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # productionda frontend domenini yozasiz
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
class_names = ['mushuk', 'it', 'fil', 'ot', 'sher']
model = AnimalCNN(num_classes=len(class_names))
model.load_state_dict(torch.load("animal_cnn_model.pt", map_location=torch.device("cpu")))
model.eval()

# Image transform
transform = transforms.Compose([
    transforms.Resize((64, 64)),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data)).convert("RGB")
    input_tensor = transform(image).unsqueeze(0)  # type: ignore # [1, 3, 64, 64]

    with torch.no_grad():
        output = model(input_tensor)
        probabilities = torch.nn.functional.softmax(output[0], dim=0)
        predicted_idx = torch.argmax(probabilities).item()
        predicted_class = class_names[predicted_idx] # type: ignore
        confidence = probabilities[predicted_idx].item() # type: ignore

    return {
        "predicted_class": predicted_class,
        "probability": round(confidence, 4)
    }  
