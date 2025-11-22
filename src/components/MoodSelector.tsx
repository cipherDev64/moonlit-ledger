import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';

interface MoodSelectorProps {
    selectedMood?: string;
    onSelect: (mood: string) => void;
}

const MOODS = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😌', label: 'Calm' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😤', label: 'Frustrated' },
    { emoji: '✨', label: 'Inspired' },
];

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelect }) => {
    return (
        <div className="flex flex-wrap gap-3 justify-center">
            {MOODS.map((mood) => (
                <Button
                    key={mood.label}
                    type="button"
                    variant={selectedMood === mood.label ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => onSelect(mood.label)}
                    className={cn(
                        "rounded-full px-3 py-1 text-lg transition-all hover:scale-105",
                        selectedMood === mood.label ? "ring-2 ring-offset-2 ring-ink-900" : ""
                    )}
                    title={mood.label}
                >
                    <span className="mr-1">{mood.emoji}</span>
                    <span className="text-xs font-sans">{mood.label}</span>
                </Button>
            ))}
        </div>
    );
};
