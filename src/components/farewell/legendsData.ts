import { Star, Laugh, BookOpen, Music, Award, Coffee } from "lucide-react";

export type BadgeType = "Topper" | "Class Clown" | "Artist" | "Musician" | "MVP" | "Chai Lover";

export const badgeConfig: Record<BadgeType, { icon: typeof Star; color: string }> = {
  Topper: { icon: Award, color: "bg-warning text-warning-foreground" },
  "Class Clown": { icon: Laugh, color: "bg-primary text-primary-foreground" },
  Artist: { icon: BookOpen, color: "bg-success text-success-foreground" },
  Musician: { icon: Music, color: "bg-accent text-accent-foreground" },
  MVP: { icon: Star, color: "bg-primary text-primary-foreground" },
  "Chai Lover": { icon: Coffee, color: "bg-warning text-warning-foreground" },
};

export interface Legend {
  id: number;
  name: string;
  thenPhoto: string;
  nowPhoto: string;
  thenCaption: string;
  nowCaption: string;
  description: string;
  notes?: string[];
  badge?: BadgeType;
}

const firstNames = [
  "SARANYA", "HEMA SUNDHAR", "SURENDRA", "ANSHIKA", "DEEPIKA", "VENKATESH", "ADITYA", "SAHITHYA",
  "MAHESHWAR", "MANIKANTA", "RAJASEKHAR", "SUSHMA", "HEMANTH", "HIMA SRI", "MOHAN RAO", "UDAY KIRAN",
  "GOVARDHAN", "SANDEEP", "NIRMAL", "VANDHANA", "SANDEEP", "AMRUTHA VARSHINI", "JYOSTHSNA ADITYA", "YAMINI",
  "HARIN", "MOHAN", "PAVAN", "KARTHIK", "ROHITH", "MADHU", "SRI CHARAN", "AKSHAYA",
  "NANDINI","CHAITANYA", "SAI SANDEEP", "AKSHAYA", "ABHISHEK", "NITEEESH", "PRASANNA", "MANASA", "DILLESWAR",
  "JAI SAI RAM", "NITHIN", "RESHMA", "ANISH", "DILEEP", "JAGADISH", "MANOHAR", "SAI PRAKASH",
  "BHASKAR RAO", "VIGNAN", "VAMSI", "SANDEEP", "BHAVANI", "GOWTHAM", "HARISH DEVI PRASAD", "HIMA VARSHINI",
  "RAJ KUMAR", "NAVYA", "SHANTHI", "MOURYA SRIKAR", "NITHIN", "LAVANYA", "DEVIKA", "TEJASH",
  "MAHA LASKHMI", "JAGADEESH PRASHANTH", "RAVI SRNIVASU", "DILEEP", "JHANSI", "HEMA AJAY KUMAR", "Sameer"
];

/*const lastNames = [
  "AKULA", "AMARAPINNI", "AMBALLA", "Desai", "Mehta", "Iyer", "Patel", "Joshi",
  "Gupta", "Reddy", "Singh", "Rao", "Verma", "Chatterjee", "Das", "Pillai",
  "Mishra", "Banerjee", "Tiwari", "Saxena", "Agarwal", "Kapoor", "Shah", "Roy",
  "Bose", "Sinha", "Chauhan", "Jain", "Yadav", "Malik", "Thakur", "Pandey",
  "Chawla", "Arora", "Khatri", "Nanda", "Rathore", "Sethi", "Bhat", "Kulkarni",
  "Dubey", "Dutta", "Lal", "Hegde", "Menon", "Naik", "Rastogi", "Pawar",
  "Goswami", "Bhatt", "Mahajan", "Kaur", "Dhawan", "Bajaj", "Soni", "Trivedi",
  "Khanna", "Chopra", "Gill", "Grover", "Mukherjee", "Deshpande", "Mistry", "Shetty",
  "Rangan", "Khurana", "Luthra", "Kohli", "Prasad", "Mirza", "Kapadia"
];*/

