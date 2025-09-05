import { useState } from 'react';
import { Link } from 'react-router-dom';
import IntroPage from '../components/IntroPage';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import styles from './Home.module.css';

const Home = () => {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const scrollToPipeline = () => {
    const pipelineSection = document.getElementById('pipeline');
    if (pipelineSection) {
      pipelineSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (showIntro) {
    return <IntroPage onComplete={handleIntroComplete} />;
  }

  return (
    <div className={styles.landingPage}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <h1>The OS for Indie Print</h1>
              <p>A marketplace for indie print. Curated titles, risk-free orders, faster payouts.</p>
              <button className={styles.exploreBtn} onClick={scrollToPipeline}>Explore</button>
            </div>
            <div className={styles.heroVisual}>
              <img src="/haleybuschphoto_herosection.jpg" alt="hero image" className={styles.heroImage} />
            </div>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className={styles.valueProps}>
        <div className={styles.middleStitching}></div>
        <div className={styles.container}>
          <div className={styles.propGrid}>
            <div className={styles.propCard}>
              <div className={styles.propIcon}><img src="/Mag-Upload-Icon-3.svg" alt="Publisher icon" style={{ width: '75px', height: '75px' }} /></div>
              <h3>For Publishers</h3>
              <h2>Get stocked. Get paid. Stay independent.</h2>
              <p>The hardest shelves to reach are often the most valuable. Neesh opens access to retailers that traditional distributors overlook and makes every transaction clean and direct. </p>
              <p className={styles.subText}>Upload your catalog once, and we put your work in front of the shops that matter. Orders, returns, and payouts flow through us, so you get paid fast and can keep creating.</p>
              <Link to="/publisher-application" className={styles.propLink}>
                Apply to List Your Magazine
              </Link>
            </div>
            <div className={styles.propCard}>
              <div className={styles.propIcon}><img src="/Retailer-Icon.svg" alt="Retailer icon" style={{ width: '75px', height: '75px' }} /></div>
              <h3>For Retailers</h3>
              <h2>Curated print. Clear terms. No risk.</h2>
              <p>Magazines give a shop character. They spark conversations, set the vibe, and make customers linger. But clunky portals and risky bets have made them  a nightmare to stock. Neesh fixes that. 
</p>
              <p className={styles.subText}>Browse curated titles, see clear margins upfront, and place small trial orders. Give your shoppers the culture they love while keeping business healthy.</p>
              <Link to="/auth" className={styles.propLink}>
                Request Access for Your Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section id="pipeline" className={styles.pipeline}>
        <div className={styles.container}>
          <h2>A clean pipeline from studio to shop.</h2>
          <div className={styles.pipelineSteps}>
            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <img src="/Mag-Upload-Icon-02.svg" alt="Magazine upload icon" style={{ width: '75px', height: '75px' }} />
              </div>
              <h4>Step 1</h4>
              <p>Publishers upload titles, inventory, and pricing.</p>
              <span className={styles.stepSubtext}>Shops see trusted titles with real pricing and margins upfront</span>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <img src="/Search-Icon-02.svg" alt="Search icon" style={{ width: '75px', height: '75px' }} />
              </div>
              <h4>Step 2</h4>
              <p>Retailers explore collections and place small trial orders.</p>
              <span className={styles.stepSubtext}>Get clear margins upfront and test new titles without financial risk.</span>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <img src="/Fulfillment-Icon.svg" alt="Fulfillment icon" style={{ width: '75px', height: '75px' }} />
              </div>
              <h4>Step 3</h4>
              <p>Fulfillment and returns are managed through Neesh.</p>
              <span className={styles.stepSubtext}>Prepaid labels and fast processing keeps logistics painless for shops and publishers.</span>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <img src="/Insights-Icon-01.svg" alt="Insights icon" style={{ width: '75px', height: '75px' }} />
              </div>
              <h4>Step 4</h4>
              <p>Everyone gets insights—what moved, where, and when.</p>
              <span className={styles.stepSubtext}>Shops curate smarter, publishers plan better, and the industry grows faster.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className={styles.problems}>
        <div className={styles.container}>
          <div className={styles.problemsGrid}>
            <div className={styles.problemsContent}>
              <h2>Print is alive. Neesh makes it work.</h2>
              <p>Magazines are thriving again, carrying culture into shops and building loyal audiences. Neesh gives retailers and publishers the system to keep that momentum.</p>

              <div className={styles.principles}>
                <h4>Built for Indie Print:</h4>
                <ul>
                  <li>Filters, categories and tastefully curated titles</li>
                  <li>Faster payouts for independent publishers</li>
                  <li>Clear margins and risk free trial orders</li>
                  <li>Access to retailers that shape culture</li>
                </ul>
              </div>
            </div>
            <div className={styles.problemsRight}>
              <video
                className={styles.brandVideo}
                controls
                muted
                playsInline
                onEnded={() => {
                  const video = document.querySelector(`.${styles.brandVideo}`) as HTMLVideoElement;
                  if (video) {
                    setTimeout(() => {
                      video.play();
                    }, 4000);
                  }
                }}
                onClick={(e) => {
                  const video = e.target as HTMLVideoElement;
                  if (video.paused) {
                    video.play();
                  }
                }}
                onMouseEnter={(e) => {
                  const video = e.target as HTMLVideoElement;
                  if (video.paused && video.currentTime === 0) {
                    video.play();
                  }
                }}
              >
                <source src="/Neesh_Brand_Video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* <p className={styles.problemsSubtext}>Make independent print sustainable,visible,scalable.</p> */}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <img src="/haleybuschphoto_flowersCTAsection.jpg" alt="flowers in CTA section" className={styles.flowersCTAsection} />
        <h2 className={styles.ctaTitle}>Find your Neesh.<br />Keep indie print moving forward.</h2>
        <img src="/haleybuschphoto_couch_upsidedown.jpg" alt="Upside down on magazine" className={styles.couchUpsideDown} />
        <Link to="/publisher-application" className={styles.publisherBtn}>
          Apply as a Publisher
        </Link>
        <Link to="/auth" className={styles.retailerBtn}>
          Request Retailer Access
        </Link>
        <p className={styles.questionsText}>Have questions?</p>
        <a href="mailto:hi@neesh.art" className={styles.teamLink}>Talk to the Team</a>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
