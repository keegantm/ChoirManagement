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
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

#CORS(app, origins=["http://localhost:3000"], methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type"])
db = SQLAlchemy()
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/ChoirDatabase'
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
Return all active members, who joined on or after the given date

USES:
    - get members for current day attendance
    - searching the names of members, to see current roles & edit these roles

The date will be accessible via: 
date = request.json.get('date') Expected format: 'YYYY-MM-DD'
'''
@app.route('/getActiveAfterDate', methods=['GET'])
def getActiveMembers():
    try:

        return
    except Exception as e:
        print(str(e))

'''
Return all entries from the voiceparts table, where the member is Active

USES:
    - Map Members -> Their voice part for attendance.

'''
@app.route('/getActiveVoiceParts', methods=['GET'])
def getActiveVoiceParts():
    try:

        return
    except Exception as e:
        print(str(e))

'''
Insert a new voice part row
'''
@app.route('/insertVoicePart', methods=['POST'])
def insertVoicePart():
    try:

        return
    except Exception as e:
        print(str(e))

'''
Remove a voice part row, given its id

The Id will be accessible via: 
voice_part_id = request.json.get('voice_part_id')

'''
@app.route('/deleteVoicePart', methods=['POST'])
def deleteVoicePart():
    try:

        return
    except Exception as e:
        print(str(e))

'''
Insert new attendance records into the Attendance table.
Expect values in the json exactly as they appear in the schema

CREATE TABLE PracticeAttendance (
    practice_id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    practice_date DATE NOT NULL,
    present BOOLEAN NOT NULL,
    absence_reason_id INT,
    specific_reason TEXT,
    record_time TIMESTAMP NOT NULL,
    notified_in_advance BOOLEAN DEFAULT FALSE,
    notes TEXT,
    FOREIGN KEY (member_id) REFERENCES Member(member_id),
    FOREIGN KEY (absence_reason_id) REFERENCES AbsenceReason(absence_reason_id)
);
'''
@app.route('/insertNewAttendanceRecords', methods=['POST'])
def insertNewAttendanceRecords():
    try:

        return
    except Exception as e:
        print(str(e))

'''
Return all rows of the Role table, who are active members

USES:
    - Display current role assignments

'''
@app.route('/getRoleAssignments', methods=['GET'])
def getRoleAssignments():
    try:

        return
    except Exception as e:
        print(str(e))

'''
Create a new Role row.
Expect values in the json exactly as they appear in the schema

CREATE TABLE Role (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    role_type VARCHAR(50) NOT NULL,
    salary_amount DECIMAL(10, 2) DEFAULT 0.00,
    role_start_date DATE NOT NULL,
    role_end_date DATE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);
'''
@app.route('/assignNewRole', methods=['POST'])
def assignNewRole():
    try:

        return
    except Exception as e:
        print(str(e))

'''
Given a roleId, update its data with the input JSON
Expect values in the json exactly as they appear in the schema


'''
@app.route('/updateExistingRole', methods=['POST'])
def updateExistingRole():
    try:

        return
    except Exception as e:
        print(str(e))

'''
Given a roleId, delete the row from the table

'''
@app.route('/deleteRoleRow', methods=['POST'])
def deleteRoleRow():
    try:

        return
    except Exception as e:
        print(str(e))


'''
Return all members, along with their roles, who have a salary.

    Uses: - Display financial data
'''
@app.route('/getSalariedMembers', methods=['GET'])
def getSalariedMembers():
    try:

        return
    except Exception as e:
        print(str(e))


'''
Return the budget for the current financial year. Financial year is defined as between JUNE and JULY

Ex: June 1st 2023 - July 31st 2024 is a financial year
May be able to just return the most recently set budget.
'''
@app.route('/getCurrentBudget', methods=['GET'])
def getCurrentBudget():
    try:
        return
    except Exception as e:
        print(str(e))
    
'''
Create a new budget row, from the input date and amount

    budget_id INT PRIMARY KEY AUTO_INCREMENT,
    budget_date_set DATE NOT NULL,
    budget_amount DECIMAL(12, 2) NOT NULL

'''
@app.route('/setBudget', methods=['POST'])
def setBudget():
    try:
        return
    except Exception as e:
        print(str(e))

'''
Return a SUM of the payments between two input dates.

Dates will be accessible via:
date_1 = request.json.get('date_1') YYYY-MM-DD Format
date_2 = request.json.get('date_2')

'''
@app.route('/getPayments', methods=['GET'])
def getPayments():
    try:
        return
    except Exception as e:
        print(str(e))

'''
Method to add a member to the Member table.

Expect key names exactly as they appear in the Schema 
    member_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(80) UNIQUE NOT NULL,
    join_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    address_line_1 VARCHAR(50) NOT NULL,
    address_line_2 VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    state CHAR(2) NOT NULL,
    postal_code VARCHAR(5) NOT NULL

'''
@app.route('/addMember', methods=['POST'])
def addMember():
    try:
        return
    except Exception as e:
        print(str(e))

'''
Method to query the db, and just get all Members in a JSON 
'''
@app.route('/testDb', methods=['GET'])
def testdb():
    try:
        # Querying the users table
        result = db.session.execute(text('SELECT memberId, first_name FROM Member')).fetchall()
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
Example method of how to post into the DB
'''
@app.route('/testPost', methods=['POST'])
def testPost():
    if request.method == 'POST':
        try:
            # Extracting data from the request
            first_name = request.json.get('name')  # Assumes JSON input with {"name": "testName"}
            
            # Define default values for other columns
            last_name = "Doe"
            email = f"{first_name.lower()}@example.com"
            join_date = x.today()  # Use today's date as join date
            is_active = True
            address_line_1 = "123 Main St"
            address_line_2 = ""
            city = "Sample City"
            state = "SC"
            postal_code = "12345"

            # Executing the INSERT statement with a parameterized query
            db.session.execute(
                text('''
                    INSERT INTO Member (
                        first_name, last_name, email, join_date, is_active,
                        address_line_1, address_line_2, city, state, postal_code
                    ) VALUES (
                        :first_name, :last_name, :email, :join_date, :is_active,
                        :address_line_1, :address_line_2, :city, :state, :postal_code
                    )
                '''),
                {
                    "first_name": first_name,
                    "last_name": last_name,
                    "email": email,
                    "join_date": join_date,
                    "is_active": is_active,
                    "address_line_1": address_line_1,
                    "address_line_2": address_line_2,
                    "city": city,
                    "state": state,
                    "postal_code": postal_code
                }
            )

            # Committing the transaction to save changes
            db.session.commit()

            return jsonify({"message": "Data inserted successfully"})

        except Exception as e:
            print(str(e))
            return jsonify({"error": str(e)}), 400


# Running app
if __name__ == '__main__':
    app.run(debug=True, port=8080)