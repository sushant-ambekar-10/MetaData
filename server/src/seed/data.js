import { slugify } from '../utils/slugify.js';

const GH = 'https://github.com/sushant-ambekar-10/';
const d = (y, m) => new Date(Date.UTC(y, m - 1, 1));

export const profile = {
  fullName: 'Sushant Sanjay Ambekar',
  tagline: 'To digitize the mind',
  githubBio: 'Innovating with Code | Building Smart Solutions',
  bio: 'CSE student and developer exploring web, DevOps, Android, AI and ML.',
  roles: ['Full-Stack Developer', 'Android Developer', 'DevOps Learner', 'Problem Solver'],
  emails: ['sushantsambekar@gmail.com', '23030151@ycce.in'],
  links: {
    linkedin: 'https://www.linkedin.com/in/sushant-ambekar-066b06316/',
    github: 'https://github.com/sushant-ambekar-10',
    instagram: 'https://www.instagram.com/sushant_ambekar_10/',
    facebook: 'https://www.facebook.com/mangal.ambekar.5',
  },
  showFacebook: false, // hidden by default
  showDob: false, // hidden by default
  dob: '', // TODO: add YYYY-MM-DD in admin if you ever want to show it
  resumeUrl: '/resume.pdf',
};

// TODO: set profile URLs for LeetCode / HackerRank / GFG in the admin panel
export const stats = [
  { label: 'LeetCode problems', value: 200, suffix: '+', platform: 'leetcode', url: '' },
  { label: 'HackerRank Hackos', value: 2000, suffix: '+', platform: 'hackerrank', url: '' },
  { label: 'GeeksforGeeks problems', value: 100, suffix: '+', platform: 'gfg', url: '' },
  { label: 'Hackathon finals', value: 3, suffix: '+', platform: 'hackathon' },
  { label: 'CGPA', value: 8.82, decimals: 2, platform: 'academics' },
];

// TODO: SSC school name / years, Diploma years
export const qualifications = [
  {
    level: 'B.Tech in Computer Science & Engineering',
    institution: 'Yeshwantrao Chavan College of Engineering (YCCE), Nagpur',
    score: 'CGPA 8.82',
    year: "Batch '26",
  },
  {
    level: 'Diploma in Information Technology',
    institution: 'Government Polytechnic Nanded (MSBTE)',
    score: '88%',
    year: '', // TODO
    semesters: [
      { sem: 3, sgpa: 8.66 },
      { sem: 4, sgpa: 8.8 },
      { sem: 5, sgpa: 8.99 },
    ],
  },
  {
    level: 'SSC',
    institution: 'Nanded', // TODO: school name
    score: '90.80%',
    year: '', // TODO
  },
];

export const achievements = [
  { text: '1st Rank in Final Projects (Capstone) in Diploma', featured: true },
  { text: '2nd Rank in Diploma in Information Technology at Government Polytechnic Nanded', featured: true },
  { text: '200+ LeetCode problems with 50+ days badge in 2025' },
  { text: '2000+ Hackos in HackerRank' },
  { text: '100+ GeeksforGeeks problems' },
  { text: '4th Rank in Smackathon, Upsurge Event, YCCE-23', featured: true },
  { text: 'One of the finalists in 3+ hackathons' },
  { text: '5-star ratings in Java, SQL and Problem Solving on HackerRank' },
  { text: 'Training & Placement Coordinator @YCCE', featured: true },
  { text: 'Top-10 CGPA ranker' },
];

// TODO: add credential URLs in the admin panel
export const certifications = [
  { title: 'Internship Certification', issuer: 'Kalavati Technologies Pvt. Ltd.', featured: true },
  { title: 'Internship Certification', issuer: 'My Job Grow', featured: true },
  { title: 'Java Certification', issuer: 'HackerRank' },
  { title: 'SQL Certification', issuer: 'HackerRank' },
  { title: 'Web Development', issuer: 'Udemy', featured: true },
  { title: 'DevOps', issuer: 'IBM (Coursera)', featured: true },
  { title: 'AWS Cloud', issuer: 'AWS (Coursera)', featured: true },
  { title: 'AI & IBM Cloud Bootcamp', issuer: 'IBM' },
];

