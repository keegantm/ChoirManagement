# Import necessary modules
from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy.sql import text
import jwt
from datetime import datetime, timedelta
from sqlalchemy.exc import IntegrityError
from pytz import timezone
import os
from dotenv import load_dotenv
#from db_models import db
from db_models import *
from flask_restx import Resource, Namespace
from input_models import test_post_model, credentials_input_model, role_update_input_model, role_add_input_model, voice_part_add_input_model, voice_part_add_input_model, add_member_input_model, attendance_input_model
from extensions import api, db

#initialize Flask app
app = Flask(__name__)

#configuring the SQLAlchemy Database URI 
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/ChoirDatabase'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

api.init_app(app)
db.init_app(app)

#create database models
with app.app_context():
    db.create_all()
print(db.metadata.tables.keys())

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

#load environment variables from a .env file
load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not set in the environment")

ns = Namespace("api")

@ns.route("/testGet")
class Hello(Resource):
    def get(self):
        return {"hello" : "restx"}, 200
    
@ns.route("/testPost/<int:id>")
@ns.expect(test_post_model)
class Hello(Resource):
    def post(self, id):
        print("Received ID:", id)
        data = request.get_json()  # Get JSON payload
        print("Received Data:", data)
        print(ns.payload)
        return {"success": "sure"}, 200

"""
Permissions
    - Retrieve and construct a user's permissions dynamically based on their role assignments
    - Verify the user using a provided JWT.

    Available Permissions:
        'canEditMusicalRoles',
        'canEditBoardRoles',
        'canAddMembers',
        'canChangeActiveStatus',
        'isAttendanceManager',
        'canViewFinancialData',

    Some permissions are restricted to users with musical roles, 
    and some permissions are restricted to users with administrative roles

"""
@ns.route("/permissions")
class GeneratePermissions(Resource):
    def get(self):
        try:
            print(f"Authorization Header: {request.headers.get('Authorization')}")

            #receive JWT from request
            token = request.headers.get('Authorization')
            if not token:
                return {"error": "Token is required"}, 400

            #decode the JWT to get user data
            decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            member_id = decoded_token.get('member_id')
            if not member_id:
                return {"error": "Invalid token"}, 401

            #define role-based permission mappings
            permissions = {
                'canEditMusicalRoles': False,
                'canEditBoardRoles': False,
                'canAddMembers': False,
                'canChangeActiveStatus': False,
                'isAttendanceManager': False,
                'canViewFinancialData': False,
            }

            #fetch roles from the Role table for the member
            roles = Role.query.filter_by(member_id=member_id).all()
            if not roles:
                return {"permissions": permissions}, 200

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

            return {"permissions": permissions}, 200

        #jwt exceptions can be thrown in decoding
        except jwt.ExpiredSignatureError:
            return {"error": "Token has expired"}, 401
        except jwt.InvalidTokenError:
            return {"error": "Invalid token"}, 401
        except Exception as e:
            print(f"Error in permissions endpoint: {str(e)}")
            app.logger.error(f"Error in permissions endpoint: {str(e)}")
            return {"error": "An error occurred"}, 500

"""
Register
    - Register a new user after verifying their email exists in the Member table.
"""
@ns.route("/register")
@ns.expect(credentials_input_model)
class Register(Resource):
    def post(self):
        try:
            data = request.get_json()

            print(data)

            username = data.get('username')
            password = data.get('password')

            #input validation
            if not username or not password:
                return {"error": "Username and password are required"}, 400

            #check if the username exists in the Members table
            member = Member.query.filter_by(email=username).first()
            if not member:  # If the email does not exist in the Member table, return an error
                return {"error": "Your email was not verified"}, 400

            #check if the user already exists in the User table
            existing_user = User.query.filter_by(username=username).first()
            if existing_user:  # If the email already exists in the User table, return an error
                return {"error": "User already exists"}, 400

            #create a new user
            new_user = User(
                username=username,  # Use the email as the username 
                password=password  # Hash the password securely CHANGED: now the User constructor hashes the password
            )
            db.session.add(new_user)  # Add the new user to the database session
            db.session.commit()  # Commit the transaction

            return {"message": "User registered successfully"}, 201

        except Exception as e:  #handle unexpected exceptions
            app.logger.error(f"Error in register endpoint: {str(e)}")  # Log the error for debugging
            return {"error": "An error occurred during registration"}, 500

