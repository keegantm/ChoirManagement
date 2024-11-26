import { useEffect, useState } from 'react';

/*
Component for viewing the budget
*/
const ViewBudget = () => {
    const [displayedBudget, setDisplayedBudget] = useState({ budget_amount: 0.00, budget_date_set: '' })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const budgetResponse = await fetch('http://localhost:8080/getCurrentBudget');

                if (!budgetResponse.ok) {
                    throw new Error('Failed to fetch current budget');
                }

                const budgetData = await budgetResponse.json();
                setDisplayedBudget(budgetData)
            } catch (error) {
                console.error("Error fetching budget", error)
            }
        }
        fetchData();
    }, [])

    return(
        <h3>The most recent budget is {displayedBudget.budget_amount}, set on {displayedBudget.budget_date_set}</h3>
    )
}

export default ViewBudget;
