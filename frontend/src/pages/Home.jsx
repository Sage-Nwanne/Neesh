import { useState } from 'react';
import { Link } from 'react-router-dom';
import IntroPage from '../components/IntroPage';
import styles from './Home.module.css';

const Home = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return <IntroPage onComplete={handleIntroComplete} />;
  }

  return (
    <div className={styles.landingPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>NEESH</div>
          <button 
            className={styles.hamburger}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
          {mobileMenuOpen && (
            <div className={styles.mobileMenu}>
              <Link to="/auth" className={styles.mobileLink}>Sign In</Link>
              <Link to="/auth" className={styles.mobileLink}>Get Started</Link>
              <span className={styles.mobileLink}>FAQ</span>
              <Link to="/admin" className={styles.mobileLink}>Admin Panel</Link>
              <button 
                className={styles.closeMenu}
                onClick={() => setMobileMenuOpen(false)}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <h1>The OS for Indie Print</h1>
              <p>Built for publishers. Trusted by shops.<br />Designed to move magazines.</p>
              <button className={styles.exploreBtn}>Explore</button>
            </div>
            <div className={styles.heroVisual}>
              <div className={styles.gridLines}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className={styles.valueProps}>
        <div className={styles.container}>
          <div className={styles.propGrid}>
            <div className={styles.propCard}>
              <div className={styles.propIcon}>📦</div>
              <h3>For Publishers</h3>
              <h2>Get stocked. Get paid. Stay independent.</h2>
              <p>Upload your catalog, set pricing, and start fulfilling real orders.</p>
              <p className={styles.subText}>Neesh handles discovery, transactions, returns, and payouts—so you can focus on the next issue.</p>
              <Link to="/publisher-application" className={styles.propLink}>
                Apply to List Your Magazine
              </Link>
            </div>
            <div className={styles.propCard}>
              <div className={styles.propIcon}>🏪</div>
              <h3>For Retailers</h3>
              <h2>Curated print. Clear terms. No risk.</h2>
              <p>Browse new and essential titles. Order in small batches. Return what doesn't move.</p>
              <p className={styles.subText}>Neesh helps you stock smarter and connect directly with publishers.</p>
              <Link to="/auth" className={styles.propLink}>
                Request Access for Your Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section className={styles.pipeline}>
        <div className={styles.container}>
          <h2>A clean pipeline from studio to shop.</h2>
          <div className={styles.pipelineSteps}>
            <div className={styles.step}>
              <div className={styles.stepIcon}>📦</div>
              <h4>Step 1</h4>
              <p>Publishers upload titles, inventory, and pricing.</p>
              <span className={styles.stepSubtext}>Complete catalog management in one place.</span>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>📦</div>
              <h4>Step 2</h4>
              <p>Retailers browse and order via flexible wholesale terms.</p>
              <span className={styles.stepSubtext}>Discover and stock with confidence.</span>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>📦</div>
              <h4>Step 3</h4>
              <p>Fulfillment and returns are managed through Neesh.</p>
              <span className={styles.stepSubtext}>Seamless logistics and transparent terms.</span>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>📦</div>
              <h4>Step 4</h4>
              <p>Everyone gets insights—what moved, where, and when.</p>
              <span className={styles.stepSubtext}>Real data to guide decisions.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className={styles.problems}>
        <div className={styles.container}>
          <div className={styles.problemsGrid}>
            <div className={styles.problemsContent}>
              <h2>Because what exists doesn't work.</h2>
              <p>Most print distribution platforms are made for scale. Neesh is made for care.</p>
              
              <div className={styles.principles}>
                <h4>Key Principles:</h4>
                <ul>
                  <li>No open marketplace—every title is curated</li>
                  <li>No print-on-demand—only real inventory</li>
                  <li>No algorithm spam—human filters and taste</li>
                  <li>No corporate lock-in—this is infrastructure, not control</li>
                </ul>
              </div>
            </div>
            <div className={styles.problemsRight}>
              <div className={styles.videoPlaceholder}>
                <p>**Insert video content here**</p>
              </div>
              <p className={styles.problemsSubtext}>Just a system that works—for the kind of people actually making and selling independent magazines.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>We built the tool we needed. Now it's yours.</h2>
          <div className={styles.ctaGrid}>
            <div className={styles.ctaImage}>
              <img src="/api/placeholder/400/500" alt="Stack of magazines" />
            </div>
            <div className={styles.ctaContent}>
              <div className={styles.ctaButtons}>
                <Link to="/publisher-application" className={styles.primaryBtn}>
                  Apply as a Publisher
                </Link>
                <Link to="/auth" className={styles.secondaryBtn}>
                  Request Retailer Access
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.ctaFooter}>
            <p>Have questions?</p>
            <a href="#" className={styles.teamLink}>Talk to the Team</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
