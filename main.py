#!flask/bin/python
from flask import Flask, render_template, request, make_response, url_for, abort, session
import os
import sys
import json
import random
import pandas as pd

app = Flask(__name__)

# read in data
def makedata(filelist):

    dict = {}
    print(filelist)
    for file in filelist:
        with open(file) as data_file:
            data = json.load(data_file)
        dict[file] = data
    return dict

# default route
@app.route('/')
def main():

    return render_template('index.html', data=json.dumps(makedata({'Alice00.json', 'Bob00.json', 'Alice01.json', 'Bob01.json', 'Alice03.json', 'Bob03.json', 'Alice06.json', 'Bob06.json', 'Alice08.json', 'Bob08.json', 'Alice34.json', 'Bob34.json'})))

if __name__ == '__main__':
    # main()
    app.run(debug=True)
