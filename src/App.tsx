import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Moon, Sun, Book, PenLine, Download, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { MoodSelector } from '@/components/MoodSelector';
import { ReflectionCard } from '@/components/ReflectionCard';
import { HistoryView } from '@/components/HistoryView';
import type { JournalEntry, ReflectionResponse } from '@/types';
import html2canvas from 'html2canvas';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [view, setView] = useState<'write' | 'history'>('write');
  const [entryText, setEntryText] = useState('');
  const [moodHint, setMoodHint] = useState('');
  const [isReflecting, setIsReflecting] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<ReflectionResponse | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('journal_entries');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<JournalEntry | null>(null);

  const journalCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('journal_entries', JSON.stringify(entries));
  }, [entries]);

  const handleReflect = async () => {
    if (!entryText.trim()) return;

    setIsReflecting(true);
    setCurrentAnalysis(null);

    try {
      const response = await fetch('/api/gemini-journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry: entryText, mood_hint: moodHint }),
      });

      if (!response.ok) throw new Error('Failed to get reflection');

      const analysis: ReflectionResponse = await response.json();
      setCurrentAnalysis(analysis);

      const newEntry: JournalEntry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        content: entryText,
        mood_hint: moodHint,
        analysis,
      };

      setEntries([newEntry, ...entries]);
    } catch (error) {
      console.error('Reflection error:', error);
      // Handle error (maybe show toast)
      alert('Failed to get reflection. Please try again.');
    } finally {
      setIsReflecting(false);
    }
  };

  const handleExportTxt = () => {
    const content = selectedHistoryEntry
      ? `Date: ${new Date(selectedHistoryEntry.date).toLocaleString()}\nMood: ${selectedHistoryEntry.analysis?.mood}\n\nEntry:\n${selectedHistoryEntry.content}\n\nReflection:\n${selectedHistoryEntry.analysis?.reflection}`
      : `Date: ${new Date().toLocaleString()}\nMood: ${currentAnalysis?.mood}\n\nEntry:\n${entryText}\n\nReflection:\n${currentAnalysis?.reflection}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-entry-${format(new Date(), 'yyyy-MM-dd-HHmm')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPng = async () => {
    if (!journalCardRef.current) return;

    try {
      const canvas = await html2canvas(journalCardRef.current, {
        backgroundColor: darkMode ? '#2d2d2d' : '#f7f3e8',
        scale: 2,
      });

      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `journal-snapshot-${format(new Date(), 'yyyy-MM-dd-HHmm')}.png`;
      a.click();
    } catch (err) {
      console.error('Export PNG failed:', err);
    }
  };

  const startNewEntry = () => {
    setEntryText('');
    setMoodHint('');
    setCurrentAnalysis(null);
    setSelectedHistoryEntry(null);
    setView('write');
  };

  const viewEntry = (entry: JournalEntry) => {
    setSelectedHistoryEntry(entry);
    setView('write'); // Re-use write view layout for viewing
  };

  const isViewingHistoryEntry = !!selectedHistoryEntry;
  const displayAnalysis = isViewingHistoryEntry ? selectedHistoryEntry.analysis : currentAnalysis;
  const displayContent = isViewingHistoryEntry ? selectedHistoryEntry.content : entryText;

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 md:p-8 transition-colors duration-300">
      <header className="w-full max-w-4xl mb-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
        <div>
          <h1 className="text-5xl md:text-6xl text-ink-900 mb-2 tracking-tight font-serif">
            Moonlit Ledger
          </h1>
          <p className="text-ink-800/60 font-serif italic text-lg">
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)} title="Toggle Theme">
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-6">
          {/* Navigation Tabs */}
          <div className="flex gap-4 border-b border-parchment-300 pb-2">
            <button
              onClick={startNewEntry}
              className={`flex items-center gap-2 px-4 py-2 font-serif text-lg transition-colors ${view === 'write' && !isViewingHistoryEntry ? 'text-ink-900 font-bold border-b-2 border-ink-900' : 'text-ink-800/50 hover:text-ink-900'}`}
            >
              <PenLine className="w-4 h-4" /> Write
            </button>
            <button
              onClick={() => { setView('history'); setSelectedHistoryEntry(null); }}
              className={`flex items-center gap-2 px-4 py-2 font-serif text-lg transition-colors ${view === 'history' ? 'text-ink-900 font-bold border-b-2 border-ink-900' : 'text-ink-800/50 hover:text-ink-900'}`}
            >
              <Book className="w-4 h-4" /> History
            </button>
          </div>

          {view === 'write' ? (
            <div ref={journalCardRef} className="space-y-6 animate-in fade-in duration-500">
              <Card className="min-h-[400px] relative bg-[url('https://www.transparenttextures.com/patterns/paper.png')]">
                <CardContent className="p-6 md:p-8">
                  {isViewingHistoryEntry ? (
                    <div className="prose prose-lg font-serif text-ink-900 whitespace-pre-wrap leading-relaxed">
                      {displayContent}
                    </div>
                  ) : (
                    <>
                      <Textarea
                        value={entryText}
                        onChange={(e) => setEntryText(e.target.value)}
                        placeholder="What's on your mind today? Let it all flow..."
                        className="min-h-[300px] bg-transparent border-none focus:ring-0 text-xl leading-relaxed resize-none p-0 placeholder:italic"
                        disabled={isReflecting || !!currentAnalysis}
                      />
                      {!currentAnalysis && (
                        <div className="mt-6 pt-6 border-t border-parchment-300">
                          <label className="block text-sm font-sans text-ink-800/70 mb-3">How are you feeling? (Optional hint)</label>
                          <div className="flex flex-wrap gap-4 items-center justify-between">
                            <MoodSelector selectedMood={moodHint} onSelect={setMoodHint} />
                            <Button
                              onClick={handleReflect}
                              disabled={!entryText.trim() || isReflecting}
                              className="w-full sm:w-auto"
                            >
                              {isReflecting ? 'Reflecting...' : 'Reflect'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {(displayAnalysis || isViewingHistoryEntry) && (
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={handleExportTxt}>
                    <Download className="w-4 h-4 mr-2" /> Save as TXT
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportPng}>
                    <ImageIcon className="w-4 h-4 mr-2" /> Save Snapshot
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <HistoryView entries={entries} onSelectEntry={viewEntry} />
          )}
        </div>

        {/* Right Sidebar / Reflection Area */}
        <div className="space-y-6">
          {view === 'write' && (
            <>
              {isReflecting && (
                <Card className="animate-pulse p-8 flex flex-col items-center justify-center text-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-ink-900" />
                  <p className="font-serif text-lg italic text-ink-800">Consulting the stars...</p>
                </Card>
              )}

              {displayAnalysis && (
                <div className="animate-in slide-in-from-right duration-500">
                  <ReflectionCard analysis={displayAnalysis} />
                </div>
              )}

              {!isReflecting && !displayAnalysis && !isViewingHistoryEntry && (
                <Card className="bg-parchment-200/50 border-dashed border-2 border-parchment-300 p-6 text-center">
                  <p className="text-ink-800/60 font-serif italic">
                    Your reflection will appear here after you write your entry.
                  </p>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
