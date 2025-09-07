import React from 'react';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import styles from './Home.module.css';

const WhyNeeshPage: React.FC = () => {
  return (
    <div className={styles.landingPage} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Why Neesh Content */}
      <section style={{ flex: '1', padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', color: '#000', textAlign: 'center' }}>
            Why Neesh Exists
          </h1>

          <p style={{ fontSize: '1.3rem', color: '#666', marginBottom: '1rem', textAlign: 'center', fontStyle: 'italic' }}>
            A Vision for the Future of Independent Magazines
          </p>

          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem', textAlign: 'center', fontStyle: 'italic' }}>
            By Gem Nwannem, Founder & CEO, Neesh
          </p>

          <p style={{ marginBottom: '1.5rem', color: '#333' }}>
            After years of digital fatigue, readers are reaching for objects they can hold, keep, and share. Across culture, design, fashion, food, and identity, small publishers are producing work that is ambitious, beautiful, and deeply rooted in community.
          </p>

          <p style={{ marginBottom: '1.5rem', color: '#333' }}>
            The influence of these magazines is undeniable. They spark conversation, shape taste, and anchor local scenes. But beneath the surface, the system that moves them is fragile. Publishers manage orders in spreadsheets and email threads. Shops make stocking decisions based on Instagram posts or gut instinct. Distributors do what they can with limited tools, but transparency and data rarely enter the picture.
          </p>

          <p style={{ marginBottom: '1.5rem', color: '#333', fontWeight: '600' }}>
            It is a market that thrives creatively, but operates blind.
          </p>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '2.5rem', marginBottom: '1rem', color: '#000' }}>
            Everyone's Guessing
          </h2>

          <p style={{ marginBottom: '1.5rem', color: '#333' }}>
            This disconnect has consequences. Print advertising, for example, remains one of the most effective media channels; Nielsen found that magazine ads return nearly eight dollars for every dollar spent. Yet without reliable sales data, advertisers struggle to justify investment. Publishers can't pitch brand partners with confidence. Retailers can't analyze what works on their shelves. Growth across the ecosystem stalls.
          </p>

          <p style={{ marginBottom: '1.5rem', color: '#333' }}>
            For years, workarounds have been attempted. QR codes. Trackable links. Sampling partnerships. None have delivered the kind of trusted, system-wide visibility the industry actually needs. The real problem has always been infrastructure.
          </p>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '2.5rem', marginBottom: '1rem', color: '#000' }}>
            Build What Doesn't Exist
          </h2>

          <p style={{ marginBottom: '1.5rem', color: '#333' }}>
            At Neesh, we came to a simple conclusion: if the data doesn't exist, you have to build the system that creates it.
          </p>

          <p style={{ marginBottom: '1.5rem', color: '#333' }}>
            That's why we're building a commerce and fulfillment platform designed specifically for independent print. Neesh exists to strengthen the ecosystem; to connect publishers, retailers, and distributors with tools that make the whole system work smarter.
          </p>

          <p style={{ marginBottom: '1.5rem', color: '#333' }}>
            For publishers, Neesh means a clear way to track orders, manage inventory, coordinate shipping, and, most importantly, get paid on time. For retailers, it means a curated marketplace where discovery, ordering, and returns can happen in one place, with far less risk. For distributors, it means modern back-office support without losing the catalogs and relationships they've built over decades.
          </p>

          <p style={{ marginBottom: '1.5rem', color: '#333' }}>
            The byproduct of solving these everyday operational challenges is something much larger: structured, store-level data. Which magazines are selling, where they're moving, how fast they turn, and when they're reordered. Information that has never been systematically available in indie print.
          </p>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '2.5rem', marginBottom: '1rem', color: '#000' }}>
            Data Creates Trust
          </h2>

          <p style={{ marginBottom: '1.5rem', color: '#333' }}>
            Once this data flows, a new future opens up. Publishers will finally be able to present advertisers with proof of performance. Retailers will stock smarter, guided by evidence rather than guesswork. Advertisers will gain access to engaged audiences in cultural environments they can trust.
          </p>

          <p style={{ marginBottom: '1.5rem', color: '#333' }}>
            And because the system is collaborative, each transaction strengthening the network, the value compounds. Every new publisher added makes the platform more useful for shops. Every shop makes it more valuable for publishers. Together they generate the insights that unlock new revenue streams for everyone.
          </p>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '2.5rem', marginBottom: '1rem', color: '#000' }}>
            Digital Fatigue, Analog Future
          </h2>

          <p style={{ marginBottom: '1.5rem', color: '#333' }}>
            Independent print is resurging just as digital advertising is losing steam. Privacy restrictions, rising costs, and shrinking attention spans have left brands searching for channels that feel tangible, contextual, and premium. Print has always had those qualities. What it hasn't had is the infrastructure to make them legible to buyers.
          </p>

          <p style={{ marginBottom: '1.5rem', color: '#333', fontWeight: '600' }}>
            Neesh is building that bridge.
          </p>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '2.5rem', marginBottom: '1rem', color: '#000' }}>
            Make Print Visible
          </h2>

          <p style={{ marginBottom: '1.5rem', color: '#333' }}>
            The future of print isn't about competing with digital. It's about offering something digital can't: objects of desire that carry meaning in the hand and in the home. The role of infrastructure is to make those objects visible, measurable, and scalable without diluting their cultural weight.
          </p>

          <p style={{ marginBottom: '1.5rem', color: '#333' }}>
            That's the vision Neesh is committed to. An ecosystem where publishers can thrive, retailers can stock with confidence, and advertisers can see the value that's been there all along.
          </p>

          <p style={{ marginBottom: '2rem', color: '#333', fontWeight: '600' }}>
            We believe independent magazines deserve systems as thoughtful as their editorial. And building those systems is how we make sure print not only survives this cultural moment, but grows into its next era.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default WhyNeeshPage;
