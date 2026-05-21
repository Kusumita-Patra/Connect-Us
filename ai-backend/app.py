
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile
from ultralytics import YOLO
import shutil

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO("yolov8n.pt")

@app.get("/")
def home():
    return {"message": "AI Backend Running"}

@app.post("/predict")
async def predict(file: UploadFile):

    file_path = file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    results = model(file_path)

    detections = []

    for result in results:
        boxes = result.boxes

        for box in boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])

            detections.append({
                "class": model.names[class_id],
                "confidence": confidence
            })

    return {
        "detections": detections
    }