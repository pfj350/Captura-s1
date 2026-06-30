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
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_id?: string;
  fbclid?: string;
  gclid?: string;
}
