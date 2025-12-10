import { useEffect, useState } from 'react';

const ScrollTracker = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div className="scroll-tracker">
      <div
        className="scroll-tracker-progress"
        style={{ height: `${scrollProgress}%` }}
      />
    </div>
  );
};

export default ScrollTracker;
