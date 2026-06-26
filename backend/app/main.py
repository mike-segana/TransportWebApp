from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.api import auth, drivers, shipments, assignment, requests
from dotenv import load_dotenv
import os

load_dotenv()
URL = os.getenv('API_URL')
#creates main application object - all endpoints (routes) must attach to this app directly or indirectly
app = FastAPI()

Base.metadata.create_all(bind=engine)
#middleware
#prevent cors erros that may arise from frontend
#allows frontend url to make requests to the backend
app.add_middleware(CORSMiddleware, 
                   #allow_origins=['lhst...'], #use .env variables
                   allow_origins=[URL],
                   allow_credentials=True, 
                   allow_methods=['*'], 
                   allow_headers=['*'])

#@app.get("/")
#def health_check():
    #return 'Health check complete'

#means "take all endpoints defined in these routers and attach them to the main app"
app.include_router(auth.router)
app.include_router(shipments.router)
app.include_router(drivers.router)
app.include_router(assignment.router)
app.include_router(requests.router)