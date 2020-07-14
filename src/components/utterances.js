import React from 'react';

const UtterancesComments = () => (
  <section
    ref={elem => {
      if (!elem) {
        return;
      }
      const scriptElem = document.createElement('script');
      scriptElem.src = 'https://utteranc.es/client.js';
      scriptElem.async = true;
      scriptElem.crossOrigin = 'anonymous';
      scriptElem.setAttribute('repo', 'nemani/nemani.dev');
      scriptElem.setAttribute('issue-term', 'title');
      scriptElem.setAttribute('label', 'blog-comments');
      scriptElem.setAttribute('theme', 'github-dark-orange');
      elem.appendChild(scriptElem);
    }}
  />
);

export default UtterancesComments;
