# Filename - server.py

# Import flask and datetime module for showing date and time
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text
import datetime

x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)
CORS(app)
db = SQLAlchemy()
#db_name = 'my_database.db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/my_database'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db.init_app(app)


@app.route('/', methods=['GET'])
def return_home():
    return jsonify(
        {
        'key': "value",
        'key2':'Welcome to the home page!'
        }
    )

# Route for seeing a data
@app.route('/data')
def get_time():

    # Returning an api for showing in  reactjs
    return {
        'Name':"geek", 
        "Age":"22",
        "Date":x, 
        "programming":"python"
        }

@app.route('/testDb', methods=['GET'])
def testdb():
    try:
        # Querying the users table
        result = db.session.execute(text('SELECT memberId, name FROM members')).fetchall()
        members = [{'memberId': row[0], 'name': row[1]} for row in result]
        
        # If no results found
        if not members:
            return '<h1>No data found.</h1>'

        # Return the result as JSON
        return jsonify(members)
    except Exception as e:
        # e holds description of the error
        error_text = "<p>The error:<br>" + str(e) + "</p>"
        hed = '<h1>Something is broken.</h1>'
        return hed + error_text

# Running app
if __name__ == '__main__':
    app.run(debug=True, port=8080)