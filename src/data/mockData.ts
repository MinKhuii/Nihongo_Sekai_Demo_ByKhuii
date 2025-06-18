import { Course, Classroom, Partner, Account } from "@/types";

export const mockPartners: Partner[] = [
  {
    partnerId: "1",
    accountId: "acc-1",
    bio: "Native Japanese speaker with 8 years of teaching experience. I specialize in conversational Japanese and business communication, helping students build confidence in real-world situations. My teaching philosophy focuses on practical application and cultural understanding. I've helped over 500 students achieve their Japanese learning goals, from basic conversation to business fluency. I believe learning should be enjoyable and relevant to your personal interests and career goals.",
    shortBio:
      "Native speaker specializing in conversation and business Japanese. 8+ years experience.",
    teachingExperience: 8,
    averageRating: 4.9,
    isApproved: true,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki Tanaka",
    specializations: [
      "Conversational Japanese",
      "Business Japanese",
      "Cultural Communication",
      "JLPT N3-N1",
    ],
    languages: [
      "Japanese (Native)",
      "English (Fluent)",
      "Korean (Intermediate)",
    ],
    certifications: [
      {
        id: "cert-1",
        title: "Japanese Language Teaching Competency Test",
        issuer: "Japan Foundation",
        date: "2018-03-15",
        credentialId: "JF-JLTCT-2018-001234",
      },
      {
        id: "cert-2",
        title: "Certified Business Japanese Instructor",
        issuer: "Association for Business Japanese Education",
        date: "2019-07-20",
        credentialId: "ABJE-CBI-2019-5678",
      },
      {
        id: "cert-3",
        title: "Online Teaching Excellence Certificate",
        issuer: "International Teaching Institute",
        date: "2021-02-10",
        credentialId: "ITI-OTE-2021-9012",
      },
    ],
    coursesTaught: [
      {
        id: "1",
        title: "Japanese for Beginners: Hiragana & Katakana",
        level: "Beginner",
        studentsCount: 1247,
        rating: 4.7,
      },
      {
        id: "2",
        title: "Conversational Japanese: Daily Life",
        level: "Elementary",
        studentsCount: 892,
        rating: 4.8,
      },
      {
        id: "3",
        title: "Business Japanese: Professional Communication",
        level: "Advanced",
        studentsCount: 456,
        rating: 4.9,
      },
    ],
    classroomsHosted: [
      {
        id: "1",
        title: "Morning Conversation Practice",
        studentsCount: 5,
        schedule: "Mon, Wed, Fri 9:00 AM JST",
        isActive: true,
      },
      {
        id: "3",
        title: "Business Japanese Workshop",
        studentsCount: 4,
        schedule: "Sat 2:00 PM JST",
        isActive: true,
      },
    ],
    account: {
      accountId: "acc-1",
      name: "Yuki Tanaka",
      email: "yuki.tanaka@example.com",
      role: "Partner",
      status: "Active",
      createdAt: "2023-01-15",
    },
  },
  {
    partnerId: "2",
    accountId: "acc-2",
    bio: "Certified JLPT instructor with expertise in grammar and exam preparation. I have been teaching Japanese for 5 years and have helped hundreds of students pass their JLPT exams. My structured approach to grammar teaching combined with practical exercises ensures students not only understand the rules but can apply them confidently. I specialize in N5 to N2 levels and have a 95% pass rate among my students.",
    shortBio:
      "JLPT specialist with 5+ years experience. 95% student pass rate.",
    teachingExperience: 5,
    averageRating: 4.8,
    isApproved: true,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hiroshi Sato",
    specializations: [
      "JLPT Preparation",
      "Grammar",
      "Exam Techniques",
      "Vocabulary Building",
    ],
    languages: ["Japanese (Native)", "English (Advanced)", "Chinese (Basic)"],
    certifications: [
      {
        id: "cert-4",
        title: "Japanese Language Teaching Certificate",
        issuer: "Tokyo University of Foreign Studies",
        date: "2019-03-25",
        credentialId: "TUFS-JLTC-2019-4567",
      },
      {
        id: "cert-5",
        title: "JLPT Examiner Certification",
        issuer: "Japan Educational Exchanges and Services",
        date: "2020-08-12",
        credentialId: "JEES-JEC-2020-8901",
      },
    ],
    coursesTaught: [
      {
        id: "4",
        title: "JLPT N5 Preparation Course",
        level: "Beginner",
        studentsCount: 723,
        rating: 4.6,
      },
      {
        id: "7",
        title: "Japanese Grammar Mastery",
        level: "Intermediate",
        studentsCount: 534,
        rating: 4.8,
      },
    ],
    classroomsHosted: [
      {
        id: "2",
        title: "JLPT Study Group",
        studentsCount: 7,
        schedule: "Tue, Thu 7:00 PM JST",
        isActive: true,
      },
      {
        id: "4",
        title: "Anime Japanese Club",
        studentsCount: 9,
        schedule: "Sun 4:00 PM JST",
        isActive: true,
      },
    ],
    account: {
      accountId: "acc-2",
      name: "Hiroshi Sato",
      email: "hiroshi.sato@example.com",
      role: "Partner",
      status: "Active",
      createdAt: "2023-03-20",
    },
  },
  {
    partnerId: "3",
    accountId: "acc-3",
    bio: "Experienced Japanese culture and language instructor with a passion for sharing the beauty of Japanese traditions. I combine language learning with cultural immersion, teaching through traditional arts, festivals, and modern pop culture. My unique approach helps students understand not just what to say, but when and why to say it in Japanese cultural contexts.",
    shortBio:
      "Cultural immersion specialist combining language with traditional arts and modern culture.",
    teachingExperience: 6,
    averageRating: 4.7,
    isApproved: true,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Akiko Yamamoto",
    specializations: [
      "Cultural Japanese",
      "Traditional Arts",
      "Modern Culture",
      "Etiquette",
    ],
    languages: [
      "Japanese (Native)",
      "English (Fluent)",
      "French (Intermediate)",
    ],
    certifications: [
      {
        id: "cert-6",
        title: "Japanese Cultural Studies Certificate",
        issuer: "Kyoto International University",
        date: "2017-09-30",
        credentialId: "KIU-JCS-2017-3456",
      },
      {
        id: "cert-7",
        title: "Tea Ceremony Instructor License",
        issuer: "Urasenke Foundation",
        date: "2016-04-15",
        credentialId: "UF-TCIL-2016-7890",
      },
    ],
    coursesTaught: [
      {
        id: "5",
        title: "Japanese Culture and Traditions",
        level: "Intermediate",
        studentsCount: 634,
        rating: 4.5,
      },
      {
        id: "8",
        title: "Japanese Etiquette and Manners",
        level: "All Levels",
        studentsCount: 423,
        rating: 4.7,
      },
    ],
    classroomsHosted: [
      {
        id: "5",
        title: "Cultural Immersion Workshop",
        studentsCount: 8,
        schedule: "Sat 10:00 AM JST",
        isActive: true,
      },
    ],
    account: {
      accountId: "acc-3",
      name: "Akiko Yamamoto",
      email: "akiko.yamamoto@example.com",
      role: "Partner",
      status: "Active",
      createdAt: "2023-02-10",
    },
  },
  {
    partnerId: "4",
    accountId: "acc-4",
    bio: "Young and energetic teacher specializing in anime, manga, and modern Japanese pop culture. I make learning fun by incorporating students' interests into lessons. Perfect for younger learners or anyone interested in contemporary Japanese media. My interactive teaching style and use of multimedia content keeps students engaged and motivated.",
    shortBio:
      "Anime & manga specialist making Japanese fun through pop culture and multimedia.",
    teachingExperience: 3,
    averageRating: 4.6,
    isApproved: true,
    avatarUrl:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Takeshi Morimoto",
    specializations: [
      "Anime Japanese",
      "Manga",
      "Pop Culture",
      "Youth Teaching",
    ],
    languages: ["Japanese (Native)", "English (Advanced)", "Spanish (Basic)"],
    certifications: [
      {
        id: "cert-8",
        title: "Modern Japanese Language Teaching",
        issuer: "Tokyo Language Institute",
        date: "2021-06-18",
        credentialId: "TLI-MJLT-2021-1234",
      },
    ],
    coursesTaught: [
      {
        id: "6",
        title: "Anime & Manga Japanese",
        level: "Elementary",
        studentsCount: 987,
        rating: 4.4,
      },
    ],
    classroomsHosted: [
      {
        id: "6",
        title: "Otaku Japanese Club",
        studentsCount: 12,
        schedule: "Sun 6:00 PM JST",
        isActive: true,
      },
    ],
    account: {
      accountId: "acc-4",
      name: "Takeshi Morimoto",
      email: "takeshi.morimoto@example.com",
      role: "Partner",
      status: "Active",
      createdAt: "2023-05-15",
    },
  },
];

