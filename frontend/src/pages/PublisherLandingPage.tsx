import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import styles from './PublisherLandingPage.module.css';

const PublisherLandingPage: React.FC = () => {
  return (
    <div className={styles.landingPage}>
      <Navbar />
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              For Publishers
            </h1>
            <p className={styles.heroSubtitle}>
              Traditional reach without traditional margins.
            </p>
            <p className={styles.heroDescription}>
              Distributors get you into stores but take hefty cuts and decide where you go. Self-distribution means better margins but endless logistics and limited reach. Neesh gives you both: widespread discovery through our curated marketplace and full control over pricing, placement, and payouts.
            </p>
            <Link to="/publisher-application-form" className={styles.ctaButton}>
              Apply to List Your Magazine
            </Link>
          </div>
          <div className={styles.heroVisual}>
            <img style={{width:'600px', height:'400px' }} src="/For_Publishers_image.png" alt="Magazine upload icon" />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Publishers Choose Neesh</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <img src="/Search-Icon-02.svg" alt="Discovery icon" />
              </div>
              <h3>Reach New Retailers</h3>
              <p>Get discovered by local bookstores, cafes, boutiques, and specialty shops that traditional distributors overlook. We focus on cultural retailers who really care about your work.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <img src="/Fulfillment-Icon.svg" alt="Fulfillment icon" />
              </div>
              <h3>Streamlined Operations</h3>
              <p>Upload your catalog once, and we handle orders, returns, and payouts. No more chasing invoices or managing fulfillment across dozens of retailers. You focus on making great work.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <img src="/Insights-Icon-01.svg" alt="Insights icon" />
              </div>
              <h3>Clear Analytics</h3>
              <p>See exactly what's selling, where, and when. Real-time dashboards show sell-through rates and retailer performance so you can make informed decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h4>Apply</h4>
              <p>Submit your application with details about your magazine, print run, distribution goals, and publishing schedule. </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h4>Get Approved</h4>
              <p>Our team reviews your application based on editorial quality, design standards, and production capability. </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h4>Upload Catalog</h4>
              <p>Add your magazine details, pricing, and inventory to our platform. Set your wholesale terms and choose which types of retailers can discover your work.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h4>Start Selling</h4>
              <p>Retailers discover and order your magazines. We coordinate fulfillment, manage returns, handle customer service, and offer predictable, timely payouts. </p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className={styles.requirements}>
        <div className={styles.container}>
          <div className={styles.requirementsContent}>
            <h2 className={styles.sectionTitle}>What We're Looking For</h2>
            <div className={styles.requirementsList}>
              <div className={styles.requirement}>
                <h4>Print Runs</h4>
                <p>We work best with publishers printing between 500-10,000 copies per issue. This ensures you have inventory to support retailer demand without overextending.</p>
              </div>
              <div className={styles.requirement}>
                <h4>Quality Focus</h4>
                <p>We review every application for editorial quality, design standards, and production values. Neesh is a curated marketplace—not a free-for-all.</p>
              </div>
              <div className={styles.requirement}>
                <h4>Operational Readiness</h4>
                <p>You should have established printing and fulfillment capabilities, plus a regular publishing schedule. We're looking for publishers ready to grow, not just starting out.</p>
              </div>
              <div className={styles.requirement}>
                <h4>Independent Spirit</h4>
                <p>We prioritize independent publishers bringing unique voices and perspectives to the marketplace. If you're making something no one else is, we want to help you get it into the right hands.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Stop chasing invoices. Start reaching more stores.</h2>
            <p>Join independent publishers using Neesh to get stocked in cultural retailers across the country.</p>
            <Link to="/publisher-application-form" className={styles.ctaButton}>
              Apply to List Your Magazine
            </Link>

          </div>        
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PublisherLandingPage;
