import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Clipboard, Share2, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";

const Notes = () => {
  const { currentUser, notes, createNote, updateNoteContent, renameNote, deleteNote } = useAppContext();
  const location = useLocation();
  const [selectedNoteId, setSelectedNoteId] = useState<string>("");
  const [draftTitle, setDraftTitle] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy link");

  const sharedToken = useMemo(() => new URLSearchParams(location.search).get("share"), [location.search]);
  const sharedNote = useMemo(
    () => notes.find((note) => sharedToken && note.shareToken === sharedToken),
    [notes, sharedToken],
  );

  useEffect(() => {
    if (!selectedNoteId && notes.length > 0) {
      setSelectedNoteId(notes[0].id);
    }
  }, [notes, selectedNoteId]);

  useEffect(() => {
    if (sharedNote) {
      setSelectedNoteId(sharedNote.id);
    }
  }, [sharedNote]);

  const activeNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) ?? sharedNote,
    [notes, selectedNoteId, sharedNote],
  );

  useEffect(() => {
    setDraftTitle(activeNote?.title ?? "");
  }, [activeNote]);

  const handleNewNote = () => {
    createNote("Untitled Note");
  };

  const handleCopyLink = async () => {
    if (!activeNote) return;
    const url = `${window.location.origin}/notes?share=${activeNote.shareToken}`;
    await navigator.clipboard.writeText(url);
    setCopyStatus("Copied!");
    window.setTimeout(() => setCopyStatus("Copy link"), 2000);
  };

  const canEdit = activeNote?.shareMode === "edit";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">CollabNotes</h1>
              <p className="text-muted-foreground">Create shared notes, invite collaborators, and keep every idea in one place.</p>
            </div>
            <Button onClick={handleNewNote} className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" /> New Note
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <Card className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Your Notes</h2>
                  <p className="text-sm text-muted-foreground">Select a note to begin editing.</p>
                </div>
                <Badge variant="secondary">{notes.length} total</Badge>
              </div>

              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className={`rounded-xl border p-4 transition-all duration-200 ${note.id === selectedNoteId ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/70 cursor-pointer"}`}
                    onClick={() => setSelectedNoteId(note.id)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-foreground">{note.title}</h3>
                        <p className="text-xs text-muted-foreground">Updated {new Date(note.updatedAt).toLocaleString()}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="space-y-6 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{activeNote?.title || "No note selected"}</h2>
                  <p className="text-sm text-muted-foreground">{activeNote ? "Live note editing with shared links" : "Create a note to get started"}</p>
                </div>
                {activeNote ? (
                  <Badge variant={canEdit ? "secondary" : "outline"}>{activeNote.shareMode === "edit" ? "Edit" : "View only"}</Badge>
                ) : null}
              </div>

              {activeNote ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-[1fr_150px]">
                    <div>
                      <Label htmlFor="note-title" className="mb-2 block text-sm font-medium text-foreground">Title</Label>
                      <Input
                        id="note-title"
                        value={draftTitle}
                        onChange={(event) => setDraftTitle(event.target.value)}
                        onBlur={() => { if (activeNote && draftTitle.trim() !== activeNote.title) renameNote(activeNote.id, draftTitle.trim()); }}
                        disabled={!canEdit}
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button variant="outline" onClick={handleCopyLink}>
                        <Clipboard className="mr-2 h-4 w-4" />
                        {copyStatus}
                      </Button>
                      <Button variant="secondary" onClick={() => window.open(`${window.location.origin}/notes?share=${activeNote.shareToken}`, "_blank")}> 
                        <Share2 className="mr-2 h-4 w-4" />
                        Open
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="note-content" className="mb-2 block text-sm font-medium text-foreground">Content</Label>
                    <Textarea
                      id="note-content"
                      className="min-h-[360px]"
                      value={activeNote.content}
                      onChange={(event) => updateNoteContent(activeNote.id, event.target.value)}
                      disabled={!canEdit}
                      placeholder={canEdit ? "Start typing your note here..." : "This shared note is view-only."}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>Owner: {currentUser?.username ?? "Guest"}</span>
                    <span>Mode: {activeNote.shareMode}</span>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
                  Select a note from the list or create a new shared note.
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
