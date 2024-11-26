/*
Page to view the financial information about the choir
*/
import {useEffect, useState} from 'react'
import NavBar from '../components/NavBar.js'
import ViewBudget from '@/components/ViewBudget';
import ViewPaymentInfo from '@/components/ViewPaymentInfo.js';

function viewFinancialInfo() {
    
    //the logged in user's permissions
    const [permissions, setPermissions] = useState({
        canViewFinancialData: false
    });

    /*
    useEffect(() => {
        // Fetch the user's permissions from the backend
        fetch('http://localhost:8080/getUserPermissions')
            .then(response => response.json())
            .then(data => { console.log(data)
                            setPermissions(data)});
    }, []);
    */

    

    return (
        <div>
            <NavBar />

            {permissions.canViewFinancialData && (
                <ViewBudget></ViewBudget>
            )}

            {permissions.canViewFinancialData && (
                <ViewPaymentInfo></ViewPaymentInfo>
            )}
        </div>

    );

}

export default viewFinancialInfo
    