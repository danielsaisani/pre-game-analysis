import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import HTTPException

import sqlite3
import csv

from pluto.utils.utils import get_data_from_csv, get_table_headers_from_csv
from pluto.utils.db.manager import DatabaseManager
from pluto.models.generic import Game, Simulation

from dotenv import load_dotenv
import os
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


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
    logger.info(f"Retrieving all games.")
    games = db.get_all_games()
    if not games:
        raise HTTPException(status_code=500, detail="Failed to retrieve all games, we have our best people on it.") 
    game_objects = [Game(home_team=game[0], away_team=game[1], date=game[2], venue_id=game[3]) for game in games]
    return game_objects

@app.get("/venueName/{venue_id}")
async def venue_name(venue_id: str) -> str:
    logging.info(f"Retrieving venue name for venue_id {venue_id}")
    venue_name = db.get_venue_name_by_id(venue_id)
    if not venue_name:
        raise HTTPException(status_code=500, detail="Failed to retrieve venue name for team, we have our best people on it.") 
    return venue_name


@app.get("/simulations/{team_name}")
async def simulations(team_name: str) -> list[Simulation]:
    logger.info(f"Retrieving simulations for team {team_name}")
    simulations = db.get_simulations_for_team(team_name=team_name)
    if not simulations:
        raise HTTPException(status_code=500, detail="Failed to retrieve simulations for team, we have our best people on it.") 
    simulation_objects = [Simulation(team_name=simulation[0], simulation_run=int(simulation[1]), results=int(simulation[2])) for simulation in simulations]
    return simulation_objects
    

@app.get("/")
async def root():
    return {"message": "Hello Pluto World"}

if __name__ == "__main__":
    logger.info('Initialising application')
    initialise(db)
    uvicorn.run('pluto.__main__:app', host="0.0.0.0", port=8000, reload=True)
