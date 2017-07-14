#!flask/bin/python
from flask import Flask, render_template, request, make_response, url_for, abort, session
import os
import sys
import json
import random
import pandas as pd

app = Flask(__name__)

# read in vehicle data
def makedata():
    with open('example.json') as data_file:
        #data = pd.read_csv(data_file, ';')
        data = json.load(data_file)
    return data

# default route
@app.route('/')
def main():
    return render_template('zoomchart.html', data=json.dumps(makedata()))

# route for bubbleChart
@app.route('/bubblechart')
def bubbleChart():
    return render_template('zoomchart.html', data=json.dumps(makedata()))

if __name__ == '__main__':
    # main()
    app.run(debug=True)
