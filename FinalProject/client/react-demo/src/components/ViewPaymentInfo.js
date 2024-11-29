import { useEffect, useState } from 'react';

/*
Component for showing the sum of payments towards the budget, and what the current balance is
*/
const ViewPaymentInfo = () => {
    const [sum, setSum] = useState(0)
    const [budget, setBudget] = useState({ budget_amount: 0.00, budget_date_set: '' })
    const [difference, setDifference] = useState(null);
    
    //on load, get the budget and sum of payments
    useEffect(() => {
        const fetchData = async () => {
            try {
                const budgetResponse = await fetch('http://localhost:8080/getCurrentBudget');

                if (!budgetResponse.ok) {
                    throw new Error('Failed to fetch current budget');
                }

                const budgetData = await budgetResponse.json();
                setBudget(budgetData)
                console.log(budgetData)

                const budget_date = budgetData.budget_date_set
                const curr_date = new Date().toISOString().split('T')[0]


                const getPaymentSummary = await fetch('http://localhost:8080/getPayments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {'date_1' : budget_date,
                         'date_2' : curr_date
                        }
                    )
                });
                if (!getPaymentSummary.ok) {
                    throw new Error('Failed to fetch payment info');
                }

                const paymentData = await getPaymentSummary.json();
                console.log(paymentData)
                setSum(Number(paymentData.total_payments) || 0);
            } catch (error) {
                console.error("Error fetching payment info", error)
            }
        }
        fetchData();
    }, [])

    //when we have the sum, calculate the budget difference
    useEffect(() => {

        if (sum !== 0 || budget.budget_amount !== 0) {
            const diff = Number(sum) - Number(budget.budget_amount);
            setDifference(diff);
        }
    }, [sum])

    return(
        <div>
            <div className="component">
                <p>Total payments for this budget: ${sum.toFixed(2)}</p>
            </div>
            {difference !== null && (

                <div className="component">
                    <p>
                        The balance for this budget is: {difference > 0 ? `+${difference.toFixed(2)}` : `${difference.toFixed(2)}`}
                    </p>
                </div>
            )}
        </div>

    )
}

export default ViewPaymentInfo;