"""
Login
- Authenticate the user and generate a JWT token with basic user information.
"""
@ns.route("/login")
@ns.expect(credentials_input_model)
class Login(Resource):
    def post(self):
        try:
            data = request.get_json()
            print(data)
            username = data.get('username')
            password = data.get('password')

            #input validation
            if not username or not password:
                print("Username and password are required")
                return {"error": "Username and password are required"}, 400

            #find user in the database
            user = User.query.filter_by(username=username).first()
            if not user or not user.verify_password(password):
                print("Invalid username or password")
                return {"error": "Invalid username or password"}, 401

            #fetch the corresponding member row from the Member table
            member = Member.query.filter_by(email=username).first()
            if not member:
                print("No associated member found in the Member table")
                return {"error": "No associated member found in the Member table"}, 404

            #fenerate JWT token
            eastern = timezone('US/Eastern')  # Define Eastern Timezone
            token = jwt.encode({
                'user_id': user.user_id,
                'member_id': member.member_id,
                'exp': datetime.now(eastern) + timedelta(hours=24)  # Eastern Time expiration
            }, SECRET_KEY, algorithm='HS256')

            return jsonify({"message": "Login successful", "token": token})

        except Exception as e:
            app.logger.error(f"Error in login endpoint: {str(e)}")
            return {"error": "An error occurred during login"}, 500

"""
Home Page, 
    - Just tests connection to backend
"""
@ns.route("/home")
class Home(Resource):
    def get(self):
        return jsonify({'message': 'Welcome to the Choir Home Page!'})

'''
Get all currently active members

'''
@ns.route("/MembersList")
class MembersList(Resource):
    def get(self):
        try:
            #print("GETTING ACTIVE MEMBERS")
            #querying the users table
            result = db.session.execute(text('SELECT member_id, first_name, last_name FROM Member WHERE is_active = True')).fetchall()
            members = [{'member_id': row[0], 'first_name': row[1], 'last_name' : row[2]} for row in result]
        

            #if no results found
            if not members:
                print("ERROR, didnt find any active members")
                return '<h1>No data found.</h1>'

            #return the result as JSON
            return jsonify(members)
        except Exception as e:
            print(f"Error in MembersList: {str(e)}")
            app.logger.error(f"Error in MembersList: {str(e)}")
            return {"error": "An error occurred in MembersList"}, 500

''' 
Returns all members (and their role) who have a role of the input types

Will receive a string of types separated by commas : 
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

'''
@ns.route("/RoleList/<string:roles>")
class RoleList(Resource):
    def get(self, roles=""):
        try:
            role_options = roles.strip().split(",")

            print(role_options)

            query = text('''
                SELECT Role.role_id, Role.role_type, Role.member_id, Member.first_name, Member.last_name
                FROM Role
                INNER JOIN Member ON Role.member_id = Member.member_id
                WHERE Role.role_type IN :role_types
            ''')

            result = db.session.execute(query, {'role_types': tuple(role_options)}).fetchall()
            
            #convert the result to a list of dictionaries
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
            
            #return the data as JSON
            return jsonify(role_assignments)
        except Exception as e:
            print(f"Error in RoleList endpoint: {str(e)}")
            app.logger.error(f"Error in RoleList endpoint: {str(e)}")
            return {"error": "An error occurred in RoleList"}, 500

