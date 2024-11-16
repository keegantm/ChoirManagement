import {useState} from 'react'


const RegisterNewUserComponent = () => {
    const [newUser, setNewUser] = useState({
        email: '',
        password: ''
    });

    const [message, setMessage] = useState(null);


    const handleInputChange = (e) => {
        //name is name of the input field
        //value is what the user typed
        const { name, value } = e.target;
        setNewUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:8080/registerNewUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
            //TODO: Check if username (email) is in member. 
            //If not in member, or that username already has a password then send an error/fail msg

            if (!response.ok) {
                throw new Error('Failed to add new member');
            }

            const result = await response.json();
            console.log('User registered:', result);

            setMessage({ type: 'success', text: 'User registered successfully!' });
            
            // Clear the form after submission
            setNewUser({
                email: '',
                password: ''
            });
        } catch (error) {
            console.error('Error registering:', error);
            setMessage({ type: 'error', text: error.message || 'An error occurred.' });
        }
    };

    return (
        <div>
            <h3>Create your account</h3>
            {message && (
                <div className={`alert ${message.type}`}>
                    {message.text}
                </div>
            )}
            <div>
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                />

                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                />

                <button onClick={handleSubmit}>Register</button>
            </div>
        </div>
    );
};

export default RegisterNewUserComponent;