const sk = (category, items) => items.map(([name, featured = false]) => ({ name, category, featured }));
export const skills = [
  ...sk('Languages', [['Java', true], ['Python'], ['C'], ['JavaScript']]),
  ...sk('Web', [['MERN Stack', true], ['HTML & CSS'], ['Tailwind CSS'], ['Bootstrap'], ['WordPress']]),
  ...sk('Backend/DB', [['Java SpringBoot', true], ['MySQL', true], ['Firebase']]),
  ...sk('Mobile', [['Android using Java', true]]),
  ...sk('DevOps/Cloud', [['Git & GitHub'], ['Docker'], ['Jenkins'], ['Kubernetes'], ['AWS Cloud', true]]),
];

// Newest first on the timeline
export const experience = [
  {
    role: 'Training & Placement Coordinator',
    org: 'Yeshwantrao Chavan College of Engineering (YCCE)',
    type: 'leadership',
    start: d(2024, 8),
    end: null,
    current: true,
    description: 'Core coordinator of the Training & Placement Cell at YCCE.',
    highlights: [
      'Managed campus drives for Infosys, TCS, HCLTech, Zoho, Infocepts and Jubilant FoodWorks.',
      'Helped organise the HR Conclave with HR leaders from Persistent Systems, Ather Energy, Swiggy, Zomato, Mahindra and Delaplex.',
    ],
    featured: true,
  },
  {
    role: 'Web Development Intern',
    org: 'My Job Grow',
    type: 'internship',
    start: d(2024, 8),
    end: d(2024, 11),
    description: 'Built and deployed responsive full-stack applications.',
    highlights: [
      'Worked with React.js, Node.js, Express.js and MongoDB.',
      'Developed RESTful services and collaborated with the team using Git.',
      'Deployed applications using GitHub and Netlify.',
    ],
    featured: true,
  },
  {
    role: 'Web Development Intern',
    org: 'Kalavati Technologies Pvt. Ltd.',
    type: 'internship',
    start: d(2022, 7),
    end: d(2022, 9),
    description: 'Industrial training focused on front-end web development.',
    highlights: [
      'Trained in HTML, CSS, JavaScript, Bootstrap and WordPress.',
      'Built responsive websites with customization and UI design.',
    ],
    featured: true,
  },
];