const descriptions = [
  "The class topper who secretly watched anime during lectures 🎌",
  "Organized every fest and still topped the exams — legend 👑",
  "Bunked 60% of classes, attended 100% of canteen sessions 🍕",
  "Her notes circulated more than the professors' materials 📚",
  "Turned every gathering into an impromptu concert 🎸",
  "Asked questions that even the professors had to Google 🧠",
  "If there was a chai break, they organized it ☕",
  "Her doodles were better than most presentations 🎨",
  "Always had the best memes for every situation 😂",
  "Could fix any bug at 3 AM before the deadline 💻",
  "The unofficial photographer of every college event 📷",
  "Never seen without headphones — living in their own world 🎧",
  "The group project hero who did all the work 🦸",
  "Could sleep through any lecture and still pass 😴",
  "Always had snacks in their bag — the real MVP 🍿",
  "The one who made friends with every professor 🤝",
  "Their presentations were always a TED Talk experience 🎤",
  "Could debate on any topic, anytime, anywhere 🗣️",
  "The fitness enthusiast who ran marathons between classes 🏃",
  "Always late but never missed a deadline ⏰",
];

const thenCaptions = [
  "Lost on campus, carrying 5 textbooks",
  "Shy in the last bench",
  "Asked 'is attendance mandatory?'",
  "Notes queen with color-coded highlighters",
  "Guitar in one hand, coffee in the other",
  "First one in the library every morning",
  "The chai-break coordinator",
  "Always drawing in the margins",
  "Fresh-faced and full of dreams",
  "Didn't know where the canteen was",
  "Wore the college ID like a medal",
  "Carried a backpack bigger than themselves",
  "Thought 8 AM classes were normal",
  "Had a different pen for every subject",
  "Still figuring out the campus map",
];

const nowCaptions = [
  "Placed at Google, carries a MacBook and confidence",
  "President of the cultural committee",
  "Startup founder with 3 ventures",
  "Data scientist who still uses color-coded everything",
  "Software engineer by day, musician by night",
  "Pursuing PhD at MIT — no surprises there",
  "Product manager who still coordinates breaks",
  "UX designer at a top design studio",
  "Ready to take on the world",
  "Knows every shortcut on campus and in life",
  "The go-to person for career advice",
  "Has an internship story for every occasion",
  "Can present anything to anyone with confidence",
  "Built 3 apps and counting",
  "The one everyone will remember",
];

const badges: (BadgeType | undefined)[] = [
  "Topper", "MVP", "Class Clown", "Artist", "Musician", "Topper", "Chai Lover", "Artist",
  undefined, undefined, "MVP", undefined, "Topper", "Class Clown", undefined,
  undefined, "Musician", undefined, undefined, "Chai Lover",
];

const noteBank = [
  "Never missed a deadline",
  "Their notes saved the entire batch",
  "Her laugh could be heard across the corridor",
  "Always had a business idea during lectures",
  "The canteen staff knew their order by heart",
  "Had a different pen for every subject",
  "Played at every farewell since 2023",
  "Once corrected a textbook error",
  "Their study group was legendary",
  "Knew every tea stall in a 5km radius",
];

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

// Local legend photos – replace each PNG in src/assets/legends/ with the real photo
const legendPhotos = Object.fromEntries(
  Object.entries(
    import.meta.glob("../../assets/legends/*.png", { eager: true, query: "?url", import: "default" })
  ).map(([path, url]) => {
    const num = parseInt(path.split("/").pop()!.split("-")[0]);
    return [num, url as string];
  })
);

export const legends: Legend[] = Array.from({ length: 71 }, (_, i) => {
  const id = i + 1;
  const photo = legendPhotos[id] ?? `https://i.pravatar.cc/400?img=${((i * 3) % 70) + 1}`;
  const avatarThen = photo;
  const avatarNow = photo;
  const hasNotes = seededRandom(id * 13) > 0.5;
  const noteIndex1 = Math.floor(seededRandom(id * 19) * noteBank.length);
  const noteIndex2 = Math.floor(seededRandom(id * 23) * noteBank.length);

  return {
    id,
    name: `${firstNames[i]} `,
    thenPhoto: avatarThen,
    nowPhoto: avatarNow,
    thenCaption: thenCaptions[i % thenCaptions.length],
    nowCaption: nowCaptions[i % nowCaptions.length],
    description: descriptions[i % descriptions.length],
    notes: hasNotes ? [noteBank[noteIndex1], noteBank[noteIndex2 !== noteIndex1 ? noteIndex2 : (noteIndex2 + 1) % noteBank.length]] : undefined,
    badge: badges[i % badges.length],
  };
});

export const STUDENTS_PER_WALL = 15;
export const TOTAL_WALLS = Math.ceil(legends.length / STUDENTS_PER_WALL);

export function getCardTransform(id: number) {
  const rotation = (seededRandom(id) - 0.5) * 12;
  const yOffset = (seededRandom(id * 7) - 0.5) * 20;
  return { rotation, yOffset };
}
