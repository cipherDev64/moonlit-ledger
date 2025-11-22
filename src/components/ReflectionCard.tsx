import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import type { ReflectionResponse } from '@/types';
import { Lightbulb, Heart, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReflectionCardProps {
    analysis: ReflectionResponse;
    className?: string;
}

export const ReflectionCard: React.FC<ReflectionCardProps> = ({ analysis, className }) => {
    return (
        <Card className={cn("overflow-hidden border-l-4", className)} style={{ borderLeftColor: analysis.color_hint }}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <span>{analysis.emoji}</span>
                            <span>{analysis.mood}</span>
                        </CardTitle>
                        <p className="text-sm text-ink-800/70 mt-1 font-sans">Tone: {analysis.tone}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-parchment-200 px-2 py-1 rounded-full text-xs font-sans">
                        <Activity className="w-3 h-3" />
                        <span>Intensity: {analysis.intensity}/10</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-parchment-100/50 p-3 rounded-md italic text-ink-800 border border-parchment-200">
                    "{analysis.summary}"
                </div>

                <div className="prose prose-stone prose-sm max-w-none font-serif text-lg leading-relaxed">
                    <p>{analysis.reflection}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-white/40 p-3 rounded-md border border-parchment-200">
                        <div className="flex items-center gap-2 font-bold text-sm mb-1 text-ink-900">
                            <Lightbulb className="w-4 h-4 text-amber-600" />
                            Actionable Tip
                        </div>
                        <p className="text-sm">{analysis.actionable_tip}</p>
                    </div>

                    <div className="bg-white/40 p-3 rounded-md border border-parchment-200">
                        <div className="flex items-center gap-2 font-bold text-sm mb-1 text-ink-900">
                            <Heart className="w-4 h-4 text-rose-600" />
                            Gratitude Prompt
                        </div>
                        <p className="text-sm">{analysis.gratitude_prompt}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
