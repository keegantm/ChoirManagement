/*
Component for a user to login
*/
import { useState } from 'react';
import { useRouter } from "next/router"
import Link from 'next/link';

const LoginComponent = () => {
    const router = useRouter()

    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });

    const [message, setMessage] = useState(null); // For success/error message

    //update credentials when the user types
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
            
            //get user's JWT
            const newToken = result.token;
            if (!newToken) {
                throw new Error('Token is invalid');
            }

            //put token in client local storage
            sessionStorage.setItem("token", newToken);

            setMessage({ type: 'success', text: 'Login successful!' });

            //clear form
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
        <div className="shadow-lg rounded bg-slate-100 border slate-700 grid justify-center gap-4 mx-16 my-8 min px-8 py-8 max-w-4xl ">
            <h2>Log In</h2>
            {message && (
                <div className={`alert ${message.type}`}>
                    {message.text}
                </div>
            )}
            <div className="flex flex-grow flex-col justify-start w-full">
                <label>Email:</label>
                <input
                    type="email"
                    name="username"
                    value={credentials.username}
                    onChange={handleInputChange}
                    className="border slate-700"
                />

                <label className="mt-2">Password:</label>
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="border slate-700"
                />

                <button onClick={handleSubmit} className="border slate-700 bg-gradient-to-r from-cyan-100 to-blue-100 mt-4 w-full" >Log In</button>
            </div>

            <Link href="/register" className="border slate-700 block bg-gradient-to-r from-cyan-100 to-blue-100 text-center">Register</Link>

        </div>
    );
};

export default LoginComponent;
