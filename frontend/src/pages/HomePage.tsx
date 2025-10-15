import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IntroPage from '../components/IntroPage';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import styles from './Home.module.css';
import { supabase } from '@/integrations/supabase/client';
import { config } from '@/lib/config';
import { useContentManagement } from '../hooks/useContentManagement';

const Home = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  // Get dynamic content
  const { getContentByKey, getStylesByKey, getCustomCSSByKey, navigationItems, loading } = useContentManagement();

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleEmailSubscription = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setSubscriptionMessage('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);
    setSubscriptionMessage('');

    try {
      // Use the mailing list edge function
      const response = await fetch(`${config.supabase.url}/functions/v1/mailing-list/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.supabase.anonKey}`,
        },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubscriptionMessage(result.message || 'Something went wrong. Please try again.');
        return;
      }

      setSubscriptionMessage(result.message || 'Successfully subscribed! Check your email for a welcome message.');
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscriptionMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
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

  // Content key mappings (same as in VisualPageEditor)
  const contentKeyMappings: { [key: string]: string } = {
    // Hero section - match Visual Editor mappings
    'h1': 'homepage_hero_title',
    '.hero h1': 'homepage_hero_title',
    '.hero-title': 'homepage_hero_title',
    'h1.hero-title': 'homepage_hero_title',
    'section.hero p': 'homepage_hero_subtitle',
    '.hero p': 'homepage_hero_subtitle',

    // Publisher value proposition
    'section.valueProps h3:first-of-type': 'homepage_publisher_section_title',
    '.propCard:nth-child(1) h3': 'homepage_publisher_section_title',
    'section.valueProps h2:first-of-type': 'homepage_publisher_main_title',
    '.propCard:nth-child(1) h2': 'homepage_publisher_main_title',
    'section.valueProps p:first-of-type': 'homepage_publisher_description',
    '.propCard:nth-child(1) p:first-of-type': 'homepage_publisher_description',
    'section.valueProps p.subText:first-of-type': 'homepage_publisher_subtext',
    '.propCard:nth-child(1) .subText': 'homepage_publisher_subtext',

    // Retailer value proposition
    'section.valueProps h3:last-of-type': 'homepage_retailer_section_title',
    '.propCard:nth-child(2) h3': 'homepage_retailer_section_title',
    'section.valueProps h2:last-of-type': 'homepage_retailer_main_title',
    '.propCard:nth-child(2) h2': 'homepage_retailer_main_title',
    'section.valueProps p:nth-of-type(2)': 'homepage_retailer_description',
    '.propCard:nth-child(2) p:first-of-type': 'homepage_retailer_description',
    'section.valueProps p.subText:last-of-type': 'homepage_retailer_subtext',
    '.propCard:nth-child(2) .subText': 'homepage_retailer_subtext',

    // Pipeline section
    'section.pipeline h2': 'homepage_pipeline_title',
    '.pipeline h2': 'homepage_pipeline_title',
    'section.pipeline h4:nth-of-type(1)': 'homepage_pipeline_step1_title',
    '.step:nth-child(1) h4': 'homepage_pipeline_step1_title',
    'section.pipeline p:nth-of-type(1)': 'homepage_pipeline_step1_desc',
    '.step:nth-child(1) p': 'homepage_pipeline_step1_desc',
    'section.pipeline h4:nth-of-type(2)': 'homepage_pipeline_step2_title',
    '.step:nth-child(2) h4': 'homepage_pipeline_step2_title',
    'section.pipeline p:nth-of-type(2)': 'homepage_pipeline_step2_desc',
    '.step:nth-child(2) p': 'homepage_pipeline_step2_desc',
    'section.pipeline h4:nth-of-type(3)': 'homepage_pipeline_step3_title',
    '.step:nth-child(3) h4': 'homepage_pipeline_step3_title',
    'section.pipeline p:nth-of-type(3)': 'homepage_pipeline_step3_desc',
    '.step:nth-child(3) p': 'homepage_pipeline_step3_desc',

    // CTA section
    'section.cta h2': 'homepage_cta_title',
    '.ctaTitle': 'homepage_cta_title'
  };

  // Apply saved styles to elements
  const applySavedStyles = () => {
    console.log('🎨 Applying saved styles to main site...');

    Object.entries(contentKeyMappings).forEach(([selector, contentKey]) => {
      const styles = getStylesByKey(contentKey);
      const customCSS = getCustomCSSByKey(contentKey);

      if (Object.keys(styles).length > 0 || customCSS) {
        console.log(`🎨 Applying styles for ${contentKey}:`, { styles, customCSS });

        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          const htmlElement = element as HTMLElement;

          // Apply CSS styles
          Object.entries(styles).forEach(([property, value]) => {
            if (value) {
              // Convert camelCase to kebab-case
              const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
              htmlElement.style.setProperty(cssProperty, value as string);
              console.log(`✨ Applied ${cssProperty}: ${value} to`, htmlElement);
            }
          });

          // Apply custom CSS
          if (customCSS) {
            const cssRules = customCSS.split(';').filter(rule => rule.trim());
            cssRules.forEach(rule => {
              const [property, value] = rule.split(':').map(s => s.trim());
              if (property && value) {
                htmlElement.style.setProperty(property, value);
                console.log(`✨ Applied custom CSS ${property}: ${value} to`, htmlElement);
              }
            });
          }
        });
      }
    });
  };

  // Apply styles when content loads
  useEffect(() => {
    if (!loading) {
      // Wait a bit for DOM to be ready
      setTimeout(() => {
        applySavedStyles();
      }, 100);
    }
  }, [loading, getStylesByKey, getCustomCSSByKey]);

  // Check if we're in CMS preview mode
  const isPreviewMode = new URLSearchParams(window.location.search).get('cms-preview') === 'true';

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
              <h1>{getContentByKey('homepage_hero_title') || 'The OS for Indie Print'}</h1>
              <p>{getContentByKey('homepage_hero_subtitle') || 'Publishers get discovered and paid faster. Retailers stock rare titles with zero risk. We handle the rest.'}</p>
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
              <h3>{getContentByKey('homepage_publisher_section_title') || 'For Publishers'}</h3>
              <h2>{getContentByKey('homepage_publisher_main_title') || 'Get stocked. Get paid. Keep control.'}</h2>
              <p>{getContentByKey('homepage_publisher_description') || 'The hardest shelves to reach are often the most valuable. Neesh opens access to retailers that traditional distributors overlook and makes every transaction clean and direct.'}</p>
              <p className={styles.subText}>{getContentByKey('homepage_publisher_subtext') || 'Upload your catalog once, and we put your work in front of the shops that matter. Orders, returns, and payouts flow through us, so you get paid fast and can keep creating.'}</p>
              <Link to="/publisher-application" className={styles.propLink}>
                For Publishers
              </Link>
            </div>
            <div className={styles.propCard}>
              <div className={styles.propIcon}><img src="/Retailer-Icon.svg" alt="Retailer icon" style={{ width: '75px', height: '75px' }} /></div>
              <h3>{getContentByKey('homepage_retailer_section_title') || 'For Retailers'}</h3>
              <h2>{getContentByKey('homepage_retailer_main_title') || 'Stock magazines that make your space unforgettable.'}</h2>
              <p>{getContentByKey('homepage_retailer_description') || "Browse curated titles matched to your aesthetic. Order small quantities, return what doesn't sell. We connect you with rare, independent publications that signal taste and keep customers lingering."}</p>
              <p className={styles.subText}>{getContentByKey('homepage_retailer_subtext') || "No subscriptions or commitments. Just access to magazines your competitors can't find."}</p>
              <Link to="/retailer-application" className={styles.propLink}>
                For Retailers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section id="pipeline" className={styles.pipeline}>
        <div className={styles.container}>
          <h2>{getContentByKey('homepage_pipeline_title') || 'You control your work. We handle the logistics.'}</h2>
          <div className={styles.pipelineSteps}>
            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <img src="/Mag-Upload-Icon-02.svg" alt="Magazine upload icon" style={{ width: '75px', height: '75px' }} />
              </div>
              <h4>{getContentByKey('homepage_pipeline_step1_title') || 'Step 1'}</h4>
              <p>{getContentByKey('homepage_pipeline_step1_desc') || 'Publishers upload titles, inventory, and pricing.'}</p>
              <span className={styles.stepSubtext}>{getContentByKey('homepage_pipeline_step1_subtext') || 'No gatekeepers or exclusivity requirements. You control where your work goes and what it costs.'}</span>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <img src="/Search-Icon-02.svg" alt="Search icon" style={{ width: '75px', height: '75px' }} />
              </div>
              <h4>{getContentByKey('homepage_pipeline_step2_title') || 'Step 2'}</h4>
              <p>{getContentByKey('homepage_pipeline_step2_desc') || 'Retailers explore collections and place small trial orders.'}</p>
              <span className={styles.stepSubtext}>{getContentByKey('homepage_pipeline_step2_subtext') || 'Discovery built for browsing. Search by topic, region, or theme. Find titles without combing through catalogs or cold-emailing publishers.'}</span>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <img src="/Fulfillment-Icon.svg" alt="Fulfillment icon" style={{ width: '75px', height: '75px' }} />
              </div>
              <h4>{getContentByKey('homepage_pipeline_step3_title') || 'Step 3'}</h4>
              <p>{getContentByKey('homepage_pipeline_step3_desc') || 'Fulfillment and returns are managed through Neesh.'}</p>
              <span className={styles.stepSubtext}>{getContentByKey('homepage_pipeline_step3_subtext') || 'We coordinate logistics, track inventory, and handle returns so publishers get accurate data and retailers take zero risk.'}</span>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <img src="/Insights-Icon-01.svg" alt="Insights icon" style={{ width: '75px', height: '75px' }} />
              </div>
              <h4>Step 4</h4>
              <p>Everyone gets insights—what moved, where, and when.</p>
              <span className={styles.stepSubtext}>Real-time sales data, reorder signals, and performance tracking. Better decisions for publishers, retailers, and the industry at large.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className={styles.problems}>
        <div className={styles.container}>
          <div className={styles.problemsGrid}>
            <div className={styles.problemsContent}>
              <h2>{getContentByKey('homepage_problems_title') || 'Print is alive. Neesh makes it work.'}</h2>
              <p>{getContentByKey('homepage_problems_description') || 'Magazines are thriving again, carrying culture into shops and building loyal audiences. Neesh gives retailers and publishers the system to keep that momentum.'}</p>

              <div className={styles.principles}>
                <h4>Built for Indie Print:</h4>
                <ul>
                  <li>Transparent pricing and data-backed sales engagement</li>
                  <li>Real margins and risk-free trial orders</li>
                  <li>Access to catalogs your shops can't source elsewhere</li>
                  <li>Tools to prove what's working and scale what sells</li>
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
        <h2 className={styles.ctaTitle} dangerouslySetInnerHTML={{
          __html: getContentByKey('homepage_cta_title') || 'Find your Neesh.<br />Keep indie print moving forward.'
        }}></h2>
        <img src="/haleybuschphoto_couch_upsidedown.jpg" alt="Upside down on magazine" className={styles.couchUpsideDown} />
        <Link to="/publisher-application" className={styles.publisherBtn}>
          For Publishers
        </Link>
        <Link to="/retailer-application" className={styles.retailerBtn}>
          For Retailers
        </Link>

      </section>

      {/* Mailing List Section */}
      <section className={styles.mailingList}>
        <div className={styles.mailingListContent}>
          <h3 className={styles.mailingListTitle}>Stay up to date on all things NEESH</h3>
          <p className={styles.mailingListSubtitle}>Get the latest updates on new magazines, features, and indie print news.</p>
          <form className={styles.mailingListForm} onSubmit={handleEmailSubscription}>
            <input
              type="email"
              placeholder="Enter your email address"
              className={styles.mailingListInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubscribing}
              required
            />
            <button
              type="submit"
              className={styles.mailingListButton}
              disabled={isSubscribing}
            >
              {isSubscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {subscriptionMessage && (
            <p className={`${styles.subscriptionMessage} ${subscriptionMessage.includes('Thanks') ? styles.success : styles.error}`}>
              {subscriptionMessage}
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
