async function loadNotes() {
    try {
        const response = await fetch('/api/notes');
        const notes = await response.json();
        const notesList = document.getElementById('notesList');
        notesList.innerHTML = '';
        
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.innerHTML = `
                <div class="note-content">${note.content}</div>
                <div class="note-date">${new Date(note.createdAt).toLocaleString()}</div>
            `;
            notesList.appendChild(noteElement);
        });
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

async function submitNote() {
    const content = document.getElementById('noteContent').value;
    if (!content.trim()) return;

    try {
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            document.getElementById('noteContent').value = '';
            loadNotes();
        }
    } catch (error) {
        console.error('Error submitting note:', error);
    }
}

// Load notes when the page loads
document.addEventListener('DOMContentLoaded', loadNotes); 