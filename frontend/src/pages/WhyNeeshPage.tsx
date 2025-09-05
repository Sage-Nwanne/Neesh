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
            Why Neesh Is Building Attribution Infrastructure for Independent Print
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem', textAlign: 'center', fontStyle: 'italic' }}>
            Strategic Memo<br />
            Gem Nwannem, Founder & CEO, Neesh
          </p>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem', color: '#000' }}>
            The opportunity is real. The infrastructure is not.
          </h2>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            Independent print is growing. Fast. You're seeing a wave of new titles with 1,000 to 10,000 readers doing smart, beautiful work across culture, design, fashion, food, identity. These magazines have influence. They have community. They have staying power. But they have no way to see what's working. No visibility into what's actually selling. No infrastructure to support growth.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            Publishers are still using spreadsheets and emails to manage orders. Retailers are still guessing what to buy based on Instagram posts and personal taste. Distributors hold the middle and offer little in the way of tools, transparency or data.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            This entire ecosystem is operating blind.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            And that's a problem, because print advertising still works. A Nielsen study for Meredith found that magazine ads return $7.81 for every $1 spent. That beats digital ad networks by a wide margin. But without data, advertisers can't justify the spend. Publishers can't pitch brand partners with confidence. Retailers can't optimize what's on their shelves. No one can scale.
          </p>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem', color: '#000' }}>
            We thought attribution tools could fix it. We were wrong.
          </h2>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            Our first idea was to build a lightweight attribution layer. We'd give publishers free QR codes, short links, trackable CTAs. When readers engaged, we'd track the behavior and package it up as ROI data for advertisers.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            Here's why that didn't work.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            First, publishers didn't want it. QR codes and tracking links felt off-brand. Aesthetic compromises. Workflow changes. No upside for them.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            Second, advertisers wouldn't trust it. Link clicks and QR scans are a weak signal. They might show a tiny slice of engagement, but it's sample-biased and hard to prove. Most brands wouldn't move real budget off that kind of data.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            Third, the underlying problem never went away. There's still no access to real sales data. Distributors don't share it. Retailers don't track it. Publishers don't have it.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            So even if we nailed the attribution UX, we'd still be guessing. And that's not a business.
          </p>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem', color: '#000' }}>
            None of the other shortcuts work either.
          </h2>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            We looked at everything.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            Payment processors don't give SKU-level data. If someone spends $47 at a boutique, we don't know if they bought a magazine or a candle.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            Retailer partnerships would be expensive and slow to scale. Most shops are small and not set up for data sharing. It would take years to piece together even a fraction of the ecosystem.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            Data aggregators like IRI and Circana focus on big box CPG. Indie print isn't on their radar and never will be.
          </p>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem', color: '#000' }}>
            Which brings us to the real answer.
          </h2>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            If the data doesn't exist, you have to build the system that creates it.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            We're building the commerce and fulfillment platform that powers independent print. Not as a detour. Not as a side hustle. As the only path forward.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            Neesh gives retailers a curated digital platform to order, restock, and discover new magazines. We give publishers a clean interface to track inventory, manage orders, coordinate shipping, and get paid. We handle logistics and payments. In return, we take a cut of every transaction.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            That alone solves real problems. But it also does something more important. It gives us structured, store-level data.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            We'll know which titles are selling, where they're selling, when they get reordered, and how fast they move. We'll know what gets returned and what never even hits the shelf. That data becomes the foundation of a new kind of attribution, one built on actual sell-through, not guesswork.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            Once the data flows, we can open the door to advertisers. With real distribution and performance data, we can offer brand partners visibility they've never had. Not just impressions. Not just placement. Proof.
          </p>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem', color: '#000' }}>
            This is how we unlock the ad market and build the moat.
          </h2>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            Independent publishers already pay distributors 5 to 10 percent of revenue. We're not introducing a new economic model. We're just building a better one. One that actually helps them sell.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            Our business model kicks in immediately:
          </p>
          <ul style={{ marginBottom: '1rem', paddingLeft: '2rem', color: '#333' }}>
            <li>Transaction fees from marketplace sales</li>
            <li>Brand placements once we have the data</li>
            <li>Performance reporting</li>
            <li>Future insights products</li>
          </ul>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem', color: '#000' }}>
            And it's defensible.
          </h2>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            When a publisher's entire fulfillment operation runs through Neesh, when all their retailer relationships are managed through our platform, when their revenue flows through our payment rails, they're not switching to save half a percentage point on fees. Every publisher we add makes the platform more valuable for retailers. Every retailer makes it more valuable for publishers. And every transaction makes our data more valuable for advertisers. And the logistics layer, messy as it is, keeps competitors out.
          </p>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem', color: '#000' }}>
            Financially, this adds up.
          </h2>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            The indie print ad market is roughly $500 million. If we capture 20 percent of that, that's $100 million flowing through our platform. With a 20 percent take rate, we're looking at $20 million in annual revenue from ad spend alone.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            That doesn't include marketplace transaction fees or insights products. With software margins and lean ops, this is a high-leverage model.
          </p>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem', color: '#000' }}>
            Why Now: The Market is Ready
          </h2>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            Independent print is having a moment. After years of digital fatigue, consumers are returning to physical media. Publishers are launching new titles. Retailers are expanding their magazine sections. But the infrastructure hasn't evolved since the 1990s.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            Meanwhile, digital advertising is getting more expensive and less effective. Privacy changes, ad blockers, and banner blindness are driving advertisers to seek new channels. They need what print offers: engaged audiences, brand safe environments, and premium context. They just need a way to buy it that makes sense.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            We're building that way.
          </p>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem', color: '#000' }}>
            Where we are now
          </h2>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            We're onboarding our first wave of publishers and retailers. Our immediate focus:
          </p>
          <ul style={{ marginBottom: '1rem', paddingLeft: '2rem', color: '#333' }}>
            <li>Build a functional, clean ordering experience for stockists</li>
            <li>Give publishers a fulfillment dashboard that actually helps</li>
            <li>Track issue-level orders, returns, and reorders by store</li>
            <li>Start mapping performance patterns across the network</li>
          </ul>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            This isn't the easy path. Building lightweight analytics tools would have been simpler. But simple solutions don't work in complex markets. Independent publishing needs infrastructure before it needs analytics. It needs commerce before it needs attribution.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            By building the marketplace first, we're not delaying our advertising ambitions. We're making them possible. We're creating the only attribution platform that will actually work because we're creating the data that powers it.
          </p>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem', color: '#000' }}>
            Final word
          </h2>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            Independent magazines represent something special in our digital age. They're objects of desire, markers of taste, and gathering points for communities. They deserve infrastructure as thoughtful as their editorial.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            Neesh didn't set out to build a B2B logistics platform. We set out to unlock ad dollars for independent print. But in a market this fragmented, with this much analog pain, you can't separate infrastructure from monetization. Attribution requires data. Data requires systems. So we're building the system.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            Publishers want to reach readers. Retailers want to stock magazines that sell. Advertisers want to reach engaged audiences. This isn't about doing two (or three) things at once. It's one strategy. One product. Two sides of the same platform.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            By solving real operational problems, we get clean, verified data. That data powers the only attribution model that makes sense in indie print. And that model unlocks spend that's been sitting on the sidelines.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            The future of print isn't about competing with digital. It's about offering something digital can't: tangible, beautiful, collectible media that people actually pay for. Our job is to make that market visible, measurable, and scalable.
          </p>
          <p style={{ marginBottom: '1rem', color: '#333' }}>
            That starts with commerce. Attribution follows. Advertising scales from there.
          </p>
          <p style={{ fontSize: '1.2rem', fontWeight: '600', marginTop: '2rem', color: '#000' }}>
            Welcome to Neesh. We're building the operating system for independent print.
          </p>
          <p style={{ fontSize: '1rem', color: '#666', marginTop: '1rem' }}>
            Gem Nwannem<br />
            Founder & CEO, Neesh
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default WhyNeeshPage;
