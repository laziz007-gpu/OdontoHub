import React, { useState, useEffect } from 'react';
import { StickyNote, Trash2, Calendar, User, Plus } from 'lucide-react';
import { toast } from '../Shared/Toast';

interface Note {
    id: number;
    text: string;
    date: string;
    createdBy: string;
}

interface NotesSectionProps {
    patientId: number;
}

const NotesSection: React.FC<NotesSectionProps> = ({ patientId }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const notesKey = `patient_notes_${patientId}`;

    // Load notes
    useEffect(() => {
        const savedNotes = localStorage.getItem(notesKey);
        if (savedNotes) {
            try {
                setNotes(JSON.parse(savedNotes));
            } catch (e) {
                console.error("Failed to parse notes", e);
            }
        }
    }, [patientId, notesKey]);

    const handleAddNote = () => {
        if (!newNote.trim()) return;

        const updatedNotes = [
            {
                id: Date.now(),
                text: newNote,
                date: new Date().toISOString(),
                createdBy: 'Врач'
            },
            ...notes
        ];

        setNotes(updatedNotes);
        localStorage.setItem(notesKey, JSON.stringify(updatedNotes));
        setNewNote('');
        setIsAdding(false);
        toast.success('Заметка добавлеna');
    };

    const handleDeleteNote = (id: number) => {
        const updatedNotes = notes.filter(n => n.id !== id);
        setNotes(updatedNotes);
        localStorage.setItem(notesKey, JSON.stringify(updatedNotes));
        toast.info('Заметка удалена');
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <StickyNote className="text-amber-500" />
                    Заметки пациента
                </h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all active:scale-95"
                >
                    <Plus size={18} />
                    Добавить заметку
                </button>
            </div>

            {isAdding && (
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 animate-in slide-in-from-top-2 duration-300">
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Введите важную информацию о пациенте..."
                        className="w-full h-32 bg-white rounded-xl p-4 text-gray-800 border-none focus:ring-2 focus:ring-amber-500/20 outline-none resize-none"
                    />
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="px-6 py-2 text-gray-500 font-bold hover:text-gray-700"
                        >
                            Отмена
                        </button>
                        <button
                            onClick={handleAddNote}
                            className="px-8 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all"
                        >
                            Сохранить
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <div key={note.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-amber-200 transition-colors group relative">
                            <button
                                onClick={() => handleDeleteNote(note.id)}
                                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                            
                            <p className="text-lg text-gray-800 font-medium leading-relaxed mb-4 pr-8">
                                {note.text}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 font-bold border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    {formatDate(note.date)}
                                </div>
                                <div className="flex items-center gap-2">
                                    <User size={14} />
                                    {note.createdBy}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <StickyNote size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-bold">Заметок пока нет</p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="mt-4 text-amber-500 font-black hover:underline"
                        >
                            Создать первую заметку
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesSection;
