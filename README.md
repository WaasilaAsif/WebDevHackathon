# 1. **Members**
 - Waasila Asif *wasif.bscs24seecs@seecs.edu.pk*
 - Fatima Sajjad *fsajjad.bscs24seecs@seecs.edu.pk*
 - Aman Ajmal *aajmal.bscs24seecs@seecs.edu.pk* github name: PeaceTabahi
 - Zainab Raza *zmalik.bsai24seecs@seecs.edu.pk*

  
# LLMs we are using:
Chatgpt
Cursor
Claude
Deepseek
Bolt
Base44
vercel v0

src/
│
├── App.jsx
├── main.jsx
├── index.css
│
├── assets/
│   └── react.svg
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── AppShell.jsx
│   │
│   ├── upload/
│   │   └── FileUploader.jsx
│   │
│   ├── dashboard/
│   │   └── SkillChart.jsx
│   │
│   ├── jobs/
│   │   ├── JobCard.jsx
│   │   └── JobDetailsModal.jsx
│   │
│   └── ui/
│       ├── Button.jsx
│       ├── Input.jsx
│       └── Card.jsx
│
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Onboarding.jsx
│   │
│   ├── home/
│   │   └── Main.jsx           // main dashboard
│   │
│   ├── resume/
│   │   ├── UploadResume.jsx
│   │   └── ResumeResult.jsx
│   │
│   ├── interview/
│   │   ├── InterviewInput.jsx
│   │   └── InterviewResult.jsx
│   │
│   └── history/
│       └── History.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── useResume.js
│   └── useInterview.js
│
├── context/
│   └── AuthContext.jsx
│
├── services/
│   ├── api.js                 // axios or fetch wrapper
│   ├── resumeService.js
│   ├── jobService.js
│   └── interviewService.js
│
└── types/
    ├── profileTypes.js
    ├── resumeTypes.js
    └── jobTypes.js
