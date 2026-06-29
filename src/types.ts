export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface LearnTopic {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

export interface ParticipantData {
  name: string;
  email: string;
  phone: string;
  profession: string;
  challenge: string;
  income?: string;
  registeredAt: string;
  registrationId: string;
}
