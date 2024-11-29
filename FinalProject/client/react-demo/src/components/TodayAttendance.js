import React, { useEffect, useState } from 'react';

/*
Component for taking today's attendance
*/
const TodayAttendance = (props) => {
    //members are active choir members
    //reasons are absence reasons
    //fetchPInactiveMembers is call to parent to check for potentially inactive members after attendance is taken
    const { members, reasons, fetchPInactiveMembers} = props;

    const [message, setMessage] = useState(null);

    //need to store additional info about each member
    //if they are present, absence reason, and any additional notes about the absence
    const [attendance, setAttendance] = useState(
        members.map((member) => ({
            member_id: member.member_id,
            present: true,
            notes: '',
            absence_reason_id: undefined
        }))
    );

    //update the checkbox selection for this member
    const handleCheckboxChange = (index) => {
        setAttendance((prev) =>
            prev.map((row, i) =>
                i === index ? { ...row, 
                            present: !row.present ,
                            //if present, reset absence info to the defaults 
                            absence_reason_id: !prev[index].present ? undefined : row.absence_reason_id,
                            notes: !prev[index].present ? '' : row.notes
                            } : row
            )
        );
    };

    //update the absense reason for this member
    const handleReasonChange = (index, newReasonID) => {
        setAttendance((prev) =>
            prev.map((row, i) =>
                i === index ? { ...row, absence_reason_id: newReasonID } : row
            )
        );
    };

    //update the text/notes
    const handleNotesChange = (index, newNotes) => {
        setAttendance((prev) =>
            prev.map((row, i) =>
                i === index ? { ...row, notes: newNotes } : row
            )
        );
    };

    const handleSubmit = async () => {
        try{
            console.log(attendance)

            let current_date = new Date()
            let formattedDate = current_date.toISOString().split('T')[0]

            //if present=false and undefined attendance reason
            //then set the absence_reason_id = 6 (Unknown Reason)
            const processed_attendance = attendance.map((member) => 
                (!member.present && member.absence_reason_id === undefined) 
                    ? { ...member, absence_reason_id: 6,  practice_date:formattedDate} 
                    : {...member, practice_date:formattedDate}
            );
            
            //post each individual member's attendance
            //to help handle multiple records being input for the same practice
            const responses = await Promise.all(
                processed_attendance.map((member) =>
                    fetch('http://localhost:8080/addAttendance', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(member),
                    })
                )
            );
            
            const allSuccess = responses.every((response) => response.ok);
            const results = await Promise.all(responses.map((res) => res.json()));
            console.log(results)
            
            if (allSuccess) {
                setMessage({ type: 'success', text: "Attendance Taken" });
                fetchPInactiveMembers();
            }
            else {
                setMessage({ type: 'error', text: "Error taking attendance" });
            }
        }
        catch (error){
            console.error("Error adding a attendance record:", error);
        }

    };

    //if we have no information, do not load
    if (!members || members.length === 0) {
        return (
            <div className="component">
                <h2>No active members found.</h2>
            </div>
        )
    }
    if (!reasons || reasons.length === 0) {
        return (
            <div className="component">
                <h2>No absence reasons found.</h2>
            </div>
        )
    }

    return (
        <div className="component">
            <h2 className="mb-2">Today's Attendance</h2>
            {message && (
                <div className={`alert ${message.type}`}>
                    {message.text}
                </div>
            )}
            <table className='content-table'>
                <thead>
                    <tr>
                        <th className='table-col-header'>Name</th>
                        <th className='table-col-header'>Present</th>
                        <th className='table-col-header'>Reason</th>
                        <th className='table-col-header'>Absence Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {/*list each member*/}
                    {members.map((member, index) => (
                        <tr key={member.member_id}>
                            {/*member name*/}
                            <td className="table-cell">{member.first_name} {member.last_name}</td>
                            {/*checkbox indicating if they are present*/}
                            <td className="table-cell">
                                <input
                                    type="checkbox"
                                    checked={attendance[index].present} 
                                    onChange={() => handleCheckboxChange(index)}
                                />
                            </td>
                            <td className="table-cell">
                                {/*if absent, allow them to select an absence reason*/}
                                <select
                                    value={attendance[index].absence_reason_id  || -1}
                                    onChange={(e) =>
                                        handleReasonChange(index, e.target.value)
                                    }
                                    disabled={attendance[index].present}
                                >
                                    {/*use absence reasons in DB to give the user options*/}
                                    
                                    <option value={-1} disabled>
                                        Select a reason
                                    </option>
                                    {reasons.map((reason) => (
                                        <option
                                            key={reason.absence_reason_id}
                                            value={reason.absence_reason_id}
                                        >
                                            {reason.reason_category}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="table-cell">
                                {/*allow the user to add an aditional comment about the absence*/}
                                <input
                                    type="text"
                                    value={attendance[index].notes}
                                    maxLength="40"
                                    onChange={(e) =>
                                        handleNotesChange(index, e.target.value)
                                    }
                                    disabled={attendance[index].present}
                                    className={`${attendance[index].present ? "bg-slate-100": "bg-white"} border border-slate-400 w-full`}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="component-button mt-4" onClick={handleSubmit}>Submit Attendance</button>
        </div>
    );
};

export default TodayAttendance;
