import { describe, it, expect } from 'vitest';

// Mocking the parsing logic to verify it works as expected
function parseGeminiResponse(text: string) {
    let jsonString = text.trim();
    if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\n/, '').replace(/\n```$/, '');
    }
    return JSON.parse(jsonString);
}

describe('JSON Parsing Logic', () => {
    it('should parse clean JSON', () => {
        const input = '{"mood": "Happy"}';
        expect(parseGeminiResponse(input)).toEqual({ mood: 'Happy' });
    });

    it('should parse JSON wrapped in markdown code blocks', () => {
        const input = '```json\n{"mood": "Sad"}\n```';
        expect(parseGeminiResponse(input)).toEqual({ mood: 'Sad' });
    });

    it('should parse JSON wrapped in generic code blocks', () => {
        const input = '```\n{"mood": "Neutral"}\n```';
        expect(parseGeminiResponse(input)).toEqual({ mood: 'Neutral' });
    });

    it('should throw on invalid JSON', () => {
        const input = 'Invalid JSON';
        expect(() => parseGeminiResponse(input)).toThrow();
    });
});
