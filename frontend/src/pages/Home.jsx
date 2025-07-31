import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import Button from '../components/common/Button';
import heroImage from '../assets/neesh_magazines_heropage.jpeg';

const Home = () => {
  return (
    <div className={styles.home}>
      {/* Hero Section - "The OS for Indie Print" */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1>The OS for Indie Print</h1>
              <div className={styles.heroButtons}>
                <Button variant="outline">Get</Button>
                <Button variant="outline">Sell</Button>
                <Button variant="outline">Ship</Button>
              </div>
              <p>Explore More →</p>
            </div>
            <div className={styles.heroImage}>
              <img 
                src={heroImage} 
                alt="Stack of magazines"
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src);
                  e.target.style.border = '2px solid red';
                }}
                onLoad={() => console.log('Image loaded successfully')}
              />
              <p>Quality Over Quantity</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className={styles.valueProps}>
        <div className="container">
          <div className={styles.propGrid}>
            <div className={styles.prop}>
              <h3>Get stocked. Get paid. Stay independent.</h3>
              <p>Connect with retailers who value independent publishing and get fair compensation for your work.</p>
              <Link to="/signup">Join Us as Publisher →</Link>
            </div>
            <div className={styles.prop}>
              <h3>Curated print. Clear terms. No risk.</h3>
              <p>Access carefully curated independent publications with transparent pricing and no upfront costs.</p>
              <Link to="/marketplace">Browse Catalog →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section className={styles.pipeline}>
        <div className="container">
          <h2>A clean pipeline from studio to shop.</h2>
          <div className={styles.pipelineSteps}>
            <div className={styles.step}>
              <div className={styles.stepIcon}>📝</div>
              <h4>Apply</h4>
              <p>Publishers apply and submit their work for curation</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>✅</div>
              <h4>Curate</h4>
              <p>We review and select quality independent publications</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>🚚</div>
              <h4>Ship</h4>
              <p>Automated fulfillment and logistics through trusted partners</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>💰</div>
              <h4>Get Paid</h4>
              <p>Fast payments with transparent terms and fair pricing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className={styles.problems}>
        <div className="container">
          <h2>Because what exists doesn't work.</h2>
          <div className={styles.problemGrid}>
            <div className={styles.problem}>
              <h4>Distributors</h4>
              <p>High fees, complex terms, slow payments</p>
            </div>
            <div className={styles.problem}>
              <h4>Direct Sales</h4>
              <p>Limited reach, high shipping costs, time consuming</p>
            </div>
            <div className={styles.problem}>
              <h4>Consignment</h4>
              <p>Unpredictable income, inventory risk, poor tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <h2>We built the tool we needed. Now it's yours.</h2>
          <div className={styles.ctaButtons}>
            <Button size="large">Join as Publisher</Button>
            <Button variant="outline" size="large">Request Retailer Access</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
