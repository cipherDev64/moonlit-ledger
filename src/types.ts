export interface JournalEntry {
    id: string;
    date: string; // ISO string
    content: string;
    mood_hint?: string;
    analysis?: ReflectionResponse;
}

export interface ReflectionResponse {
    mood: string;
    intensity: number;
    emoji: string;
    color_hint: string;
    summary: string;
    reflection: string;
    actionable_tip: string;
    gratitude_prompt: string;
    tone: string;
}

export interface ApiError {
    error: string;
    raw_response?: string;
}
