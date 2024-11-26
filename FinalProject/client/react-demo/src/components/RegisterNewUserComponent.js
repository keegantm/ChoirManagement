import {useState} from 'react'
import { useRouter } from 'next/router'

/*
Component for registering a new User of the site
*/
const RegisterNewUserComponent = () => {
    const router = useRouter()

    const [newUser, setNewUser] = useState({
        username: '',
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
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 400) {
                    
                    setMessage({ type: 'error', text: result.error });
                    return;
                }
                else {
                    throw new Error('Failed to add new member');
                }
            }

            console.log('User registered:', result);

            setMessage({ type: 'success', text: 'User registered successfully!' });
            
            // Clear the form after submission
            setNewUser({
                username: '',
                password: ''
            });

            router.push('/login');
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
                    name="username"
                    value={newUser.username}
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