@ns.route("/RoleChange/<int:role_id>")
class RoleChange(Resource):

    '''
    Update Existing Role

        - Given a role_id, and a role_type, update the role_type of 
        the existing row in the Role table
        - If successful, return a json with the role_id and role_type
    '''
    @ns.expect(role_update_input_model)
    def patch(self, role_id):
        try:
            data = request.get_json()
            print(data)
            role_type = data.get('role_type')

            query = text('''
                UPDATE Role
                SET role_type = :role_type
                WHERE role_id = :role_id
            ''')

            result = db.session.execute(query, {"role_id" : role_id, "role_type":role_type})
            db.session.commit()

            # convert the result to a dictionary
            updated_role_info = {
                "role_id" : role_id,
                "role_type" : role_type
            }
            
            #return the data as JSON
            return jsonify(updated_role_info)
        except Exception as e:
            print(f"Error in updateExistingRole endpoint: {str(e)}")
            app.logger.error(f"Error in updateExistingRole endpoint: {str(e)}")
            return {"error": "An error occurred in updateExistingRole"}, 500
    
    '''
    Delete Existing Role Row

        - Given a role_id, delete the record
    ''' 
    def delete(self, role_id):
        try:

            query = text('''
                DELETE FROM Role
                WHERE role_id = :role_id
            ''')

            result = db.session.execute(query, {"role_id" : role_id})
            db.session.commit()

            #convert the result to a dictionary
            updated_role_info = {
                "role_id" : role_id,
            }
            
            #return the data as JSON
            return jsonify(updated_role_info)

        except Exception as e:
            print(f"Error in deleteRoleRow endpoint: {str(e)}")
            app.logger.error(f"Error in deleteRoleRow endpoint: {str(e)}")
            return {"error": "An error occurred in deleteRoleRow"}, 500


'''
Assign New Role

    - Create a new Role assignment, given a role_type and a member_id

CREATE TABLE Role (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    role_type VARCHAR(50) NOT NULL,
    salary_amount DECIMAL(10, 2) DEFAULT 0.00,
    role_start_date DATE NOT NULL,
    role_end_date DATE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id)

'''
@ns.route("/RoleAdd/<int:member_id>")
class RoleAdd(Resource):
    @ns.expect(role_add_input_model)
    def post(self, member_id):
        try:
            data = request.get_json()
            role_type = data.get('role_type')
            role_start_date = data.get('role_start_date')

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
            return {'status' : 'successful add row'}, 201

        except Exception as e:
            print(f"Error in assignNewRole endpoint: {str(e)}")
            app.logger.error(f"Error in assignNewRole endpoint: {str(e)}")
            return {"error": "An error occurred in assignNewRole"}, 500

@ns.route("/VoiceParts")
class VoicePartsResource(Resource):
    '''
    Get Voice Parts of Active Members
        - Get all voice parts of active members
        - Couple members to the voice parts
    '''
    def get(self):
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
            
            return jsonify(data)

        except Exception as e:
            print(f"Error in getActiveVoiceParts endpoint: {str(e)}")
            app.logger.error(f"Error in getActiveVoiceParts endpoint: {str(e)}")
            return {"error": "An error occurred in getActiveVoiceParts"}, 500

    '''
    Add a new Voice Parts assignment
        - Uses an input mamber_id and voice_part
    '''
    @ns.expect(voice_part_add_input_model)
    def post(self):
        try:
            data = request.json
            print(data)
            new_voice_part = VoiceParts( 
                member_id=data.get('member_id'), #member ID
                voice_part=data.get('voice_part') #the voice part
            )

            db.session.add(new_voice_part) #add new voice part record

            db.session.commit() #commit changes to the database
            return {"message": "Voice part added successfully"}, 201
        except Exception as e:
            print(f"Error in addVoicePart endpoint: {str(e)}")
            app.logger.error(f"Error in addVoicePart endpoint: {str(e)}")
            return {"error": "An error occurred in addVoicePart"}, 500

