# Import necessary modules
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError
from pytz import timezone
import os
from dotenv import load_dotenv

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


# Load environment variables from a .env file
load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not set in the environment")

# Configuring the SQLAlchemy Database URI 
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/ChoirDatabase'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


x = datetime.now()


# Define a database model class for the 'Member' table
class Member(db.Model):
    __tablename__ = 'Member'
    member_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)  
    join_date = db.Column(db.Date, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    address_line_1 = db.Column(db.String(30), nullable=False)  
    address_line_2 = db.Column(db.String(30))  
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(2), nullable=False)
    postal_code = db.Column(db.String(5), nullable=False)


# Define a database model class for the 'MembershipHistory' table
class MembershipHistory(db.Model):
    __tablename__ = 'MembershipHistory'
    history_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    member_id = db.Column(db.Integer, db.ForeignKey('Member.member_id'), nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    cancellation_reason_id = db.Column(db.Integer, db.ForeignKey('CancellationReason.cancellation_reason_id'), nullable=False)  
    specific_reason = db.Column(db.Text, nullable=True)
    exit_feedback = db.Column(db.Text, nullable=True)
    is_eligible_for_return = db.Column(db.Boolean, default=True)
    notes = db.Column(db.Text, nullable=True)

# Define a database model class for the 'AbsenceReaso' table
class AbsenceReason(db.Model):
    __tablename__ = 'AbsenceReason'
    absence_reason_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    reason_category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    is_excused = db.Column(db.Boolean, default=False)
    
# Define a database model class for the 'VoicParts' table
class VoiceParts(db.Model):
    __tablename__ = 'VoiceParts'
    voice_part_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    member_id = db.Column(db.Integer, db.ForeignKey('Member.member_id'), nullable=False)
    voice_part = db.Column(db.String(20), nullable=False)

# Define a database model class for the 'CancellationReason' table
class CancellationReason(db.Model):
    __tablename__ = 'CancellationReason'
    cancellation_reason_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.Text, nullable=False)

# Define a database model class for the 'Notifications' table
class NotificationLog(db.Model):
    __tablename__ = 'NotificationLog'
    notification_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    section_leader = db.Column(db.Integer, db.ForeignKey('Member.member_id'), nullable=False)
    section_member = db.Column(db.Integer, db.ForeignKey('Member.member_id'), nullable=False)
    notification_time = db.Column(db.DateTime, nullable=False)
    message = db.Column(db.Text, nullable=False)

# Define a database model class for the 'Role' table
class Role(db.Model):
    __tablename__ = 'Role'
    role_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    member_id = db.Column(db.Integer, db.ForeignKey('Member.member_id'), nullable=False)
    role_type = db.Column(db.String(50), nullable=False)
    salary_amount = db.Column(db.Float, default=0.00)
    role_start_date = db.Column(db.Date, nullable=False)
    role_end_date = db.Column(db.Date)

# Define a database model class for the 'Attendance' table
class Attendance(db.Model):
    __tablename__ = 'PracticeAttendance'
    practice_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    member_id = db.Column(db.Integer, db.ForeignKey('Member.member_id'), nullable=False)
    practice_date = db.Column(db.Date, nullable=False)
    present = db.Column(db.Boolean, nullable=False)
    absence_reason_id = db.Column(db.Integer, db.ForeignKey('AbsenceReason.absence_reason_id'), nullable=True)  
    specific_reason = db.Column(db.String(255), nullable=True)
    record_time = db.Column(db.DateTime, default=lambda: datetime.now(timezone('EST')).replace(tzinfo=None))
    notified_in_advance = db.Column(db.Boolean, default=False)
    notes = db.Column(db.String(255), nullable=True)

# Define a database model class for the 'Payment' table
class Payment(db.Model):
    __tablename__ = 'Payment'
    payment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    member_id = db.Column(db.Integer, db.ForeignKey('Member.member_id'), nullable=False)
    payment_date = db.Column(db.DateTime, default=lambda: datetime.datetime.now(timezone('EST')), nullable=False)
    payment_amount = db.Column(db.Numeric(10, 2), nullable=False)
    payment_method = db.Column(db.String(50))


