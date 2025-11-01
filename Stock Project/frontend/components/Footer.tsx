
import styles from "../styles/Footer.module.css"

const currentYear = new Date().getFullYear();

const Footer = ()=>(

    <footer className={styles.footer}>
        
        {/* Action Items */}
        <div className={styles.links}>
            <a href ="/about" className={styles.link}>About</a>
            <a  href ="/contact" className={styles.link}>Contact</a>
            <a href ="/terms" className={styles.link}>Terms of Service</a>
            <a href ="/privacy" className={styles.link}>Privacy Policy</a>
        </div>

        {/* Social links */}
        <div className={styles.socials}>
            <a href="https://twitter.com" target="_blank" rel="noreferrer noopener" className={styles.social}>
                <img src="null" alt="twitter"/>
            </a>
            <a href="https://linkedIn.com" target="_blank" rel="noreferrer noopener" className={styles.social}>
                <img src="null" alt="linkedIn"/>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer noopener" className={styles.social}>
                <img src="null" alt="instagram"/>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer noopener" className={styles.social}>
                <img src="null" alt="facebook"/>
            </a>
        </div>

        <div className={styles.disclaimer}>
            <p>© {currentYear} SmartStocks. All rights reserved</p>
            <p>
                Disclaimer: Stock predictions are based on AI models and are for informational purposes only. Use at your own risk.
            </p>
        </div>
    </footer>
)

export default Footer