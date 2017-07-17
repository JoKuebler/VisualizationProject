#!flask/bin/python
from flask import Flask, render_template, request, make_response, url_for, abort, session
import os
import sys
import json
import random
import pandas as pd

app = Flask(__name__)

# read in data
def makedataAlice00():
    with open('Alice00.json') as data_file:
        #data = pd.read_csv(data_file, ';')
        data = json.load(data_file)
    return data

def makedataBob00():
    with open('Bob00.json') as data_file:
        #data = pd.read_csv(data_file, ';')
        data = json.load(data_file)
    return data

# default route
@app.route('/')
def main():
    return render_template('index.html', data=json.dumps(makedataAlice00()))

if __name__ == '__main__':
    # main()
    app.run(debug=True)