export const mockCourses: Course[] = [
  {
    courseId: "1",
    name: "Japanese for Beginners: Hiragana & Katakana",
    description:
      "Master the fundamentals of Japanese writing systems. Learn hiragana and katakana with interactive exercises, pronunciation guides, and cultural context.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=500&h=300&fit=crop",
    tuition: 49.99,
    evaluationPoint: 4.7,
    createdBy: "admin-1",
    isApproved: true,
    level: "Beginner",
    duration: 20,
    studentsCount: 1247,
    lessons: [
      {
        lessonId: "1-1",
        courseId: "1",
        title: "Introduction to Japanese Writing",
        order: 1,
        contentUrl: "/lessons/1-1",
        duration: 45,
      },
      {
        lessonId: "1-2",
        courseId: "1",
        title: "Hiragana: A-ka-sa-ta-na",
        order: 2,
        contentUrl: "/lessons/1-2",
        duration: 60,
      },
    ],
    outcomes: [
      {
        outcomeId: "1-o-1",
        courseId: "1",
        description: "Read and write all hiragana characters",
      },
      {
        outcomeId: "1-o-2",
        courseId: "1",
        description: "Read and write all katakana characters",
      },
    ],
    createdAt: "2024-01-15",
    updatedAt: "2024-02-01",
  },
  {
    courseId: "2",
    name: "Conversational Japanese: Daily Life",
    description:
      "Learn practical Japanese for everyday situations. Practice greetings, shopping, dining, and social interactions with native speakers.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&h=300&fit=crop",
    tuition: 79.99,
    evaluationPoint: 4.8,
    createdBy: "admin-1",
    isApproved: true,
    level: "Elementary",
    duration: 35,
    studentsCount: 892,
    lessons: [
      {
        lessonId: "2-1",
        courseId: "2",
        title: "Greetings and Introductions",
        order: 1,
        contentUrl: "/lessons/2-1",
        duration: 40,
      },
      {
        lessonId: "2-2",
        courseId: "2",
        title: "Shopping and Numbers",
        order: 2,
        contentUrl: "/lessons/2-2",
        duration: 50,
      },
    ],
    outcomes: [
      {
        outcomeId: "2-o-1",
        courseId: "2",
        description: "Engage in basic daily conversations",
      },
      {
        outcomeId: "2-o-2",
        courseId: "2",
        description: "Navigate shopping and dining situations",
      },
    ],
    createdAt: "2024-01-20",
    updatedAt: "2024-02-05",
  },
  {
    courseId: "3",
    name: "Business Japanese: Professional Communication",
    description:
      "Advanced course for professionals working with Japanese companies. Learn keigo (honorific language), business etiquette, and formal communication.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=500&h=300&fit=crop",
    tuition: 129.99,
    evaluationPoint: 4.9,
    createdBy: "admin-1",
    isApproved: true,
    level: "Advanced",
    duration: 50,
    studentsCount: 456,
    lessons: [
      {
        lessonId: "3-1",
        courseId: "3",
        title: "Keigo and Formal Language",
        order: 1,
        contentUrl: "/lessons/3-1",
        duration: 70,
      },
      {
        lessonId: "3-2",
        courseId: "3",
        title: "Business Meeting Etiquette",
        order: 2,
        contentUrl: "/lessons/3-2",
        duration: 60,
      },
    ],
    outcomes: [
      {
        outcomeId: "3-o-1",
        courseId: "3",
        description: "Use appropriate keigo in business settings",
      },
      {
        outcomeId: "3-o-2",
        courseId: "3",
        description: "Navigate Japanese business culture confidently",
      },
    ],
    createdAt: "2024-02-01",
    updatedAt: "2024-02-15",
  },
  {
    courseId: "4",
    name: "JLPT N5 Preparation Course",
    description:
      "Comprehensive preparation for the Japanese Language Proficiency Test N5 level. Includes grammar, vocabulary, reading, and listening practice.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop",
    tuition: 99.99,
    evaluationPoint: 4.6,
    createdBy: "admin-1",
    isApproved: true,
    level: "Beginner",
    duration: 40,
    studentsCount: 723,
    lessons: [],
    outcomes: [
      {
        outcomeId: "4-o-1",
        courseId: "4",
        description: "Pass JLPT N5 with confidence",
      },
    ],
    createdAt: "2024-01-25",
    updatedAt: "2024-02-10",
  },
  {
    courseId: "5",
    name: "Japanese Culture and Traditions",
    description:
      "Explore Japanese culture, traditions, and social customs. Learn about festivals, tea ceremony, art, and modern Japanese society.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&h=300&fit=crop",
    tuition: 69.99,
    evaluationPoint: 4.5,
    createdBy: "admin-1",
    isApproved: true,
    level: "Intermediate",
    duration: 30,
    studentsCount: 634,
    lessons: [],
    outcomes: [
      {
        outcomeId: "5-o-1",
        courseId: "5",
        description: "Understand Japanese cultural contexts",
      },
    ],
    createdAt: "2024-02-05",
    updatedAt: "2024-02-20",
  },
  {
    courseId: "6",
    name: "Anime & Manga Japanese",
    description:
      "Learn Japanese through popular anime and manga. Understand casual speech, slang, and cultural references in Japanese media.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
    tuition: 59.99,
    evaluationPoint: 4.4,
    createdBy: "admin-1",
    isApproved: true,
    level: "Elementary",
    duration: 25,
    studentsCount: 987,
    lessons: [],
    outcomes: [
      {
        outcomeId: "6-o-1",
        courseId: "6",
        description: "Understand anime and manga without subtitles",
      },
    ],
    createdAt: "2024-02-10",
    updatedAt: "2024-02-25",
  },
];

