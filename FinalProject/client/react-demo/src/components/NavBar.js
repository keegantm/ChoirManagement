import Link from 'next/link';
import {useEffect, useState} from 'react'
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/router'

/*
Logic for the NavBar at the top of the page
*/
const NavBar = () => {
    const router = useRouter()

    //change what is displayed, depending on if the user is logged in
    const [loggedIn, setLoggedIn] = useState(false)

    //when the user logs out, clear their token
    async function handleLogout() {

        sessionStorage.clear();
        //make the component reload
        setLoggedIn(false);

        router.push('/')
    }

    //only get the token once the page has loaded, otherwise the browser
    //does not exist
    useEffect(() => {
        const token = sessionStorage.getItem("token"); //get token from session storage

        //check if the user is logged in
        if (token && token !== "" && token !== undefined) {
            const decoded = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (decoded.exp && decoded.exp > currentTime) {
                //token is valid
                setLoggedIn(true);
            }

        }
    }, []);

    if (loggedIn){
        console.log("Logged in")

        return (
            <div className="flex px-8 py-6 bg-slate-50">
                <h1 className="mr-16">Portland Community Choir</h1>

                <nav className="flex  gap-3  flex-wrap  ml-auto">
                    <Link href="/" className="block py-2 px-4 tracking-wide hover:bg-slate-200 rounded">Home</Link>
                    <Link href="/manageMembers" className="block py-2 px-4 tracking-wide hover:bg-slate-200 rounded">Member Management</Link>
                    <Link href="/attendance" className="block py-2 px-4 tracking-wide hover:bg-slate-200 rounded">Attendance</Link>
                    <Link href="/viewFinancialInfo" className="block py-2 px-4 tracking-wide hover:bg-slate-200 rounded">View Financial Information</Link>
                    <button onClick={handleLogout} className="block py-2 px-4 tracking-wide hover:bg-slate-200 rounded">Logout</button>
                </nav>
            </div>

        )
    }
    else {
        console.log("Not Logged in")

        return (
            <div className="flex px-8 py-6 bg-slate-50">
                <h1 className="mr-16">Portland Community Choir</h1>

                <nav className="flex  gap-3  flex-wrap  ml-auto">
                    <Link href="/" className="block py-2 px-4 tracking-wide hover:bg-slate-200 rounded">Home</Link>
                    <Link href="/manageMembers" className="block py-2 px-4 tracking-wide hover:bg-slate-200 rounded">Member Management</Link>
                    <Link href="/attendance" className="block py-2 px-4 tracking-wide hover:bg-slate-200 rounded">Attendance</Link>
                    <Link href="/viewFinancialInfo" className="block py-2 px-4 tracking-wide hover:bg-slate-200 rounded">View Financial Information</Link>
                    <Link href="/login" className="block py-2 px-4 tracking-wide hover:bg-slate-200 rounded">Login</Link>
                </nav>
            </div>


        )
    }


}

export default NavBar;