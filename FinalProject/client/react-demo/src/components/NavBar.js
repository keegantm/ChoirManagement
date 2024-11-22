import Link from 'next/link';
import {useEffect, useState} from 'react'

const NavBar = () => {

    const [loggedIn, setLoggedIn] = useState(false)

    function handleLogout() {
        sessionStorage.clear();
        //make the component reload
        setLoggedIn(false);
    }

    //only get the token once the page has loaded, otherwise the browser
    //does not exist
    useEffect(() => {
        const token = sessionStorage.getItem("token"); // Get token from session storage

        if (token && token !== "" && token !== undefined) {
            setLoggedIn(true);
        }
    }, []);

    //get if the user is logged in
    if (loggedIn){
        console.log("Logged in")

        return (
            <nav>
            <Link href="/">Home</Link>
            <br></br>
            <Link href="/manageMembers">Member Management</Link>
            <br></br>
            <Link href="/attendance">Attendance</Link>
            <br></br>
            <Link href="/viewFinancialInfo">View Financial Information</Link>
            <br></br>
            <button onClick={handleLogout}>Logout</button>
            <br></br>
            </nav>
        )
    }
    else {
        console.log("Not Logged in")

        return (
            <nav>
                <Link href="/">Home</Link>
                <br></br>
                <Link href="/manageMembers">Member Management</Link>
                <br></br>
                <Link href="/attendance">Attendance</Link>
                <br></br>
                <Link href="/viewFinancialInfo">View Financial Information</Link>
                <br></br>
                <Link href="/login">Login</Link>
                <br></br>
            </nav>

        )
    }


}

export default NavBar;