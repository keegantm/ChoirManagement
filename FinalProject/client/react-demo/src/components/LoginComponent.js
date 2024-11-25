import { useState } from 'react';
import { useRouter } from "next/router"

const LoginComponent = () => {
    const router = useRouter()

    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });

    const [message, setMessage] = useState(null); // For success/error messages

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 400 || response.status === 401 || response.status === 404) {
                    
                    setMessage({ type: 'error', text: result.error });
                    return;
                }
                else {
                    throw new Error(result.message || 'Failed to log in');
                }
            }

            const newToken = result.token;
            if (!newToken) {
                throw new Error('Token is invalid');
            }

            //put token in client local storage
            sessionStorage.setItem("token", newToken);

            setMessage({ type: 'success', text: 'Login successful!' });

            // Clear the form after submission
            setCredentials({
                username: '',
                password: '',
            });

            console.log('User logged in:', result);
            
            //redirect user to the home page
            router.push('/');
        } catch (error) {
            console.error('Error logging in:', error);
            setMessage({ type: 'error', text: error.message || 'An error occurred.' });
        }
    };

    return (
        <div>
            <h3>Log In</h3>
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
                    value={credentials.username}
                    onChange={handleInputChange}
                />

                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                />

                <button onClick={handleSubmit}>Log In</button>
            </div>
        </div>
    );
};

export default LoginComponent;
