import csv

def get_table_headers_from_csv(path):
    with open(f"{path}.csv", newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='|')
        return reader.__next__()

def get_data_from_csv(path): 
    with open(f"{path}.csv", newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='|')
        # Ignore the header names
        next(reader)
        return [row for row in reader]  # Return all data rows