import Link from 'next/link';
import {useEffect, useState} from 'react'

/*
Logic for the NavBar at the top of the page
*/
const NavBar = () => {

    //change what is displayed, depending on if the user is logged in
    const [loggedIn, setLoggedIn] = useState(false)

    //when the user logs out, clear their token
    function handleLogout() {
        sessionStorage.clear();
        //make the component reload
        setLoggedIn(false);
    }

    //only get the token once the page has loaded, otherwise the browser
    //does not exist
    useEffect(() => {
        const token = sessionStorage.getItem("token"); //get token from session storage

        //check if the user is logged in
        if (token && token !== "" && token !== undefined) {
            setLoggedIn(true);
        }
    }, []);

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