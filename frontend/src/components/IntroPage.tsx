import React, { useEffect } from 'react';
import styles from './IntroPage.module.css';

interface IntroPageProps {
  onComplete: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000); // 2 seconds to match the CSS animation

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={styles.introPage}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <img src="/NEESH-logo-transparent.png.png" alt="NEESH" className={styles.logoImage} />
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
