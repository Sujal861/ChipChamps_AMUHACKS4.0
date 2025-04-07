
import { useEffect } from 'react';

const SplineBackground = () => {
  useEffect(() => {
    // Create a script element for the Spline viewer
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.0.54/build/spline-viewer.js';
    document.head.appendChild(script);
    
    // Create the spline-viewer element
    const splineViewer = document.createElement('spline-viewer');
    splineViewer.setAttribute('url', 'https://my.spline.design/cutecomputerfollowcursor-5a1c323afe5f2e17fbffc0c139669fb0/');
    splineViewer.setAttribute('class', 'fixed top-0 left-0 w-full h-full -z-5 pointer-events-none');
    document.body.appendChild(splineViewer);
    
    return () => {
      // Clean up on component unmount
      document.head.removeChild(script);
      if (document.body.contains(splineViewer)) {
        document.body.removeChild(splineViewer);
      }
    };
  }, []);
  
  return null; // This component doesn't render any visible elements directly
};

export default SplineBackground;