@ns.route("/VoiceParts/<int:voice_part_id>")
class VoicePartChange(Resource):

    '''
    Update Existing Voice Part

    - Given a voice_part_id, and a voice_part, update the voice_part of 
    the existing row in the VoiceParts table
    - If successful, return a json with the voice_part_id and voice_part
    '''
    @ns.expect(voice_part_add_input_model)
    def patch(self, voice_part_id):
        try:
            data = request.get_json()
            #voice_part_id = data.get('voice_part_id')
            voice_part = data.get('voice_part')

            query = text('''
                UPDATE VoiceParts
                SET voice_part = :voice_part
                WHERE voice_part_id = :voice_part_id
            ''')

            result = db.session.execute(query, {"voice_part_id" : voice_part_id, "voice_part":voice_part})
            db.session.commit()

            #convert result to dictionary
            updated_part_info = {
                "voice_part_id" : voice_part_id,
                "voice_part" : voice_part
            }
            
            #return the data as JSON
            return jsonify(updated_part_info)
        except Exception as e:
            print(f"Error in updateExistingVoicePart endpoint: {str(e)}")
            app.logger.error(f"Error in updateExistingVoicePart endpoint: {str(e)}")
            return {"error": "An error occurred in updateExistingVoicePart"}, 500

    '''
    Delete Voice Part
        - Remove a voice part row, given its id
    '''
    def delete(self, voice_part_id):
        try:
            #voice_part_id = request.get_json().get('voice_part_id')

            query = text('''
                DELETE FROM VoiceParts
                WHERE voice_part_id = :voice_part_id
            ''')

            result = db.session.execute(query, {"voice_part_id" : voice_part_id})
            db.session.commit()

            updated_role_info = {
                "voice_part_id" : voice_part_id,
            }
            
            #return the data as JSON
            return jsonify(updated_role_info)

        except Exception as e:
            print(f"Error in deleteVoicePart endpoint: {str(e)}")
            app.logger.error(f"Error in deleteVoicePart endpoint: {str(e)}")
            return {"error": "An error occurred in deleteVoicePart"}, 500

'''
Retrieve Potentially Inactive Members

    - Method to retrieve potentially inactive members of the choir, those who 
    have not attended any of the last 5 practices

'''
@ns.route("/InactiveMembers")
class InactiveMembers(Resource):
    def get(self):
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
                return jsonify([]), 200

            #get the five most recent practices
            recent_practice_dates_query = text("""
                SELECT DISTINCT practice_date
                FROM PracticeAttendance
                ORDER BY practice_date DESC
                LIMIT 5
            """)
            recent_practice_dates = db.session.execute(recent_practice_dates_query).fetchall()
            recent_practice_dates = [row[0] for row in recent_practice_dates]  #extract dates

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
            print(f"Error in retrievePotentiallyInactiveMembers endpoint: {str(e)}")
            app.logger.error(f"Error in retrievePotentiallyInactiveMembers endpoint: {str(e)}")
            return {"error": "An error occurred in retrievePotentiallyInactiveMembers"}, 500

'''
Update a member to make them inactive
    - takes an input member_id
'''
@ns.route("/SetInactive/<int:member_id>")
class SetInactive(Resource):
    def patch(self, member_id):
        try:
            #print(member_id)
            member = db.session.query(Member).filter_by(member_id=member_id).first()

            if not member:
                return {"message": "Member not found"}, 404
            
            member.is_active = False
            db.session.commit()

            return jsonify({'member_id' : member_id})
        except Exception as e:
            print(f"Error in setInactiveMember endpoint: {str(e)}")
            app.logger.error(f"Error in setInactiveMember endpoint: {str(e)}")
            return {"error": "An error occurred in setInactiveMember"}, 500

