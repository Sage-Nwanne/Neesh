import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import styles from './Home.module.css';

interface FAQItem {
  question: string;
  answer: string | string[];
}

const faqData: FAQItem[] = [
  {
    question: "What does Neesh actually do?",
    answer: "Neesh is the operating system for independent print. It is a wholesale platform where publishers upload their titles, retailers browse and order, payouts happen automatically, and unsold copies can be returned. Everything that used to happen across emails, spreadsheets is now handled in one clear place."
  },
  {
    question: "Why should publishers use Neesh?",
    answer: [
      "Because getting stocked shouldn't mean chasing invoices or sending hundreds of cold emails. With Neesh, you:",
      "• Get paid every two weeks, no consignment limbo",
      "• Reach curated shops that understand your aesthetic",
      "• Offload shipping and fulfillment headaches",
      "• See what's actually selling, not just what's shipped"
    ]
  },
  {
    question: "Why should retailers use Neesh?",
    answer: [
      "Because ordering magazines shouldn't feel like a gamble. With Neesh, you:",
      "• Order small, curated quantities",
      "• Return what doesn't sell with prepaid labels",
      "• Browse by vibe, not volume — genre, aesthetic, audience",
      "• See margins and shipping costs upfront"
    ]
  },
  {
    question: "How are you different from traditional distributors?",
    answer: [
      "Traditional distributors run on outdated workflows and clunky portals. Neesh is designed for indie print:",
      "• Guaranteed returns, not guesswork",
      "• Clear payouts every two weeks, not 90 days later",
      "• Modern interface with real-time order status",
      "• Built for small-batch, high-taste magazines"
    ]
  },
  {
    question: "How do returns work?",
    answer: "Returns are risk-free. If an issue doesn't move, send it back using prepaid labels. Retailers protect their margins. Publishers get clear data on what's working. No cover-tearing, no weird fine print."
  },
  {
    question: "How do you choose which publishers get listed?",
    answer: "Every magazine is approved based on design, cultural fit, retail readiness, and past sales. High-performing titles get featured in Neesh objects so retailers see the best of what's new. This keeps the catalog sharp and shops confident they're stocking quality."
  },
  {
    question: "What kind of data will I get?",
    answer: "Publishers get reorder summaries, return reports, and shop feedback. Retailers get sell-through rates and suggested reorders. Everyone sees what's working, where and how."
  },
  {
    question: "When do I get paid?",
    answer: "Publishers get paid automatically every two weeks through Stripe. No more emailing shops to ask if checks are in the mail."
  },
  {
    question: "What's coming next?",
    answer: [
      "We're starting with wholesale ordering, payouts, and returns. Coming soon:",
      "• A circular network where shops can resell overstock",
      "• Analytics that show real sell-through across stores",
      "• POS integrations with Shopify and Square",
      "• An ad marketplace that connects indie mags with values-aligned brands"
    ]
  }
];

const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className={styles.landingPage} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* FAQ Content */}
      <section style={{ flex: '1', padding: '60px 0', background: 'white' }}>
        <div className={styles.container}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{
              fontSize: '2.8rem',
              fontWeight: '700',
              marginBottom: '3rem',
              color: '#000',
              textAlign: 'center'
            }}>
              Frequently Asked Questions
            </h1>

            <div style={{ display: 'grid', gap: '1px', background: '#e5e5e5' }}>
              {faqData.map((item, index) => (
                <div key={index} style={{ background: 'white' }}>
                  <button
                    onClick={() => toggleItem(index)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      textAlign: 'left',
                      border: 'none',
                      background: 'white',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#000',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <span>{item.question}</span>
                    {openItems.includes(index) ? (
                      <ChevronUp size={20} style={{ color: '#666', flexShrink: 0, marginLeft: '16px' }} />
                    ) : (
                      <ChevronDown size={20} style={{ color: '#666', flexShrink: 0, marginLeft: '16px' }} />
                    )}
                  </button>

                  {openItems.includes(index) && (
                    <div style={{
                      padding: '0 24px 24px 24px',
                      background: 'white'
                    }}>
                      {Array.isArray(item.answer) ? (
                        <div style={{ color: '#666', lineHeight: '1.6' }}>
                          {item.answer.map((line, lineIndex) => (
                            <div key={lineIndex} style={{ marginBottom: lineIndex === 0 ? '12px' : '4px' }}>
                              {line}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: '#666', lineHeight: '1.6', margin: 0 }}>
                          {item.answer}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQPage;
