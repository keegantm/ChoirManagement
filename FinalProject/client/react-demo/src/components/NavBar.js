import Link from 'next/link';

const NavBar = () => {

    return (
        <nav>
            <Link href="/">Home</Link>
            <br></br>
            <Link href="/members">View Members</Link>
            <br></br>
            <Link href="/testPost">Test Post</Link>
            <br></br>
        </nav>
    )
}

export default NavBar