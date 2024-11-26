/*
File for the page holding the register component
*/
const { default: RegisterNewUserComponent } = require("@/components/RegisterNewUserComponent");
import Link from 'next/link';

function register() {

    return (
        <div>
            <RegisterNewUserComponent></RegisterNewUserComponent>
            <Link href="/login">Login</Link>
        </div>
    )
} 

export default register;