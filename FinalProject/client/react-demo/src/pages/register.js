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