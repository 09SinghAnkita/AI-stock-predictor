"use client"
import { useState } from "react";
import styles from "../styles/Navbar.module.css"

export default function Navbar(): JSX.Element {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (

        <nav className={styles.navbar}>

            {/* Hamburger Icon */}
            <button
            className={styles.hamburger}
            onClick={toggleMenu}
            aria-label="Toggle Navigation"
            >
            &#9776;
            </button>

            <ul className={`${styles.navList} ${isMenuOpen ? styles.navOpen : ""}`}>
                <li className={styles.navItem}>
                    <a className={styles.navLink} href="/dashboard">
                        Dashboard
                    </a>
                </li>
                <li className={styles.navItem}>
                    <a className={styles.navLink} href="/Forecasting">
                        Forecasting
                    </a>
                </li>
                <li className={styles.navItem}>
                    <a className={styles.navLink} href="/Portfolio">
                        Portfolio
                    </a>
                </li>
            </ul>

            <ul className={styles.rightNav}>
                <li className={styles.navItem}>
                    <a  href="/login" className={styles.navLink}>
                        Login
                    </a>
                </li>
                <li className={styles.navItem}>
                    <a href="/signup" className={styles.navLink}>
                        Signup
                    </a>
                </li>
            </ul>
        </nav>
    );
}