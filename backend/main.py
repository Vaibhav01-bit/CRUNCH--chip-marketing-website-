from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Crunch Chips API")

# Allow CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Database
MOCK_STORES = [
    {"id": 1, "name": "Whole Foods Market", "address": "100 Premium Way, NY", "distance": "1.2 miles"},
    {"id": 2, "name": "Blinkit Dark Store", "address": "Sector 44, Mumbai", "distance": "2.5 miles"},
    {"id": 3, "name": "Zepto Hub", "address": "Andheri West, Mumbai", "distance": "3.0 miles"},
    {"id": 4, "name": "Target", "address": "500 Retail Blvd, LA", "distance": "5.1 miles"},
]

class NewsletterSub(BaseModel):
    email: str

@app.get("/api/stores/nearby")
async def get_nearby_stores():
    """Mock endpoint to find nearby stores"""
    return {"stores": MOCK_STORES}

@app.post("/api/newsletter/subscribe")
async def subscribe_newsletter(sub: NewsletterSub):
    """Mock endpoint to subscribe to newsletter"""
    # In a real app, save to DB here
    return {"message": f"Successfully subscribed {sub.email} to the Crunch Club! 🌶️"}

@app.post("/api/orders/checkout")
async def process_order():
    """Mock endpoint for online ordering"""
    return {"message": "Checkout session initiated successfully! (Mock Backend) 🛒"}

@app.get("/api/health")
async def health_check():
    return {"status": "crunching"}
