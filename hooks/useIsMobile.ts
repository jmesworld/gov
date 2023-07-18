import { useEffect, useState } from 'react';

export const useIsViewportMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    function setSize() {
      if (window.innerWidth < 600) {
        setIsMobile(true);
        return;
      }
      setIsMobile(false);
    }
    if (!window) {
      return;
    }
    window.addEventListener('resize', setSize);
    return () => {
      window.removeEventListener('resize', setSize);
    };
  }, []);

  return [isMobile];
};
