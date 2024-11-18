import ManagePotentiallyInactiveMembers from "@/components/ManagePotentiallyInactiveMembers";
import NavBar from "@/components/NavBar";
import { useEffect, useState } from "react";

function attendance() {
    const [permissions, setPermissions] = useState({
        canEditMusicalRoles: false,
        canEditBoardRoles: false,
        canAddMembers: false,
        canChangeActiveStatus: false
    });

    useEffect(() => {
        // Fetch the user's permissions from the backend
        fetch('http://localhost:8080/getUserPermissions')
            .then(response => response.json())
            .then(data => { console.log(data)
                            setPermissions(data)});
    }, []);

    return (
        <div>
            <NavBar/>
            
            <h2>Attendance</h2>

            {permissions.canChangeActiveStatus && (
                <ManagePotentiallyInactiveMembers></ManagePotentiallyInactiveMembers>
            )}

        </div>
    )
}

export default attendance