from datetime import datetime

def get_time():
    now = datetime.now()
    now = now.strftime("%Y-%m-%d-%H-%M-%S")
    return now