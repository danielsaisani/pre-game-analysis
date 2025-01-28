import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import csv
from pluto.utils.utils import get_data_from_csv, get_table_headers_from_csv
from pluto.utils.db.manager import DatabaseManager
from dotenv import load_dotenv
import os
from pydantic import BaseModel
import datetime

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SEED_FILES = ['venues', 'games', 'simulations']
DATABASE_NAME=os.getenv('DATABASE_NAME', 'pluto.db')
SEED_FILE_DIRECTORY = './resources/'

db = DatabaseManager(DATABASE_NAME)

class Game(BaseModel):
    home_team: str
    away_team: str
    date: datetime.datetime
    venue_id: str
    


def initialise(db):
    """Seed the database and perform any other initialization necessary."""
        
    for seed_file in SEED_FILES:
        # Extract headers and data
        headers = get_table_headers_from_csv(f"{SEED_FILE_DIRECTORY}{seed_file}")
        data = get_data_from_csv(f"{SEED_FILE_DIRECTORY}{seed_file}")
        
        db.create_new_empty_table_with_headers(table_name=seed_file, headers=headers)
        db.insert_data_into_database(table_name=seed_file, headers=headers, data=data)

@app.get("/games")
async def games() -> list[Game]:
    games = db.get_all_games()
    game_objects = [Game(home_team=game[0], away_team=game[1], date=game[2], venue_id=game[3]) for game in games]
    return game_objects

@app.get("/venueName/{venue_id}")
async def venue_name(venue_id: str) -> str:
    venue_name = db.get_venue_name_by_id(venue_id)
    print(venue_name)
    return venue_name


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    initialise(db)
    uvicorn.run('pluto.__main__:app', host="0.0.0.0", port=8000, reload=True)
