/*
File for the page holding the login component
*/
import LoginComponent from "@/components/LoginComponent";
import NavBar from '@/components/NavBar';

 
function login() {

    return (
        <div>
            <NavBar></NavBar>
            <div className="grid justify-center">
                <LoginComponent></LoginComponent>

            </div>
        </div>
    )
}

export default login;