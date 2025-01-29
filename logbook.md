# Breaking things down

# Monolith

# Requirements
- [x] database that stores the csv data inside it and re-initialises on every startup of docker container
- [ ] docker compose up should be only command necessary for testing
- [x] application should run on port 3000
- [x] Allows the user to choose any game and displays relevant information
    - [x] Shows the simulation results as side-by-side histogram, looking something like this
    - [x] Displays the win percentage of the home team. The win percentage is the percentage of simulation runs in which this team beats the other selected team
    - [x] Is containerised 

# Solution
    ## Database
        - Contains tables to store the CSV files
    ## Backend
        - use FastAPI for API
        - seed the database on startup with csv files
    ## Frontend
        - use React for basic interface
    ## Deployment 
        ### Dockerfile
            - Dockerfile for backend
            - Dockerfile for frontend
        ### Docker compose file
            - Docker compose file to start both containers on proper ports and expose port 3000 for frontend
        ### Custom CLI tooling
            - Add command to restart entire cluster of docker containers and start from scratch by deleting previous docker containers
# Thoughts

- venues.csv - IDs and names of a few local cricket grounds
- simulations.csv - Mock simulated runs for the different teams
- games.csv - matchup information between different local teams


Ah so each venue has an associated ID, that needs to be it's own table
.. how do we know what team_id associates to what team name? ah nvm lol


- each game when clicked on -> get the venue name from the venue ID -> get the simulation data necessary -> pass venue id and simulation data into modal
ah no no
- each game should pull the simulation data for each team involved
    - display the simulation data as a histogram
    - display the percentage of simulated wins of the home team vs the away team

- Make sure to include logging

# IMPORTANT
We are looking for clean solutions that can be extended in a straightforward way.