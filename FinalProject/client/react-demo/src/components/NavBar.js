import Link from 'next/link';

const NavBar = () => {

    return (
        <nav>
            <Link href="/">Home</Link>
            <br></br>
            <Link href="/manageMembers">Member Management</Link>
            <br></br>
            <Link href="/attendance">Attendance</Link>
            <br></br>
            <Link href="/viewFinancialInfo">View Financial Information</Link>
            <br></br>

        </nav>
    )
}

export default NavBar