# Define a database model class for the 'Budget' table
class Budget(db.Model):
    __tablename__ = 'Budget'
    budget_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    budget_date_set = db.Column(db.Date, nullable=False)
    budget_amount = db.Column(db.Numeric(12, 2), nullable=False)  


# Define a User model 
class User(db.Model):
    __tablename__ = 'User'  
    # Table columns
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), unique=True, nullable=False)  # Email as the username
    password_hash = db.Column(db.String(255), nullable=False)  # Store hashed passwords

    def __init__(self, username, password):
        """
        create a new User object.
        Automatically hashes the provided password.
        Args:
            username (str): The user's email address.
            password (str): The user's plaintext password.
        """
        hashed_password = generate_password_hash(password)

        self.username = username
        self.password_hash = hashed_password # Securely hash the password

    def verify_password(self, password):
        """
        Verifies if the provided password matches the stored hashed password.
        Args:
            password (str): The plaintext password to verify.
        Returns:
            bool: True if the password matches, False otherwise.
        """
        return check_password_hash(self.password_hash, password)


# Create Endpoints to interact with Frontend

"""
    Register a new user after verifying their email exists in the Member table.

"""
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        username = data.get('username')  # User's email
        password = data.get('password')  # Plaintext password

        # Input validation
        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        # Check if the username exists in the Members table
        member = Member.query.filter_by(email=username).first()
        if not member:  # If the email does not exist in the Member table, return an error
            return jsonify({"error": "Your email was not verified"}), 400

        # Check if the user already exists in the User table
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:  # If the email already exists in the User table, return an error
            return jsonify({"error": "User already exists"}), 400

        # Create a new user
        new_user = User(
            username=username,  # Use the email as the username 
            password=password  # Hash the password securely CHANGED: now the User constructor hashes the password
        )
        db.session.add(new_user)  # Add the new user to the database session
        db.session.commit()  # Commit the transaction

        return jsonify({"message": "User registered successfully"}), 201

    except IntegrityError:  # Handle database integrity issues
        db.session.rollback()  # Rollback any partial transaction
        return jsonify({"error": "A user with this email already exists"}), 400

    except Exception as e:  # Handle unexpected exceptions
        app.logger.error(f"Error in register endpoint: {str(e)}")  # Log the error for debugging
        return jsonify({"error": "An error occurred during registration"}), 500


