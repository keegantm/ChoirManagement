import {useEffect, useState} from 'react'
import NavBar from '../components/NavBar.js'
import ViewBudget from '@/components/ViewBudget';
import ViewPaymentInfo from '@/components/ViewPaymentInfo.js';

function viewFinancialInfo() {

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
            <NavBar />

            <ViewBudget></ViewBudget>
            <ViewPaymentInfo></ViewPaymentInfo>
        </div>

    );

}

export default viewFinancialInfo
    