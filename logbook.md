# Breaking things down

# Requirements
- [ ] docker compose up should be only command necessary for testing
- [ ] application should run on port 3000
- [ ] Allows the user to choose any game and displays relevant information
    - [ ] Shows the simulation results as side-by-side histogram, looking something like this
    - [ ] Displays the win percentage of the home team. The win percentage is the percentage of simulation runs in which this team beats the other selected team
    - [ ] Is containerised 

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

# Thoughts

- venues.csv - IDs and names of a few local cricket grounds
- simulations.csv - Mock simulated runs for the different teams
- games.csv - matchup information between different local teams


Ah so each venue has an associated ID, that needs to be it's own table
.. how do we know what team_id associates to what team name? ah nvm lol

# IMPORTANT
We are looking for clean solutions that can be extended in a straightforward way.