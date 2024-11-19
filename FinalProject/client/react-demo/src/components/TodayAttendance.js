import React, { useEffect, useState } from 'react';

const TodayAttendance = (props) => {
    const { members, reasons } = props;

    if (!members || members.length === 0) {
        return <div>No Members Loaded...</div>;
    }

    if (!reasons || reasons.length === 0) {
        return <div>No Absence Reasons Loaded...</div>
    }

    return (
        <div>
            <ul>
            {members.map((member, index) => (
                <li key={index}>{member.first_name}</li>
            ))}

            </ul>
            <h4>Absence Reasons</h4>
            <ul>
                {reasons.map((reason, index) => (
                    <li key={index}>{reason.description}</li>
                ))}
            </ul>

        </div>
    )
};

export default TodayAttendance;
