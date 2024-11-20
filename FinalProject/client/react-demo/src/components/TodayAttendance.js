import React, { useEffect, useState } from 'react';

const TodayAttendance = (props) => {
    const { members, reasons } = props;

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
            
            const results = await Promise.all(responses.map((res) => res.json()));

            console.log(results)

        }
        catch (error){
            console.error("Error adding a attendance record:", error);
        }

    };

    if (!members || members.length === 0) {
        return <div>No Members Loaded...</div>;
    }

    if (!reasons || reasons.length === 0) {
        return <div>No Absence Reasons Loaded...</div>
    }

    return (
        <div>
            <h2>Attendance</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Present</th>
                        <th>Reason</th>
                        <th>Absence Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {/*list each member*/}
                    {members.map((member, index) => (
                        <tr key={member.member_id}>
                            {/*member name*/}
                            <td>{member.first_name} {member.last_name}</td>
                            {/*checkbox indicating if they are present*/}
                            <td>
                                <input
                                    type="checkbox"
                                    checked={attendance[index].present} 
                                    onChange={() => handleCheckboxChange(index)}
                                />
                            </td>
                            <td>
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
                            <td>
                                {/*allow the user to add an aditional comment about the absence*/}
                                <input
                                    type="text"
                                    value={attendance[index].notes}
                                    maxLength="40"
                                    onChange={(e) =>
                                        handleNotesChange(index, e.target.value)
                                    }
                                    disabled={attendance[index].present}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleSubmit}>Submit Attendance</button>
        </div>
    );
};

export default TodayAttendance;
