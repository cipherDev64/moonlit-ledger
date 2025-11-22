import React from 'react';
import type { JournalEntry } from '@/types';
import { Card, CardContent } from './ui/Card';
import { format } from 'date-fns';
import { Button } from './ui/Button';
import { ArrowRight } from 'lucide-react';

interface HistoryViewProps {
    entries: JournalEntry[];
    onSelectEntry: (entry: JournalEntry) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ entries, onSelectEntry }) => {
    if (entries.length === 0) {
        return (
            <div className="text-center py-12 text-ink-800/60 italic font-serif">
                No journal entries yet. Start writing to see your history here.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {entries.map((entry) => (
                <Card
                    key={entry.id}
                    className="cursor-pointer hover:bg-white/80 transition-colors group"
                    onClick={() => onSelectEntry(entry)}
                >
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl">{entry.analysis?.emoji || '📝'}</span>
                                <span className="font-serif font-bold text-lg">
                                    {format(new Date(entry.date), 'MMMM d, yyyy')}
                                </span>
                                <span className="text-xs text-ink-800/50 font-sans">
                                    {format(new Date(entry.date), 'h:mm a')}
                                </span>
                            </div>
                            <p className="text-sm text-ink-800/80 truncate font-serif">
                                {entry.analysis?.summary || entry.content.substring(0, 50) + '...'}
                            </p>
                        </div>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