export const mockClassrooms: Classroom[] = [
  {
    classroomId: "1",
    partnerId: "1",
    title: "Morning Conversation Practice",
    description:
      "Join our morning conversation circle to practice speaking Japanese in a supportive environment. Perfect for beginners to intermediate learners.",
    videoCallLink: "https://meet.google.com/abc-def-ghi",
    maxStudents: 8,
    currentStudents: 5,
    schedule: "Mon, Wed, Fri 9:00 AM JST",
    thumbnail:
      "https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?w=400&h=300&fit=crop",
    partner: mockPartners[0],
    enrollments: [],
    createdAt: "2024-01-10",
    scheduleEntries: [
      {
        id: "se-1",
        classroomId: "1",
        start: "2024-03-20T09:00:00Z",
        end: "2024-03-20T10:00:00Z",
        joinUrl: "https://meet.google.com/abc-def-ghi",
        status: "upcoming",
        topic: "Greetings and Daily Expressions",
      },
      {
        id: "se-2",
        classroomId: "1",
        start: "2024-03-22T09:00:00Z",
        end: "2024-03-22T10:00:00Z",
        joinUrl: "https://meet.google.com/abc-def-ghi",
        status: "upcoming",
        topic: "Weather and Seasons",
      },
    ],
    feedPosts: [
      {
        id: "fp-1",
        classroomId: "1",
        authorName: "Yuki Tanaka",
        authorRole: "teacher",
        authorAvatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki Tanaka",
        content:
          "Welcome to our Morning Conversation Practice! Please introduce yourself in Japanese. Don't worry about making mistakes - that's how we learn! 🌸",
        attachments: [],
        createdAt: "2024-03-15T08:00:00Z",
        isAnnouncement: true,
      },
      {
        id: "fp-2",
        classroomId: "1",
        authorName: "Yuki Tanaka",
        authorRole: "teacher",
        content:
          "This week we'll focus on weather expressions. Please practice these phrases before our next session:",
        attachments: [
          {
            id: "att-1",
            name: "Weather_Expressions.pdf",
            url: "/attachments/weather-expressions.pdf",
            type: "pdf",
            size: 245760,
          },
        ],
        createdAt: "2024-03-18T10:30:00Z",
        isAssignment: true,
        dueDate: "2024-03-22T09:00:00Z",
      },
    ],
  },
  {
    classroomId: "2",
    partnerId: "2",
    title: "JLPT Study Group",
    description:
      "Intensive study sessions focused on JLPT preparation. We cover grammar, vocabulary, and practice tests together.",
    videoCallLink: "https://meet.google.com/jkl-mno-pqr",
    maxStudents: 10,
    currentStudents: 7,
    schedule: "Tue, Thu 7:00 PM JST",
    thumbnail:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
    partner: mockPartners[1],
    enrollments: [],
    createdAt: "2024-01-15",
    scheduleEntries: [
      {
        id: "se-3",
        classroomId: "2",
        start: "2024-03-21T19:00:00Z",
        end: "2024-03-21T21:00:00Z",
        joinUrl: "https://meet.google.com/jkl-mno-pqr",
        status: "upcoming",
        topic: "N3 Grammar Review",
      },
    ],
    feedPosts: [
      {
        id: "fp-3",
        classroomId: "2",
        authorName: "Hiroshi Sato",
        authorRole: "teacher",
        content:
          "Next Tuesday we'll have a mock N3 test. Please review chapters 1-5 in your textbook.",
        attachments: [],
        createdAt: "2024-03-16T15:00:00Z",
        isAnnouncement: true,
      },
    ],
  },
  {
    classroomId: "3",
    partnerId: "1",
    title: "Business Japanese Workshop",
    description:
      "Advanced workshop for professionals. Practice business presentations, meetings, and formal communication in Japanese.",
    videoCallLink: "https://meet.google.com/stu-vwx-yzd",
    maxStudents: 6,
    currentStudents: 4,
    schedule: "Sat 2:00 PM JST",
    thumbnail:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
    partner: mockPartners[0],
    enrollments: [],
    createdAt: "2024-01-20",
    scheduleEntries: [
      {
        id: "se-4",
        classroomId: "3",
        start: "2024-03-23T14:00:00Z",
        end: "2024-03-23T16:00:00Z",
        joinUrl: "https://meet.google.com/stu-vwx-yzd",
        status: "upcoming",
        topic: "Business Presentations",
      },
    ],
    feedPosts: [
      {
        id: "fp-4",
        classroomId: "3",
        authorName: "Yuki Tanaka",
        authorRole: "teacher",
        content:
          "Prepare a 5-minute business presentation for next Saturday. Topics can include company introduction, product presentation, or project proposal.",
        attachments: [
          {
            id: "att-2",
            name: "Presentation_Guidelines.pdf",
            url: "/attachments/presentation-guidelines.pdf",
            type: "pdf",
            size: 156432,
          },
        ],
        createdAt: "2024-03-17T12:00:00Z",
        isAssignment: true,
        dueDate: "2024-03-23T14:00:00Z",
      },
    ],
  },
  {
    classroomId: "4",
    partnerId: "2",
    title: "Anime Japanese Club",
    description:
      "Learn Japanese through popular anime and manga. Understand casual speech, slang, and cultural references.",
    videoCallLink: "https://meet.google.com/xyz-abc-123",
    maxStudents: 12,
    currentStudents: 9,
    schedule: "Sun 4:00 PM JST",
    thumbnail:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    partner: mockPartners[1],
    enrollments: [],
    createdAt: "2024-02-01",
    scheduleEntries: [
      {
        id: "se-5",
        classroomId: "4",
        start: "2024-03-24T16:00:00Z",
        end: "2024-03-24T17:30:00Z",
        joinUrl: "https://meet.google.com/xyz-abc-123",
        status: "upcoming",
        topic: "Demon Slayer Episode Analysis",
      },
    ],
    feedPosts: [
      {
        id: "fp-5",
        classroomId: "4",
        authorName: "Hiroshi Sato",
        authorRole: "teacher",
        content:
          "This week we're watching Demon Slayer Episode 19. Pay attention to Tanjiro's speech patterns and note any new vocabulary!",
        attachments: [],
        createdAt: "2024-03-19T10:00:00Z",
      },
    ],
  },
];

export const featuredCourses = mockCourses.slice(0, 3);
export const popularClassrooms = mockClassrooms.slice(0, 2);
