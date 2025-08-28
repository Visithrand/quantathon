export const exerciseData = {
  words: [
    {
      id: 1,
      title: "Basic Consonants",
      words: ["cat", "dog", "hat", "run", "jump"],
      difficulty: "beginner",
      description: "Practice clear pronunciation of basic consonant sounds",
      targetSounds: ["k", "d", "h", "r", "j"]
    },
    {
      id: 2,
      title: "Vowel Sounds",
      words: ["see", "boat", "tree", "moon", "rain"],
      difficulty: "beginner",
      description: "Focus on long vowel sounds and diphthongs",
      targetSounds: ["i:", "oʊ", "i:", "u:", "eɪ"]
    },
    {
      id: 3,
      title: "TH Sound Practice",
      words: ["think", "both", "three", "father", "mother"],
      difficulty: "intermediate",
      description: "Master the voiced and voiceless TH sounds",
      targetSounds: ["θ", "ð"]
    },
    {
      id: 4,
      title: "R Sound Mastery",
      words: ["red", "car", "sorry", "around", "through"],
      difficulty: "intermediate",
      description: "Practice the challenging R sound in different positions",
      targetSounds: ["r"]
    },
    {
      id: 5,
      title: "S and Z Sounds",
      words: ["sun", "house", "zoo", "buzz", "please"],
      difficulty: "intermediate",
      description: "Distinguish between S and Z sounds",
      targetSounds: ["s", "z"]
    },
    {
      id: 6,
      title: "L Sound Practice",
      words: ["love", "help", "yellow", "world", "people"],
      difficulty: "intermediate",
      description: "Practice the L sound in various word positions",
      targetSounds: ["l"]
    },
    {
      id: 7,
      title: "Complex Consonants",
      words: ["strength", "throughout", "breathe", "clothes", "months"],
      difficulty: "advanced",
      description: "Challenge yourself with complex consonant clusters",
      targetSounds: ["str", "θr", "br", "kl", "mθ"]
    },
    {
      id: 8,
      title: "Silent Letters",
      words: ["knight", "wrist", "honest", "debt", "island"],
      difficulty: "advanced",
      description: "Practice words with silent letters",
      targetSounds: ["n", "r", "h", "b", "l"]
    },
    {
      id: 9,
      title: "Stress Patterns",
      words: ["photograph", "photographer", "photographic", "democracy", "democratic"],
      difficulty: "advanced",
      description: "Focus on word stress and syllable emphasis",
      targetSounds: ["stress patterns"]
    },
    {
      id: 10,
      title: "Minimal Pairs",
      words: ["ship/sheep", "bit/beat", "cot/caught", "pull/pool", "bad/bed"],
      difficulty: "advanced",
      description: "Practice distinguishing similar sounds",
      targetSounds: ["ɪ/i:", "ɪ/i:", "ɑ/ɔ", "ʊ/u:", "æ/ɛ"]
    }
    
  ],

  sentences: [
    {
      id: 1,
      title: "Simple Statements",
      sentences: [
        "The cat is sleeping.",
        "I like to read books.",
        "She walks to school.",
        "We eat dinner together.",
        "They play in the park."
      ],
      difficulty: "beginner",
      description: "Practice basic sentence structure and rhythm"
    },
    {
      id: 2,
      title: "Question Forms",
      sentences: [
        "What is your name?",
        "Where do you live?",
        "How are you today?",
        "When does the movie start?",
        "Why did you choose that?"
      ],
      difficulty: "beginner",
      description: "Focus on question intonation and word stress"
    },
    {
      id: 3,
      title: "Past Tense",
      sentences: [
        "I visited the museum yesterday.",
        "She cooked dinner last night.",
        "They traveled to Europe.",
        "We watched a great movie.",
        "He finished his homework."
      ],
      difficulty: "intermediate",
      description: "Practice regular and irregular past tense verbs"
    },
    {
      id: 4,
      title: "Future Plans",
      sentences: [
        "I will graduate next year.",
        "She is going to visit Paris.",
        "They might come to the party.",
        "We should leave early.",
        "He could help you tomorrow."
      ],
      difficulty: "intermediate",
      description: "Work on future tense expressions and modal verbs"
    },
    {
      id: 5,
      title: "Conditional Sentences",
      sentences: [
        "If it rains, I will stay home.",
        "I would travel if I had money.",
        "She might come if you invite her.",
        "We could help if you ask nicely.",
        "They should study if they want to pass."
      ],
      difficulty: "intermediate",
      description: "Practice conditional sentence structure and intonation"
    },
    {
      id: 6,
      title: "Complex Sentences",
      sentences: [
        "Although it was raining, we went for a walk.",
        "The book that I read was very interesting.",
        "She studied hard so that she could pass the exam.",
        "While I was cooking, the phone rang.",
        "I'll call you as soon as I arrive."
      ],
      difficulty: "advanced",
      description: "Work on complex sentence structure and flow"
    },
    {
      id: 7,
      title: "Passive Voice",
      sentences: [
        "The letter was written by John.",
        "The house is being built by workers.",
        "The movie was directed by a famous filmmaker.",
        "The cake has been eaten by the children.",
        "The problem will be solved by the team."
      ],
      difficulty: "advanced",
      description: "Practice passive voice construction and emphasis"
    },
    {
      id: 8,
      title: "Reported Speech",
      sentences: [
        "She said that she was tired.",
        "He told me that he would come.",
        "They mentioned that the meeting was cancelled.",
        "I asked if she could help me.",
        "He wondered why you didn't call."
      ],
      difficulty: "advanced",
      description: "Work on reported speech patterns and tense changes"
    },
    {
      id: 9,
      title: "Emphatic Structures",
      sentences: [
        "It was John who called you.",
        "What I need is more time.",
        "Never have I seen such beauty.",
        "Not only did she sing, but she also danced.",
        "Only then did I understand the truth."
      ],
      difficulty: "advanced",
      description: "Practice emphatic sentence structures and stress"
    },
    {
      id: 10,
      title: "Academic Language",
      sentences: [
        "The research indicates that climate change is accelerating.",
        "Furthermore, the data suggests a correlation between variables.",
        "In conclusion, the findings support our hypothesis.",
        "The methodology employed in this study was rigorous.",
        "These results demonstrate the effectiveness of the intervention."
      ],
      difficulty: "advanced",
      description: "Practice formal academic language and complex structures"
    }
  ],

  conversations: [
    {
      id: 1,
      title: "At the Restaurant",
      scenario: "Ordering food at a restaurant",
      dialogue: [
        "Waiter: Good evening! Welcome to our restaurant.",
        "You: Thank you! I'd like to see the menu, please.",
        "Waiter: Here you are. Today's special is grilled salmon.",
        "You: That sounds delicious. I'll have the salmon with vegetables.",
        "Waiter: Excellent choice. Would you like something to drink?",
        "You: Yes, I'll have a glass of water, please."
      ],
      difficulty: "beginner",
      description: "Practice ordering food and basic restaurant interactions"
    },
    {
      id: 2,
      title: "At the Doctor's Office",
      scenario: "Medical consultation",
      dialogue: [
        "Doctor: Hello, what brings you here today?",
        "You: I've been having headaches for the past week.",
        "Doctor: I see. How severe are these headaches?",
        "You: They're moderate, usually in the morning.",
        "Doctor: Have you noticed any other symptoms?",
        "You: Yes, I've been feeling tired and dizzy."
      ],
      difficulty: "beginner",
      description: "Practice describing symptoms and medical vocabulary"
    },
    {
      id: 3,
      title: "Job Interview",
      scenario: "Professional job interview",
      dialogue: [
        "Interviewer: Tell me about your experience in this field.",
        "You: I have five years of experience in software development.",
        "Interviewer: What are your greatest strengths?",
        "You: I'm detail-oriented and work well in teams.",
        "Interviewer: Why do you want to work for our company?",
        "You: I'm impressed by your innovative approach and company culture."
      ],
      difficulty: "intermediate",
      description: "Practice professional language and interview skills"
    },
    {
      id: 4,
      title: "Travel Planning",
      scenario: "Planning a vacation",
      dialogue: [
        "Travel Agent: Where would you like to go on vacation?",
        "You: I'm thinking about visiting Japan in the spring.",
        "Travel Agent: Great choice! Cherry blossom season is beautiful.",
        "You: How long should I plan to stay?",
        "Travel Agent: I'd recommend at least two weeks.",
        "You: What about accommodation and transportation?"
      ],
      difficulty: "intermediate",
      description: "Practice travel vocabulary and planning conversations"
    },
    {
      id: 5,
      title: "Problem Solving",
      scenario: "Resolving a customer service issue",
      dialogue: [
        "Customer Service: How can I help you today?",
        "You: I received the wrong item in my order.",
        "Customer Service: I apologize for the inconvenience. What did you order?",
        "You: I ordered a blue sweater, but received a red one.",
        "Customer Service: I can arrange a replacement or refund.",
        "You: I'd prefer a replacement in the correct color."
      ],
      difficulty: "intermediate",
      description: "Practice problem-solving language and polite requests"
    },
    {
      id: 6,
      title: "Academic Discussion",
      scenario: "Classroom debate",
      dialogue: [
        "Professor: What are your thoughts on this topic?",
        "You: I believe technology has both positive and negative impacts.",
        "Student: Can you elaborate on the negative aspects?",
        "You: Well, it can lead to social isolation and privacy concerns.",
        "Professor: That's an interesting point. How do we address this?",
        "You: We need better regulations and digital literacy education."
      ],
      difficulty: "advanced",
      description: "Practice academic discussion and critical thinking"
    },
    {
      id: 7,
      title: "Business Negotiation",
      scenario: "Contract negotiation",
      dialogue: [
        "Client: We need the project completed by the end of the month.",
        "You: That's quite tight. What's your budget for this timeline?",
        "Client: We can increase the budget by 20% for faster delivery.",
        "You: That helps, but we'll need additional resources.",
        "Client: What specific resources do you need?",
        "You: Two more developers and extended working hours."
      ],
      difficulty: "advanced",
      description: "Practice business negotiation and professional language"
    },
    {
      id: 8,
      title: "Cultural Exchange",
      scenario: "Sharing cultural experiences",
      dialogue: [
        "Host: What traditions do you celebrate in your country?",
        "You: We have many festivals throughout the year.",
        "Host: Can you tell me about your favorite one?",
        "You: I love the spring festival with lanterns and fireworks.",
        "Host: That sounds beautiful! How do people celebrate?",
        "You: Families gather, share meals, and watch performances."
      ],
      difficulty: "intermediate",
      description: "Practice cultural vocabulary and descriptive language"
    },
    {
      id: 9,
      title: "Environmental Discussion",
      scenario: "Environmental awareness conversation",
      dialogue: [
        "Environmentalist: What environmental issues concern you most?",
        "You: I'm worried about plastic pollution and climate change.",
        "Environmentalist: What actions are you taking personally?",
        "You: I've reduced plastic use and started composting.",
        "Environmentalist: How can we encourage others to act?",
        "You: We should lead by example and share information."
      ],
      difficulty: "advanced",
      description: "Practice environmental vocabulary and persuasive language"
    },
    {
      id: 10,
      title: "Technology Debate",
      scenario: "Discussing technology's impact",
      dialogue: [
        "Moderator: Is social media good or bad for society?",
        "You: I think it has both benefits and drawbacks.",
        "Participant: What are the main benefits you see?",
        "You: It connects people globally and spreads information quickly.",
        "Moderator: And what about the negative aspects?",
        "You: It can spread misinformation and affect mental health."
      ],
      difficulty: "advanced",
      description: "Practice debate language and balanced arguments"
    }
  ],

  tongueTwisters: [
    {
      id: 1,
      title: "Peter Piper",
      text: "Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked. If Peter Piper picked a peck of pickled peppers, where's the peck of pickled peppers Peter Piper picked?",
      difficulty: "beginner",
      description: "Focus on the 'p' sound and rhythm",
      targetSounds: ["p"]
    },
    {
      id: 2,
      title: "She Sells Seashells",
      text: "She sells seashells by the seashore. The shells she sells are surely seashells. So if she sells shells on the seashore, I'm sure she sells seashore shells.",
      difficulty: "beginner",
      description: "Practice the 's' and 'sh' sounds",
      targetSounds: ["s", "ʃ"]
    },
    {
      id: 3,
      title: "How Much Wood",
      text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood? He would chuck, he would, as much as he could, and chuck as much wood as a woodchuck would if a woodchuck could chuck wood.",
      difficulty: "intermediate",
      description: "Work on the 'w' and 'ch' sounds",
      targetSounds: ["w", "tʃ"]
    },
    {
      id: 4,
      title: "Betty Botter",
      text: "Betty Botter bought some butter, but she said the butter's bitter. If I put it in my batter, it will make my batter bitter. But a bit of better butter will make my batter better.",
      difficulty: "intermediate",
      description: "Practice the 'b' sound and word stress",
      targetSounds: ["b"]
    },
    {
      id: 5,
      title: "Fuzzy Wuzzy",
      text: "Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair. Fuzzy Wuzzy wasn't very fuzzy, was he?",
      difficulty: "intermediate",
      description: "Focus on the 'z' sound and rhythm",
      targetSounds: ["z"]
    },
    {
      id: 6,
      title: "Six Slick Snakes",
      text: "Six slick slimy snakes sliding slowly southward. Six slick slimy snakes sliding slowly southward. Six slick slimy snakes sliding slowly southward.",
      difficulty: "intermediate",
      description: "Practice the 's' sound and alliteration",
      targetSounds: ["s"]
    },
    {
      id: 7,
      title: "The Sixth Sick Sheik",
      text: "The sixth sick sheik's sixth sheep's sick. The sixth sick sheik's sixth sheep's sick. The sixth sick sheik's sixth sheep's sick.",
      difficulty: "advanced",
      description: "Challenge yourself with the 'th' and 's' sounds",
      targetSounds: ["θ", "s"]
    },
    {
      id: 8,
      title: "Irish Wristwatch",
      text: "Irish wristwatch, Swiss wristwatch. Irish wristwatch, Swiss wristwatch. Irish wristwatch, Swiss wristwatch.",
      difficulty: "advanced",
      description: "Practice the 'r' and 'w' sounds",
      targetSounds: ["r", "w"]
    },
    {
      id: 9,
      title: "Unique New York",
      text: "You know New York, you need New York, you know you need unique New York. You know New York, you need New York, you know you need unique New York.",
      difficulty: "advanced",
      description: "Work on the 'y' and 'n' sounds",
      targetSounds: ["j", "n"]
    },
    {
      id: 10,
      title: "Red Leather, Yellow Leather",
      text: "Red leather, yellow leather. Red leather, yellow leather. Red leather, yellow leather. Red leather, yellow leather.",
      difficulty: "advanced",
      description: "Practice the 'r' and 'l' sounds in combination",
      targetSounds: ["r", "l"]
    }
  ]
};

export const getExerciseById = (type, id) => {
  return exerciseData[type]?.find(exercise => exercise.id === id);
};

export const getExercisesByType = (type) => {
  return exerciseData[type] || [];
};

export const getExercisesByDifficulty = (type, difficulty) => {
  return exerciseData[type]?.filter(exercise => exercise.difficulty === difficulty) || [];
};
