import os
import gspread
from google.oauth2.service_account import Credentials
from flask import Flask
from dotenv import load_dotenv
load_dotenv()

SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]

app = Flask(__name__)
credentials = Credentials.from_service_account_file(
    "./token.json", scopes=SCOPES)
client = gspread.authorize(credentials)

@app.route("/")
def index():
    spreadsheet = client.open_by_key(os.environ["NAMELIST_SHEET_ID"])
    cells = spreadsheet.named_range("MemberData")
    return cells[1].value

app.run(host="127.0.0.1", port=5000)