from flask import render_template, request
from app import app

# index view
@app.route('/')
def home():
    return render_template('index.html')
