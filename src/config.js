module.exports = {
  siteTitle: 'Arjun Nemani | Software Engineer',
  siteDescription:
    'Arjun Nemani is a software engineer based in Hyderabad, India studying at IIIT Hyderabad with a keen interest in Building & Scaling Software, Product Management and Community Building',
  siteKeywords:
    'Arjun Nemani, Arjun, Nemani, nemaniarjun, software engineer, full-stack engineer, devops, community building, product, management, javascript, rails, ruby, IIIT, Hyderabad, India',
  siteUrl: 'https://nemani.dev',
  siteLanguage: 'en_US',
  googleAnalyticsID: 'UA-164593019-1',
  // googleVerification: 'DCl7VAf9tcz6eD9gb67NfkNnJ1PKRNcg8qQiwpbx9Lk',
  name: 'Arjun Nemani',
  location: 'Hyderabad, India',
  email: 'hello@nemani.dev',
  github: 'https://github.com/nemani',
  twitterHandle: '@theRealNemani',
  socialMedia: [
    {
      name: 'GitHub',
      url: 'https://github.com/nemaniarjun',
    },
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/nemaniarjun',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/nemaniarjun',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/theRealNemani',
    },
  ],

  navLinks: [
    {
      name: 'About',
      url: '/#about',
    },
    {
      name: 'Experience',
      url: '/#jobs',
    },
    {
      name: 'Work',
      url: '/#projects',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
    {
      name: 'Blog',
      url: '/blog',
    },
  ],

  navHeight: 100,
  colors: {
    green: '#e15729',
    navy: '#17113d',
    darkNavy: '#201a4b',
  },

  srConfig: (delay = 200) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor: 0.25,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),
};
