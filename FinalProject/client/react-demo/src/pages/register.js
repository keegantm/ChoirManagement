/*
File for the page holding the register component
*/
const { default: RegisterNewUserComponent } = require("@/components/RegisterNewUserComponent");
import Link from 'next/link';
import NavBar from '@/components/NavBar';

function register() {

    return (
        <div>
            <NavBar></NavBar>
            <div className="grid justify-center">
                <RegisterNewUserComponent></RegisterNewUserComponent>
            </div>
        </div>
    )
} 

export default register;