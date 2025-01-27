import uvicorn
from fastapi import FastAPI
import sqlite3
import csv

app = FastAPI()

SEED_FILES = ['venues', 'games', 'simulations']

def get_table_headers_from_csv(filename):
    with open(filename, newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='|')
        return reader[0]

def get_data_from_csv(filename): 
    data=[]
    with open(filename, newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='|')
        # Ignore the header names
        for row in reader[1:]:
            data.append(row)
    return data


def initialise():
    """Seed the database and perform any other initialization necessary."""
    con = sqlite3.connect("pluto.db")
    cur = con.cursor()
    
    first = SEED_FILES[0]
    
    first_headers = get_table_headers_from_csv(first)

    first_headers_string = ", ".join([header for header in first_headers])
    
    # Initialise table containing the venues and their associated ID's from the CSV
    cur.execute(f"CREATE TABLE {first}({first_headers_string})")


@app.get("/gameInformation")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    initialise()
    uvicorn.run('pluto.__main__:app', host="0.0.0.0", port=8000, reload=True)
