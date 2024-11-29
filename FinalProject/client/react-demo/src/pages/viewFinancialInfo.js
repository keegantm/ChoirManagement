/*
Page to view the financial information about the choir
*/
import {useEffect, useState} from 'react'
import NavBar from '../components/NavBar.js'
import ViewBudget from '@/components/ViewBudget';
import ViewPaymentInfo from '@/components/ViewPaymentInfo.js';
import { fetchPermissions } from '@/utils/fetchPermissions.js';
import { useRouter } from 'next/router'

function viewFinancialInfo() {
    const router = useRouter()
    
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

    const fetchAndSetPermissions = async () => {
        const token = sessionStorage.getItem("token");
        if (token && token !== "" && token !== undefined) {
            //get permissions
            const permissionsResponse = await fetchPermissions(token, router);
            if (permissionsResponse) {
                setPermissions(permissionsResponse)
            }
            else {
                setPermissions({
                    canViewFinancialData: false,
                })
            }
        }
        else {
            router.push("/login")
        }
    }

    useEffect(() => {
        fetchAndSetPermissions();
    }, [])

    return (
        <div>
            <NavBar />

            <div className="body">

                {permissions.canViewFinancialData ? (
                    <ViewBudget></ViewBudget>
                ) : (
                    <div className="component">
                        <h2>You do not have permission to view financial data.</h2>
                    </div>
                )}

                {permissions.canViewFinancialData && (
                    <ViewPaymentInfo></ViewPaymentInfo>
                )}
            </div>

        </div>

    );

}

export default viewFinancialInfo
    