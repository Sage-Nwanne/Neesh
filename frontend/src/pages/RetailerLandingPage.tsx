import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import styles from './RetailerLandingPage.module.css';

const RetailerLandingPage: React.FC = () => {
  return (
    <div className={styles.landingPage}>
      <Navbar />
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              For Retailers
            </h1>
            <p className={styles.heroSubtitle}>
              Turn your space into a cultural statement.
            </p>
            <p className={styles.heroDescription}>
              Curated magazines extend dwell time, create Instagrammable moments, and tell customers who you are before you say a word. Start with a trial order today. 
            </p>
            <Link to="/retailer-application-form" className={styles.ctaButton}>
              Request Access for Your Shop
            </Link>
          </div>
          <div className={styles.heroVisual}>
            <img src="/For_Retailers_Image.jpg" style={{ width:'100%', height:'420px', objectFit: 'cover', objectPosition: 'center 55%', overflow: 'hidden' }} alt="Retailer icon" className={styles.heroIcon} />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Retailers Choose Neesh</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <img src="/Search-Icon-02.svg" alt="Curation icon" />
              </div>
              <h3>Curated Selection</h3>
              <p>We handpick magazines that align with your aesthetic and customer’s. No more sifting through endless catalogs or guessing what will resonate with your space.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <img src="/box-icon.svg" alt="Returns icon" />
              </div>
              <h3>Guaranteed Returns</h3>
              <p>Shop with confidence knowing you can return unsold copies. We handle the logistics so you can focus on serving customers.</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <img src="/Insights-Icon-01.svg" alt="Margins icon" />
              </div>
              <h3>Clear Margins</h3>
              <p>Transparent pricing and terms upfront. Make informed decisions about what to stock without hidden costs or surprises.</p>
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
              <p>Tell us about your shop, your customers, and what kind of magazines you're looking for.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h4>Get Approved</h4>
              <p>We review your application and set up your account with access to our curated marketplace.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h4>Browse & Order</h4>
              <p>Explore our catalog, place small trial orders, and see what resonates with your customers.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h4>Stock & Sell</h4>
              <p>Receive your magazines, display them in your shop, and return any unsold copies hassle-free.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Types Section */}
      <section className={styles.shopTypes}>
        <div className={styles.container}>
          <div className={styles.shopTypesContent}>
            <h2 className={styles.sectionTitle}>Curated for Your Shop</h2>
            <div className={styles.shopTypesList}>
              <div className={styles.shopType}>
                <h4>Independent Bookstores</h4>
                <p>Complement your book selection with magazines that reflect your literary sensibility and community interests.</p>
              </div>
              <div className={styles.shopType}>
                <h4>Coffee Shops & Cafes</h4>
                <p>Give customers something engaging to read while they enjoy their coffee. Create a space worth lingering in.</p>
              </div>
              <div className={styles.shopType}>
                <h4>Art & Design Stores</h4>
                <p>Stock magazines that inspire creativity and showcase the latest in art, design, and culture.</p>
              </div>
              <div className={styles.shopType}>
                <h4>Lifestyle Boutiques</h4>
                <p>Curate magazines that align with your brand and give customers insight into the world you're building.</p>
              </div>
              <div className={styles.shopType}>
                <h4>Record Stores</h4>
                <p>Add music and culture magazines that complement your vinyl collection and reflect the musical revolutions happening right now.</p>
              </div>
              <div className={styles.shopType}>
                <h4>Specialty Retailers</h4>
                <p>Whether you sell vintage goods, handmade items, or unique finds, magazines help you tell your story.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Details */}
      <section className={styles.benefitsDetails}>
        <div className={styles.container}>
          <div className={styles.benefitsDetailsContent}>
            <h2 className={styles.sectionTitle}>Print that pays off.</h2>
            <div className={styles.benefitsDetailsList}>
              <div className={styles.benefitDetail}>
                <h4>Small Trial Orders</h4>
                <p>Start with just a few copies to test what works. No subscriptions or long term commitments. </p>
              </div>
              <div className={styles.benefitDetail}>
                <h4>Flexible Delivery</h4>
                <p>Choose delivery frequency, quantity, or one-time orders. We work with your business, not against it.</p>
              </div>
              <div className={styles.benefitDetail}>
                <h4>Direct Publisher Relationships</h4>
                <p>Connect directly with independent publishers and discover unique titles you won't find through traditional distributors.</p>
              </div>
              <div className={styles.benefitDetail}>
                <h4>Community Focus</h4>
                <p>We prioritize independent retailers who care about community and want to offer something special.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to make your space worth staying for?</h2>
            <p>Join independent retailers discovering magazines that turn counters, walls, and waiting areas into conversation starters and casual browsers into loyal customers.</p>
            <Link to="/retailer-application-form" className={styles.ctaButton}>
              Request Access for Your Shop
            </Link>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RetailerLandingPage;
