import { db } from "./db";
import { topics, recommendations } from "@shared/schema";
import type { InsertTopic, InsertRecommendation, TopicContent } from "@shared/schema";

const sampleTopics: InsertTopic[] = [
  {
    title: "Post-Surgery Cough",
    description: "Understanding when a cough after surgery is normal vs concerning",
    content: {
      introduction: "It's common to have questions about symptoms after surgery. Let's help you understand when a cough is normal and when to reach out for support.",
      normal: {
        title: "Normal Recovery Signs",
        items: [
          "Mild, dry cough that's getting better day by day",
          "Cough that improves when you take deep breaths or move around",
          "Clear or white mucus (if any)"
        ],
        advice: "Keep doing your breathing exercises and moving as instructed."
      },
      monitor: {
        title: "Watch and Monitor",
        items: [
          "Cough that's not improving after 3-5 days",
          "Yellow or green mucus",
          "Mild chest discomfort when coughing"
        ],
        advice: "Call your care team if these symptoms persist or worsen."
      },
      urgent: {
        title: "Contact Your Provider Now",
        items: [
          "Cough with blood or pink-tinged mucus",
          "Severe chest pain with coughing",
          "Difficulty breathing or shortness of breath",
          "Fever over 101°F (38.3°C)"
        ],
        advice: "Don't wait - call your provider's office or urgent care line now."
      }
    } as TopicContent,
    category: "post-surgery",
    priority: "medium",
    roles: ["patient", "caregiver"],
    tags: ["cough", "surgery", "recovery", "breathing"],
  },
  {
    title: "Medication Timing Guidelines",
    description: "How to properly time your medications for best results",
    content: {
      introduction: "Taking medications at the right time is crucial for your recovery and overall health.",
      normal: {
        title: "Safe Medication Practices",
        items: [
          "Take medications at the same time each day",
          "Follow the prescribed dosage exactly",
          "Keep a medication log or use a pill organizer"
        ],
        advice: "Consistency is key to medication effectiveness."
      },
      monitor: {
        title: "Watch for Side Effects",
        items: [
          "Mild nausea or stomach upset",
          "Drowsiness or fatigue",
          "Changes in appetite"
        ],
        advice: "These are often temporary but mention them at your next appointment."
      },
      urgent: {
        title: "Stop and Call Provider",
        items: [
          "Severe allergic reactions (rash, swelling, difficulty breathing)",
          "Severe nausea or vomiting",
          "Unusual bleeding or bruising",
          "Chest pain or irregular heartbeat"
        ],
        advice: "Stop the medication immediately and contact your healthcare provider."
      }
    } as TopicContent,
    category: "medications",
    priority: "high",
    roles: ["patient", "caregiver"],
    tags: ["medications", "timing", "side effects", "safety"],
  },
  {
    title: "Wound Care Basics",
    description: "Essential steps for proper wound and incision care",
    content: {
      introduction: "Proper wound care is essential for healing and preventing infection.",
      normal: {
        title: "Healthy Healing Signs",
        items: [
          "Mild swelling that decreases over time",
          "Light pink or red color around the wound",
          "Minimal clear or slightly yellow drainage"
        ],
        advice: "Keep the wound clean and dry as instructed."
      },
      monitor: {
        title: "Signs to Watch",
        items: [
          "Increased swelling after the first few days",
          "Wound edges pulling apart slightly",
          "Increased drainage or change in color"
        ],
        advice: "Document changes and contact your provider if concerned."
      },
      urgent: {
        title: "Immediate Medical Attention",
        items: [
          "Red streaks leading away from the wound",
          "Foul-smelling discharge",
          "Wound edges separating significantly",
          "Fever with wound changes"
        ],
        advice: "These could be signs of infection - seek immediate care."
      }
    } as TopicContent,
    category: "comfort-care",
    priority: "high",
    roles: ["patient", "caregiver"],
    tags: ["wound care", "infection", "healing", "incision"],
  },
  {
    title: "Managing Pain After Surgery",
    description: "Safe and effective ways to manage post-operative pain",
    content: {
      introduction: "Pain after surgery is normal, but it's important to manage it properly for your comfort and healing.",
      normal: {
        title: "Expected Pain Levels",
        items: [
          "Mild to moderate pain that gradually decreases each day",
          "Pain that's manageable with prescribed medications",
          "Discomfort that improves with rest and ice"
        ],
        advice: "Continue taking medications as prescribed and use non-medication comfort measures."
      },
      monitor: {
        title: "Pain That Needs Attention", 
        items: [
          "Pain that's not improving after 3-4 days",
          "Pain that interferes with sleep or basic activities",
          "Need for more medication than prescribed"
        ],
        advice: "Contact your provider to discuss pain management options."
      },
      urgent: {
        title: "Severe Pain - Call Now",
        items: [
          "Sudden, severe pain that's much worse than before",
          "Pain with signs of infection (fever, redness, swelling)",
          "Severe pain with nausea and vomiting",
          "Pain that doesn't respond to prescribed medication"
        ],
        advice: "This could indicate complications - contact your provider immediately."
      }
    } as TopicContent,
    category: "post-surgery",
    priority: "high",
    roles: ["patient", "caregiver"],
    tags: ["pain", "surgery", "recovery", "medication"],
  },
  {
    title: "When to Call Your Doctor",
    description: "Clear signs that require immediate medical attention",
    content: {
      introduction: "Knowing when to reach out for help can prevent complications and give you peace of mind.",
      normal: {
        title: "Questions That Can Wait",
        items: [
          "General questions about recovery timeline",
          "Minor medication side effects",
          "Scheduling follow-up appointments"
        ],
        advice: "These can be addressed at your next appointment or during business hours."
      },
      monitor: {
        title: "Call During Business Hours",
        items: [
          "Persistent nausea or vomiting",
          "Increased swelling that doesn't improve",
          "Concerning changes in wound appearance"
        ],
        advice: "These warrant a call to your provider's office within 24 hours."
      },
      urgent: {
        title: "Call Immediately or Go to ER",
        items: [
          "Difficulty breathing or chest pain",
          "Signs of infection: fever over 101°F, red streaks, foul odor",
          "Severe bleeding that won't stop",
          "Sudden severe pain or neurological symptoms"
        ],
        advice: "Don't wait - these symptoms require immediate medical attention."
      }
    } as TopicContent,
    category: "emergency",
    priority: "high", 
    roles: ["patient", "caregiver", "supporter"],
    tags: ["emergency", "symptoms", "urgent", "when to call"],
  },
  {
    title: "Supporting a Veteran in Crisis",
    description: "How to recognize and respond to mental health emergencies",
    content: {
      introduction: "As a supporter, you play a crucial role in recognizing crisis signs and knowing how to help.",
      normal: {
        title: "Ongoing Support",
        items: [
          "Regular check-ins and active listening",
          "Encouraging engagement in positive activities",
          "Helping maintain connections with family and friends"
        ],
        advice: "Consistent support helps prevent crisis situations from developing."
      },
      monitor: {
        title: "Warning Signs to Watch",
        items: [
          "Increasing isolation from others",
          "Expressing hopelessness or feeling like a burden",
          "Sudden mood changes or giving away possessions",
          "Talking about not wanting to be here"
        ],
        advice: "Take these signs seriously and don't leave the person alone."
      },
      urgent: {
        title: "Crisis - Act Now",
        items: [
          "Direct statements about suicide or self-harm",
          "Accessing means of harm (weapons, pills)",
          "Severe agitation, panic, or expressing intent to hurt themselves",
          "Saying goodbye or making final arrangements"
        ],
        advice: "Call 988 (Suicide & Crisis Lifeline) immediately or take them to emergency room."
      }
    } as TopicContent,
    category: "mental-health",
    priority: "high",
    roles: ["supporter", "caregiver"],
    tags: ["crisis", "suicide prevention", "mental health", "veteran support"],
  },
  {
    title: "Medication Side Effects",
    description: "Understanding and managing medication side effects safely",
    content: {
      introduction: "Side effects are common but knowing which ones are concerning helps you stay safe.",
      normal: {
        title: "Common, Manageable Side Effects",
        items: [
          "Mild nausea that improves with food",
          "Temporary drowsiness when starting new medication",
          "Minor digestive changes"
        ],
        advice: "These often improve as your body adjusts to the medication."
      },
      monitor: {
        title: "Side Effects to Track",
        items: [
          "Persistent dizziness or lightheadedness",
          "Changes in mood or sleep patterns",
          "Ongoing stomach upset or loss of appetite"
        ],
        advice: "Keep a log and discuss these with your provider at your next visit."
      },
      urgent: {
        title: "Stop Medication - Call Provider",
        items: [
          "Allergic reactions: rash, swelling, difficulty breathing",
          "Severe mental health changes: depression, suicidal thoughts",
          "Severe physical symptoms: chest pain, severe bleeding",
          "Signs of overdose or dangerous interactions"
        ],
        advice: "Stop the medication immediately and contact your healthcare provider or emergency services."
      }
    } as TopicContent,
    category: "medications",
    priority: "high",
    roles: ["patient", "caregiver"],
    tags: ["side effects", "medications", "safety", "allergic reactions"],
  }
];

