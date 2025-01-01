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

function showTutorial() {
    const tutorial = document.createElement('div');
    tutorial.className = 'tutorial-overlay';
    tutorial.innerHTML = `
        <div class="tutorial-content">
            <button class="close-tutorial" onclick="this.closest('.tutorial-overlay').remove()">&times;</button>
            <h2>Welcome to WebNotes!</h2>
            
            <div class="tutorial-step">
                <h3>📝 Creating a Note</h3>
                <p>1. Type your message in the text box</p>
                <p>2. Click "Post Note" to share it</p>
                <p>3. Your note will appear at the top of the list</p>
            </div>

            <div class="tutorial-step">
                <h3>👀 Viewing Notes</h3>
                <p>- All notes are public and visible to everyone</p>
                <p>- Notes are shown in chronological order (newest first)</p>
                <p>- Each note shows its content and posting time</p>
            </div>

            <div class="tutorial-step">
                <h3>🔑 Tips</h3>
                <ul>
                    <li>Keep messages respectful and appropriate</li>
                    <li>The site automatically refreshes to show new notes</li>
                    <li>Everyone can see what you write!</li>
                </ul>
            </div>
        </div>
    `;
    document.body.appendChild(tutorial);
} 