'''
Get Current Budget
    - Return the most recently set budget
'''
@ns.route("/Budget")
class GetBudget(Resource):
    def get(self):
        try:
            recent_budget = Budget.query.order_by(Budget.budget_date_set.desc()).first()

            if recent_budget:
                return jsonify({
                    'budget_amount': str(recent_budget.budget_amount),
                    'budget_date_set': recent_budget.budget_date_set.strftime('%Y-%m-%d')
                })
            else:
                return {"error": "No budget found"}, 404

        except Exception as e:
            print(f"Error in getCurrentBudget endpoint: {str(e)}")
            app.logger.error(f"Error in getCurrentBudget endpoint: {str(e)}")
            return {"error": "An error occurred in getCurrentBudget"}, 500

'''
Get Payments
    - Return a SUM of the payments between two input dates.

Dates will be accessible via:
date_1 = request.json.get('date_1') YYYY-MM-DD Format
date_2 = request.json.get('date_2')
'''
@ns.route("/Payments/<string:date_1>/<string:date_2>")
class Payments(Resource):
    def get(self,date_1,date_2):
        try:
            try:
                date_1_str = datetime.strptime(date_1, "%Y-%m-%d").date()
                date_2_str = datetime.strptime(date_2, "%Y-%m-%d").date()
            except ValueError:
                return {"error": "Invalid date format. Use MM-DD-YYYY."}, 400

            print(date_1_str)
            print(date_2_str)

            payments = db.session.execute(text('''
                SELECT SUM(payment_amount) as total 
                FROM Payment 
                WHERE payment_date BETWEEN :date1 AND :date2
            '''), {'date1': date_1_str, 'date2': date_2_str}).fetchone()

            total = payments.total if payments else 0

            if (total == None):
                total = 0

            return jsonify({"total_payments": total})
        except Exception as e:
            print(f"Error in getPayments endpoint: {str(e)}")
            app.logger.error(f"Error in getPayments endpoint: {str(e)}")
            return {"error": "An error occurred in getPayments"}, 500

'''
Add Member
    - Method to add a member to the Member table.
'''
@ns.route("/AddMember")
class AddMember(Resource):
    @ns.expect(add_member_input_model)
    def post(self):
        try:
            data = request.get_json() # Extract data from the incoming JSON request

            print(data)

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

            return {"message": "Member added successfully"}, 201
        #for non-unique email
        except IntegrityError:
            print("Email Error")
            return {'message': 'A member with this email already exists'}, 400
        except ValueError as e:
            print("Empty Field Error")
            return {'message': str(e)}, 400
        except Exception as e:
            print(f"Error in addMember endpoint: {str(e)}")
            app.logger.error(f"Error in addMember endpoint: {str(e)}")
            return {"error": "An error occurred in addMember"}, 500

'''
Add an attendance record for a Member, on the practice date

If a record already exists, then update the existing record
'''
@ns.route("/Attendance")
class AttendanceResource(Resource):
    @ns.expect(attendance_input_model)
    def post(self):
        try:
            data = request.get_json()

            practice_date = datetime.strptime(data.get('practice_date'), '%Y-%m-%d')

            existing_attendance = PracticeAttendance.query.filter_by(
                member_id=data.get('member_id'),
                practice_date=practice_date
            ).first()

            #print(practice_date)

            if existing_attendance:
                print("UPDATING OLD ROW")

                # Update the existing record
                existing_attendance.present = data.get('present')
                existing_attendance.absence_reason_id = data.get('absence_reason_id')
                existing_attendance.notes = data.get('notes', existing_attendance.notes)
            else:
                print("ADDING NEW ROW")
                new_attendance = PracticeAttendance(
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
            return {"message": "Attendance record added successfully"}, 201
        except Exception as e:
            print(f"Error in addAttendance endpoint: {str(e)}")
            app.logger.error(f"Error in Attendance endpoint: {str(e)}")
            return {"error": "An error occurred in Attendance"}, 500

'''
Get the Absence Reason enums from the DB
'''
@ns.route("/AbsenceReasons")
class Attendance(Resource):
    def get(self):
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

api.add_namespace(ns)

# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=8080)

