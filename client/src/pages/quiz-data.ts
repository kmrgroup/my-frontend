// Define interfaces for better type safety
export interface Quiz {
  question: string;
  options: string[];
  answer: number;
}

export interface Content {
  title: string;
  text: string;
  quiz: Quiz;
}

export interface Module {
  id: number;
  title: string;
  icon: any;
  description: string;
  content: Content[];
}

// Learning Modules data with unique questions for each module
export const LEARNING_MODULES: Module[] = [
  {
    id: 1,
    title: "Blockchain Basics",
    icon: "Brain",
    description: "Learn the fundamentals of blockchain technology",
    content: [
      {
        title: "What is Blockchain?",
        text: "A blockchain is a distributed digital ledger that records transactions across a network of computers.",
        quiz: {
          question: "What is the main purpose of a blockchain?",
          options: ["Store photos", "Record transactions", "Send emails", "Play games"],
          answer: 1
        }
      },
    ]
  },
  {
    id: 2,
    title: "Mining Mechanics",
    icon: "Activity",
    description: "Master the technical aspects of mining",
    content: [
      {
        title: "Mining Basics",
        text: "Mining is the process of validating and adding new transactions to the blockchain.",
        quiz: {
          question: "What is the primary purpose of mining?",
          options: ["Earn rewards", "Validate transactions", "Store data", "Send messages"],
          answer: 1
        }
      },
    ]
  },
  {
    id: 3,
    title: "Network Operations",
    icon: "ChartNetwork",
    description: "Understand network dynamics and participation",
    content: [
      {
        title: "Network Fundamentals",
        text: "Understanding how nodes communicate and maintain the network.",
        quiz: {
          question: "What is a blockchain node?",
          options: ["Storage unit", "Network participant", "Mining tool", "Chat program"],
          answer: 1
        }
      },
    ]
  }
];