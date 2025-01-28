import uvicorn
from fastapi import FastAPI
import sqlite3
import csv
from pluto.utils.utils import get_data_from_csv, get_table_headers_from_csv
from pluto.utils.db.manager import DatabaseManager
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

SEED_FILES = ['venues', 'games', 'simulations']
DATABASE_NAME=os.getenv('DATABASE_NAME', 'pluto.db')
SEED_FILE_DIRECTORY = './resources/'

def initialise(db):
    """Seed the database and perform any other initialization necessary."""
        
    for seed_file in SEED_FILES:
        # Extract headers and data
        headers = get_table_headers_from_csv(f"{SEED_FILE_DIRECTORY}{seed_file}")
        data = get_data_from_csv(f"{SEED_FILE_DIRECTORY}{seed_file}")
        
        db.create_new_empty_table_with_headers(table_name=seed_file, headers=headers)
        db.insert_data_into_database(table_name=seed_file, headers=headers, data=data)


@app.get("/games")
async def root():
    
    games = db.get_all_games()
    
    return {"games": games}

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/")
async def root():
    return {"message": "Hello World"}



if __name__ == "__main__":
    db = DatabaseManager(DATABASE_NAME)
    initialise(db)
    uvicorn.run('pluto.__main__:app', host="0.0.0.0", port=8000, reload=True)
