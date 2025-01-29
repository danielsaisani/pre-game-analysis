from pydantic import BaseModel
import datetime

class Game(BaseModel):
    home_team: str
    away_team: str
    date: datetime.datetime
    venue_id: str

class Simulation(BaseModel):
    team_name: str
    simulation_run: int
    results: int