import os
import gspread
from google.oauth2.service_account import Credentials
from dotenv import load_dotenv
load_dotenv()

SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]

credentials = Credentials.from_service_account_file(
    "./token.json", scopes=SCOPES)
client = gspread.authorize(credentials)

spreadsheet = client.open_by_key(os.environ["NAMELIST_SHEET_ID"])
cells = spreadsheet.named_range("MemberData")
print(cells)