const sampleRecommendations: InsertRecommendation[] = [
  {
    role: "patient",
    topicId: 1,
    reason: "Based on common post-surgery questions",
    priority: 1
  },
  {
    role: "patient", 
    topicId: 2,
    reason: "Essential for medication safety",
    priority: 2
  },
  {
    role: "caregiver",
    topicId: 3,
    reason: "Important for supporting wound healing",
    priority: 1
  },
  {
    role: "caregiver",
    topicId: 1,
    reason: "Help recognize concerning symptoms",
    priority: 2
  },
  {
    role: "supporter",
    topicId: 6,
    reason: "Critical for veteran crisis support",
    priority: 1
  },
  {
    role: "supporter",
    topicId: 5,
    reason: "Understanding when to get emergency help",
    priority: 2
  }
];

export async function seedDatabase() {
  try {
    console.log('Seeding database...');
    
    // Clear existing data
    await db.delete(recommendations);
    await db.delete(topics);
    
    // Insert topics
    const insertedTopics = await db.insert(topics).values(sampleTopics).returning();
    console.log(`Inserted ${insertedTopics.length} topics`);
    
    // Insert recommendations with correct topic IDs
    const adjustedRecommendations = sampleRecommendations.map(rec => ({
      ...rec,
      topicId: insertedTopics[rec.topicId! - 1]?.id || null
    }));
    
    const insertedRecommendations = await db.insert(recommendations).values(adjustedRecommendations).returning();
    console.log(`Inserted ${insertedRecommendations.length} recommendations`);
    
    console.log('Database seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}