// github: repos not listed in the brief are guessed from the project name.
// TODO: verify every URL marked "verify" below, and fill liveUrl placeholders in the admin panel.
const P = (p) => ({ ...p, slug: slugify(p.name) });
export const projects = [
  P({
    name: 'Sign Detection System for Impaired Person App',
    duration: 'Jan 2025 - Present', startDate: d(2025, 1), endDate: null, category: 'ML/AI',
    skills: ['Android', 'Python', 'Machine Learning', 'Deep Learning', 'IoT'],
    description: 'AI app that recognises sign-language gestures and converts them to text and speech, evolving into an IoT Smart Glove.',
    longDescription: 'The app recognises sign-language gestures and converts them into text and speech. It is evolving into an IoT Smart Glove that uses gesture sensors and word prediction.',
    problem: 'Sign-language users often struggle to communicate with people who do not understand sign language.',
    solution: 'A deep-learning model recognises gestures and outputs text or speech; a sensor-based smart glove adds word prediction for faster, more natural conversation.',
    github: GH + 'Sign-Detection-System-for-Impaired-Person-App', featured: true,
  }),
  P({
    name: 'Food Waste Management App',
    duration: 'Jan 2025 - Present', startDate: d(2025, 1), endDate: null, category: 'Android',
    skills: ['Android', 'Firebase', 'Machine Learning'],
    description: 'Redistributes surplus food to people in need, with AI that suggests dishes from leftover ingredients.',
    longDescription: 'An Android app that connects food donors with people in need. An AI feature suggests dishes that can be made from leftover ingredients.',
    problem: 'Large amounts of edible food are wasted while others go hungry.',
    solution: 'The app routes surplus food to people in need and helps households reduce waste by suggesting recipes from what they already have.',
    github: GH + 'Food-Waste-Management-App', featured: true,
  }),
  P({
    name: 'CricbOI',
    duration: 'Sep 2025', startDate: d(2025, 9), endDate: d(2025, 9), category: 'Web',
    skills: ['HTML', 'CSS', 'JavaScript', 'Firebase'],
    description: 'A platform for cricket players to register and manage their profiles for cricket organisations.',
    github: GH + 'cricbOl',
    liveUrl: 'https://todo-live-url.example.com/cricboi', // TODO: replace with the real live link
    featured: true,
  }),
  P({
    name: 'CareNow',
    duration: 'Jan 2024 - May 2024', startDate: d(2024, 1), endDate: d(2024, 5), category: 'Android',
    skills: ['Android', 'Java', 'Firebase'],
    description: 'Connects patients and caregivers with real-time alerts and health tracking.',
    problem: 'Patients and caregivers need a simple, reliable way to stay connected and informed.',
    solution: 'Real-time alerts and health tracking keep caregivers updated on a patient\'s condition.',
    github: GH + 'CareNow',
  }),
  P({
    name: 'Me-taData',
    duration: 'Jan 2024 - Present', startDate: d(2024, 1), endDate: null, category: 'Web',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind'],
    description: 'This portfolio: an interactive, admin-managed personal site built on the MERN stack.',
    github: GH + 'My-Portfolio',
    liveUrl: 'https://todo-live-url.example.com', // TODO: replace with the deployed portfolio URL
  }),
  P({
    name: 'Speak2Sheet',
    duration: 'Jul 2024', startDate: d(2024, 7), endDate: d(2024, 7), category: 'Other',
    skills: ['Python'],
    description: 'A Python tool that turns spoken input into structured spreadsheet entries.', // TODO: edit in admin
    github: GH + 'Speak2Sheet', // TODO: verify
  }),
  P({
    name: 'My-Command',
    duration: 'Jul 2024', startDate: d(2024, 7), endDate: d(2024, 7), category: 'Other',
    skills: ['Python'],
    description: 'A Python utility for running custom commands and automating everyday tasks.', // TODO: edit in admin
    github: GH + 'My-Command', // TODO: verify
  }),
  P({
    name: 'Locity',
    duration: 'Jul 2023 - Present', startDate: d(2023, 7), endDate: null, category: 'Android',
    skills: ['Android', 'Firebase'],
    description: 'An Android app that helps users discover and share places in their city.', // TODO: edit in admin
    github: GH + 'Locity', // TODO: verify
  }),
  P({
    name: 'DigVid',
    duration: 'Jan 2022 - Jan 2023', startDate: d(2022, 1), endDate: d(2023, 1), category: 'Web',
    skills: ['WordPress'],
    description: 'A WordPress-based website built for digital content and video.', // TODO: edit in admin
    github: GH + 'DigVid', // TODO: verify
    liveUrl: 'https://todo-live-url.example.com/digvid', // TODO
  }),
  P({
    name: 'JnearS',
    duration: 'Jan 2023', startDate: d(2023, 1), endDate: d(2023, 1), category: 'Web',
    skills: ['HTML', 'CSS', 'JavaScript', 'PHP', 'phpMyAdmin', 'Databases'],
    description: 'A database-driven web application built with PHP, JavaScript and phpMyAdmin.', // TODO: edit in admin
    github: GH + 'JnearS', // TODO: verify
    liveUrl: 'https://todo-live-url.example.com/jnears', // TODO
  }),
  P({
    name: 'Locify',
    duration: 'Jan 2023', startDate: d(2023, 1), endDate: d(2023, 1), category: 'Android',
    skills: ['Android'],
    description: 'An Android app for location-based features and sharing.', // TODO: edit in admin
    github: GH + 'Locify', // TODO: verify
  }),
  P({
    name: 'Digital Library',
    duration: 'Jan 2020 - Jan 2022', startDate: d(2020, 1), endDate: d(2022, 1), category: 'Web',
    skills: ['HTML', 'CSS', 'JavaScript'],
    description: 'A web-based digital library for browsing and organising books and resources.', // TODO: edit in admin
    github: GH + 'Digital-Library', // TODO: verify
    liveUrl: 'https://todo-live-url.example.com/digital-library', // TODO
  }),
  P({
    name: 'Java Compiler',
    duration: 'Jan 2022', startDate: d(2022, 1), endDate: d(2022, 1), category: 'Other',
    skills: ['Java', 'VB.NET'],
    description: 'A working Java compiler built with Java and operating-system command knowledge.',
    github: GH + 'Java-Compiler', // TODO: verify
  }),
];

export const testimonials = []; // empty on purpose: UI shows an elegant empty state