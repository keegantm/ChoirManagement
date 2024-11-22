//imports
import Link from 'next/link';

import LoginComponent from "@/components/LoginComponent";
import NavBar from '@/components/NavBar';


function login() {

    return (
        <div>
            <NavBar></NavBar>
            <LoginComponent></LoginComponent>
            <Link href="/register">Register</Link>
        </div>
    )
}

export default login;