"""

    Authenticate a user, assign permissions based on roles, and generate a JWT token.


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')  # User's email
        password = data.get('password')  # Plain text password

        # Input validation
        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        # Find user in the database
        user = User.query.filter_by(username=username).first()
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({"error": "Invalid username or password"}), 401

        # Fetch the corresponding member row from the Member table
        member = Member.query.filter_by(email=username).first()
        if not member:
            return jsonify({"error": "No associated member found in the Member table"}), 404

        # Retrieve the user's roles from the Role table
        roles = Role.query.filter_by(member_id=member.member_id).all()

        # Initialize permissions (default all to False)
        permissions = {
            'canEditMusicalRoles': False,
            'canEditBoardRoles': False,
            'canAddMembers': False,
            'canChangeActiveStatus': False,
            'isAttendanceManager': False,
            'canViewFinancialData': False
        }

        # Define role-based permission mappings
        musical_roles = ['Accompanist', 'Director', 'BassSectionLeader', 'TenorSectionLeader', 'AltoSectionLeader', 'SopranoSectionLeader']
        board_roles = ['BoardMember', 'Treasurer', 'President']

        # Assign permissions based on the user's roles
        for role in roles:
            if role.role_type in musical_roles:
                permissions['canEditMusicalRoles'] = True
            if role.role_type in board_roles:
                permissions['canEditBoardRoles'] = True
                permissions['canViewFinancialData'] = True
            # These permissions are universal for all role-holders
            permissions['canAddMembers'] = True
            permissions['canChangeActiveStatus'] = True
            permissions['isAttendanceManager'] = True

         # Generate JWT token with Eastern Time expiration
        eastern = timezone('US/Eastern')  # Define Eastern Timezone
        token = jwt.encode({
            'user_id': user.user_id,
            'member_id': member.member_id,
            **permissions,
            'exp': datetime.now(eastern) + timedelta(hours=24)  # Eastern Time expiration
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({"message": "Login successful", "token": token}), 200

    except Exception as e:
        app.logger.error(f"Error in login endpoint: {str(e)}")
        return jsonify({"error": "An error occurred during login"}), 500
"""
"""
    Retrieve and construct user permissions dynamically based on roles using a provided JWT.

"""
#Permission endpoint
@app.route('/permissions', methods=['POST'])
def permissions():
    try:
        # Receive JWT from request
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Token is required"}), 400

        # Decode the JWT to get user data
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        member_id = decoded_token.get('member_id')
        if not member_id:
            return jsonify({"error": "Invalid token"}), 401


        # Define role-based permission mappings
        permissions = {
            'canEditMusicalRoles': False,
            'canEditBoardRoles': False,
            'canAddMembers': False,
            'canChangeActiveStatus': False,
            'isAttendanceManager': False,
            'canViewFinancialData': False,
        }

        # Fetch roles from the Role table for the member
        roles = Role.query.filter_by(member_id=member_id).all()
        if not roles:
            return jsonify({"permissions": permissions}), 200

        musical_roles = ['Accompanist', 'Director', 'BassSectionLeader', 'TenorSectionLeader', 'AltoSectionLeader', 'SopranoSectionLeader']
        board_roles = ['BoardMember', 'Treasurer', 'President']

        for role in roles:
            if role.role_type in musical_roles:
                permissions['canEditMusicalRoles'] = True
            if role.role_type in board_roles:
                permissions['canEditBoardRoles'] = True
                permissions['canViewFinancialData'] = True
            permissions['canAddMembers'] = True
            permissions['canChangeActiveStatus'] = True
            permissions['isAttendanceManager'] = True

        return jsonify({"permissions": permissions}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        print(f"Error in permissions endpoint: {str(e)}")
        app.logger.error(f"Error in permissions endpoint: {str(e)}")
        return jsonify({"error": "An error occurred"}), 500


"""
Authenticate the user and generate a JWT token with basic user information.

"""

# Login Endpoint
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')  # User's email
        password = data.get('password')  # Plain text password

        # Input validation
        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        # Find user in the database
        user = User.query.filter_by(username=username).first()
        if not user or not user.verify_password(password):
            return jsonify({"error": "Invalid username or password"}), 401

        # Fetch the corresponding member row from the Member table
        member = Member.query.filter_by(email=username).first()
        if not member:
            return jsonify({"error": "No associated member found in the Member table"}), 404

        # Generate JWT token
        eastern = timezone('US/Eastern')  # Define Eastern Timezone
        token = jwt.encode({
            'user_id': user.user_id,
            'member_id': member.member_id,
            'exp': datetime.now(eastern) + timedelta(hours=24)  # Eastern Time expiration
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({"message": "Login successful", "token": token}), 200

    except Exception as e:
        app.logger.error(f"Error in login endpoint: {str(e)}")
        return jsonify({"error": "An error occurred during login"}), 500

@app.route('/', methods=['GET'])
def return_home():
    return jsonify({'message': 'Welcome to the Choir Home Page!'}) # Return a welcome message for the home page


'''
Get User Permissions

Will send permissions of the logged in user, which will then be 
used to conditionally render the management tools that they have access to

Until we have authentication set up, just return True for everything
'''
@app.route('/getUserPermissions', methods=['GET'])
def getUserPermissions():
    try:

        permissions = {'canEditMusicalRoles': True, 
                       'canEditBoardRoles': True,
                       'canAddMembers' : True,
                        'canChangeActiveStatus': True
        }

        return jsonify(permissions)

    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error. Please try again later."}), 500


'''
Get all currently active members


'''
@app.route('/getActiveMembers', methods=['GET'])
def getActiveMembers():
    try:
        #print("GETTING ACTIVE MEMBERS")
        # Querying the users table
        result = db.session.execute(text('SELECT member_id, first_name, last_name FROM Member WHERE is_active = True')).fetchall()
        #print("Got result")
        members = [{'member_id': row[0], 'first_name': row[1], 'last_name' : row[2]} for row in result]
        
        #print(members)

        # If no results found
        if not members:
            print("ERROR, didnt find any active members")
            return '<h1>No data found.</h1>'

        # Return the result as JSON
        return jsonify(members)
    except Exception as e:
        print("GET ACTIVE MEMBERS FAILED")
        print(e)
        return None


'''
Generalized getter for role assignments
Will receive a list of types that are valid : 

Options:
    roleOptions =[
        'BoardMember', 
        'Treasurer', 
        'President'
        'Accompanist', 
        'Director', 
        'BassSectionLeader', 
        'TenorSectionLeader', 
        'AltoSectionLeader', 
        'SopranoSectionLeader']

    Will acess via request.json.get(roleOptions)

Steps:
- Get all role rows of with matching role_type 
- Inner join by Member id to add the corresponding Member rows
- Jsonify and return

'''
@app.route('/getRoleAssignmentsByType', methods=['POST'])
def getRoleAssignmentsByType():
    print("getRoleAssignmentsByType")
    try:

        print("GETTING ROLE ASSIGNMENTS OF TYPE:")
        print(request)
        role_options = request.json.get('role_types')
        print(role_options)

        query = text('''
            SELECT Role.role_id, Role.role_type, Role.member_id, Member.first_name, Member.last_name
            FROM Role
            INNER JOIN Member ON Role.member_id = Member.member_id
            WHERE Role.role_type IN :role_types
        ''')

        
        result = db.session.execute(query, {'role_types': tuple(role_options)}).fetchall()
        
        # Convert the result to a list of dictionaries
        role_assignments = [
            {
                "role_id": row.role_id,
                "role_type": row.role_type,
                "member_id": row.member_id,
                "first_name": row.first_name,
                "last_name": row.last_name
            }
            for row in result
        ]
        
        # Return the data as JSON
        return jsonify(role_assignments)
    except Exception as e:
        print("ERROR", e)
        return jsonify({"error": str(e)}), 400

'''
Given a role_id, and a role_type, update the role_type of 
the existing row in the Role table

If successful, return a json with the role_id and role_type
'''
@app.route('/updateExistingRole', methods=['POST', 'GET'])
def updateExistingRole():
    print("updating role assignment")
    try:

        role_id = request.json.get('role_id')
        role_type = request.json.get('role_type')

        query = text('''
            UPDATE Role
            SET role_type = :role_type
            WHERE role_id = :role_id
        ''')

        result = db.session.execute(query, {"role_id" : role_id, "role_type":role_type})
        db.session.commit()

        # Convert the result to a list of dictionaries
        updated_role_info = {
            "role_id" : role_id,
            "role_type" : role_type
        }
        
        # Return the data as JSON
        return jsonify(updated_role_info)
    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error. Please try again later."}), 500


'''
Given a roleId, delete the row from the table

'''
@app.route('/deleteRoleRow', methods=['POST', 'DELETE'])
def deleteRoleRow():
    print("deleting role assignment")

    try:
        role_id = request.json.get('role_id')

        query = text('''
            DELETE FROM Role
            WHERE role_id = :role_id
        ''')

        result = db.session.execute(query, {"role_id" : role_id})
        db.session.commit()

        # Convert the result to a list of dictionaries
        updated_role_info = {
            "role_id" : role_id,
        }
        
        # Return the data as JSON
        return jsonify(updated_role_info)

    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error. Please try again later."}), 500



'''
Create a new Role row, given a role_type and a member_id

CREATE TABLE Role (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    role_type VARCHAR(50) NOT NULL,
    salary_amount DECIMAL(10, 2) DEFAULT 0.00,
    role_start_date DATE NOT NULL,
    role_end_date DATE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id)


AFTER you add the row, query the DB to inner join this new Role row with their Member row.
Jsonify this, and return it
);
'''
@app.route('/assignNewRole', methods=['POST', 'GET'])
def assignNewRole():
    print("assigning new role")

    try:
        #problem: this is a name, instead of an int
        member_id = request.json.get('member_id')
        role_type = request.json.get('role_type')
        role_start_date = request.json.get('role_start_date')


        query = text('''
            INSERT INTO Role (member_id, role_type, role_start_date)
            VALUES (:member_id, :role_type, :role_start_date)
        ''')

        db.session.execute(query, {
            "member_id": member_id,
            "role_type": role_type,
            "role_start_date": role_start_date
        })
        db.session.commit()

        # Return the data as JSON
        return jsonify({'status' : 'successful add row'})

    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error. Please try again later."}), 500


'''
Return all entries from the voiceparts table, where the member is Active

USES:
    - Map Members -> Their voice part for attendance.

'''
@app.route('/getActiveVoiceParts', methods=['GET'])
def getActiveVoiceParts():
    try:
        results = db.session.query(VoiceParts, Member).join(Member).filter(Member.is_active == True).all()
        data = []
        for voice_part, member in results:
            data.append({
                "voice_part_id": voice_part.voice_part_id,
                "member_id": voice_part.member_id,
                "voice_part": voice_part.voice_part,
                "first_name": member.first_name,
                "last_name": member.last_name,
                "email": member.email,
                "join_date": member.join_date.isoformat(),  # Convert date to string
                "address_line_1": member.address_line_1,
                "address_line_2": member.address_line_2,
                "city": member.city,
                "state": member.state,
                "postal_code": member.postal_code
            })
        
        return jsonify(data), 200

    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error. Please try again later."}), 500



'''
Endpoint for adding a new voice part row

'''
@app.route('/addVoicePart', methods=['POST'])
def add_voice_part():
    try:
        data = request.json
        print(data)
        new_voice_part = VoiceParts( 
            member_id=data.get('member_id'), # Get member ID for association
            voice_part=data.get('voice_part') # Set the voice part
        )

        db.session.add(new_voice_part) # Add new voice part record

        db.session.commit() # Commit changes to the database
        return jsonify({"message": "Voice part added successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500 # Handle errors 

'''
Remove a voice part row, given its id

The Id will be accessible via: 
voice_part_id = request.json.get('voice_part_id')

'''
@app.route('/deleteVoicePart', methods=['POST', 'DELETE'])
def deleteVoicePart():
    print("deleting voice part assignment")

    try:
        voice_part_id = request.json.get('voice_part_id')

        query = text('''
            DELETE FROM VoiceParts
            WHERE voice_part_id = :voice_part_id
        ''')

        result = db.session.execute(query, {"voice_part_id" : voice_part_id})
        db.session.commit()

        updated_role_info = {
            "voice_part_id" : voice_part_id,
        }
        
        # Return the data as JSON
        return jsonify(updated_role_info)

    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error. Please try again later."}), 500


'''
Given a voice_part_id, and a voice_part, update the voice_part of 
the existing row in the VoiceParts table

If successful, return a json with the voice_part_id and voice_part
'''
@app.route('/updateExistingVoicePart', methods=['POST', 'GET'])
def updateExistingVoicePart():
    print("updating voice part assignment")
    try:

        voice_part_id = request.json.get('voice_part_id')
        voice_part = request.json.get('voice_part')

        query = text('''
            UPDATE VoiceParts
            SET voice_part = :voice_part
            WHERE voice_part_id = :voice_part_id
        ''')

        result = db.session.execute(query, {"voice_part_id" : voice_part_id, "voice_part":voice_part})
        db.session.commit()

        # Convert the result to a list of dictionaries
        updated_part_info = {
            "voice_part_id" : voice_part_id,
            "voice_part" : voice_part
        }
        
        # Return the data as JSON
        return jsonify(updated_part_info)
    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error. Please try again later."}), 500



'''
Method to retrieve potentially inactive members of the choir

NOTE: Currently does not account for excused absenses

If keep AbsenceReason table, can 
Left Join it into this. Then, add AND (is_excused = FALSE OR is_excused IS NULL)
to the where clause
'''
@app.route('/retrievePotentiallyInactiveMembers', methods=['POST', 'GET'])
def retrievePotentiallyInactiveMembers():
    try:
        #get number of practices
        practice_count_query = text("""
            SELECT COUNT(DISTINCT practice_date) AS practice_count
            FROM PracticeAttendance
        """)
        result = db.session.execute(practice_count_query).fetchone()

        #if there are under 5 practices, return empty list
        if result[0] < 5:
            print("Less than 5 distinct practice dates, returning empty list.")
            return jsonify([])

        #get the five most recent practices
        recent_practice_dates_query = text("""
            SELECT DISTINCT practice_date
            FROM PracticeAttendance
            ORDER BY practice_date DESC
            LIMIT 5
        """)
        recent_practice_dates = db.session.execute(recent_practice_dates_query).fetchall()
        recent_practice_dates = [row[0] for row in recent_practice_dates]  # Extract dates

        members_absent_query = text("""
            SELECT DISTINCT Member.member_id, Member.first_name, Member.last_name
            FROM Member
            LEFT JOIN PracticeAttendance 
                ON Member.member_id = PracticeAttendance.member_id
                AND PracticeAttendance.practice_date IN :recent_dates
            WHERE ((PracticeAttendance.present = FALSE OR PracticeAttendance.practice_date IS NULL)
            AND (Member.is_active = True))
            GROUP BY Member.member_id, Member.first_name, Member.last_name
            HAVING COUNT(DISTINCT PracticeAttendance.practice_date) = 5
        """)
        members_absent = db.session.execute(members_absent_query, {'recent_dates': tuple(recent_practice_dates)}).fetchall()

        #no members found, return empty list
        if not members_absent:
            print("No members found who missed all of the recent practices, returning empty list.")
            return jsonify([])

        absent_members_list = [
            {
                "member_id": row.member_id,
                "first_name": row.first_name,
                "last_name": row.last_name,
            }
            for row in members_absent
        ]

        return jsonify(absent_members_list)

    except Exception as e:
        print(f"Error: {str(e)}")  # Debugging line
        return jsonify({"error": str(e)}), 400

'''
Method to set a member as inactive

'''
@app.route('/setInactiveMember', methods=['POST'])
def setInactiveMember():
    try:
        member_id = request.json.get('member_id')
        print(member_id)
        member = db.session.query(Member).filter_by(member_id=member_id).first()

        if not member:
            return jsonify({"message": "Member not found"}), 404
        
        member.is_active = False
        db.session.commit()

        return (jsonify({'member_id' : member_id}))
    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error. Please try again later."}), 500
     


'''
Return the most recent budget
'''
@app.route('/getCurrentBudget', methods=['GET'])
def get_current_budget():
    try:
        recent_budget = Budget.query.order_by(Budget.budget_date_set.desc()).first()

        if recent_budget:
            return jsonify({
                'budget_amount': str(recent_budget.budget_amount),
                'budget_date_set': recent_budget.budget_date_set.strftime('%Y-%m-%d')
            })
        else:
            return jsonify({"error": "No budget found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
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
        app.logger.error(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error. Please try again later."}), 500


'''
Return a SUM of the payments between two input dates.

Dates will be accessible via:
date_1 = request.json.get('date_1') YYYY-MM-DD Format
date_2 = request.json.get('date_2')

'''
@app.route('/getPayments', methods=['POST'])
def getPayments():
    try:
        date_1_str = request.json.get('date_1')
        date_2_str = request.json.get('date_2')

        #date_1 = datetime.datetime.strptime(date_1_str, '%Y-%m-%d').replace(hour=0, minute=0, second=0, microsecond=0)
        #date_2 = datetime.datetime.strptime(date_2_str, '%Y-%m-%d').replace(hour=23, minute=59, second=59, microsecond=999999)

        print("IN GET PAYMENTS")
        #date_1 = datetime.datetime.strptime(request.json.get('date_1'), '%Y-%m-%d').date()
        #date_2 = datetime.datetime.strptime(request.json.get('date_2'), '%Y-%m-%d').date()
        payments = db.session.execute(text('''
            SELECT SUM(payment_amount) as total 
            FROM Payment 
            WHERE payment_date BETWEEN :date1 AND :date2
        '''), {'date1': date_1_str, 'date2': date_2_str}).fetchone()


        print(payments)
        total = payments.total if payments else 0
        print(total)
        
        return jsonify({"total_payments": total})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

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
        data = request.json # Extract data from the incoming JSON request

        required_fields = ["first_name", "last_name", "email", "join_date", "address_line_1", "city", "state", "postal_code"]
        missing_fields = [field for field in required_fields if not data.get(field) or data.get(field).strip() == ""]

        if missing_fields:
            raise ValueError(f"The following fields are required and cannot be empty: {', '.join(missing_fields)}")

        new_member = Member(
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            email=data.get('email'),
            join_date=data.get('join_date'),
            address_line_1=data.get('address_line_1'),
            address_line_2=data.get('address_line_2', ''), # Set default empty string for optional address field
            city=data.get('city'),
            state=data.get('state'),
            postal_code=data.get('postal_code')
        )
        db.session.add(new_member) # Add new member to the database snessio
        db.session.commit() # Commit changes to the database

        return jsonify( {"message": "Member added successfully"})
    #for non-unique email
    except IntegrityError:
        print("Email Error")
        return jsonify({'message': 'A member with this email already exists'}), 400
    except ValueError as e:
        print("Empty Field Error")
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error. Please try again later."}), 500


# Records an attendance entry for a member's practice session.
@app.route('/addAttendance', methods=['POST'])
def add_attendance():
    try:
        data = request.json

        practice_date = datetime.strptime(data.get('practice_date'), '%Y-%m-%d')

        existing_attendance = Attendance.query.filter_by(
            member_id=data.get('member_id'),
            practice_date=practice_date
        ).first()

        print(practice_date)

        if existing_attendance:
            print("UPDATING OLD ROW")

            # Update the existing record
            existing_attendance.present = data.get('present')
            existing_attendance.absence_reason_id = data.get('absence_reason_id')
            existing_attendance.notes = data.get('notes', existing_attendance.notes)
        else:
            print("ADDING NEW ROW")
            new_attendance = Attendance(
                member_id=data.get('member_id'),
                practice_date=practice_date, 
                present=data.get('present'),
                absence_reason_id=data.get('absence_reason_id'),
                specific_reason=data.get('specific_reason', ''), # Set default for specific reason
                notified_in_advance=data.get('notified_in_advance', False), # Set default for notified flag
                notes=data.get('notes', '') # Set default for notes
            )
            db.session.add(new_attendance)
        
        db.session.commit()
        return jsonify({"message": "Attendance record added successfully"})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@app.route('/getAbsenceReasons', methods=['GET'])
def getAbsenceReasons():
    absence_reasons = AbsenceReason.query.all()
    
    absence_reasons_list = [
        {
            "absence_reason_id": ar.absence_reason_id,
            "reason_category": ar.reason_category,
            "description": ar.description,
            "is_excused": ar.is_excused
        }
        for ar in absence_reasons
    ]
    
    return jsonify(absence_reasons_list)


# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=8080)

