# Filename - server.py

# Import flask and datetime module for showing date and time
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text
import datetime
from flask import request

x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type"])
db = SQLAlchemy()
#db_name = 'my_database.db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/my_database'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db.init_app(app)

'''
Endpoint for the frontend's home page. 
(Endpoint just defines an address where the 
frontend can requests data from, or sends data to)
'''
@app.route('/', methods=['GET'])
def return_home():
    return jsonify(
        {
        'key': "value",
        'key2':'Welcome to the home page!'
        }
    )


'''
Endpoint that just returns a JSON

'''
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

'''
Method to query the db, and just get all Members in a JSON 
'''
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

'''
Method to post into the DB
'''
@app.route('/testPost', methods=['POST', 'OPTIONS'])
def testPost():
    if request.method == 'OPTIONS':
        # Handle preflight OPTIONS request
        response = app.make_response("")
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    if request.method == 'POST':
        try:
            print(request)

            # Extracting data from the request
            name = request.json.get('name')  # Assumes JSON input with {"name": "testName"}

            # Executing the INSERT statement with a parameterized query
            db.session.execute(text('INSERT INTO members (name) VALUES (:name)'), {"name": name})

            # Committing the transaction to save changes
            db.session.commit()

            return jsonify({"message": "Data inserted successfully"})

        except Exception as e:
            print(str(e))
            return jsonify({"error": str(e)}), 400


# Running app
if __name__ == '__main__':
    app.run(debug=True, port=8080)