import sqlite3

class DatabaseManager:
    
    def __init__(self, database_name):
        self.DATABASE_NAME=database_name
        self.con = sqlite3.connect(database_name)
        self.cur = self.con.cursor()
    
    def create_new_empty_table_with_headers(self, table_name, headers):
        
        try:
            # Create table dynamically based on headers
            headers_string = ", ".join(headers)
            self.cur.execute(f"CREATE TABLE IF NOT EXISTS {table_name} ({headers_string})")
            self.con.commit()
            return True
        except Exception as e:
            return False
    def insert_data_into_database(self, table_name, headers, data):
        try:
            placeholders = ", ".join(["?"] * len(headers))  # Generate placeholders for values
            self.cur.executemany(f"INSERT INTO {table_name} VALUES ({placeholders})", data)
            self.con.commit()
            return True
        except Exception as e:
            return False
    
    def get_all_games(self):
        try:
            games = self.cur.execute("SELECT * FROM games")
            return games
        except Exception as e:
            return false
    
    def get_venue_name_by_id(self, venue_id):
        try:
            venue_name = self.cur.execute(f"SELECT venue_name FROM venues WHERE venue_id={venue_id}")
            return venue_name
        except Exception as e:
            return false