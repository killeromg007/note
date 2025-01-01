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
            const note = await response.json();
            document.getElementById('noteContent').value = '';
            loadNotes();
            
            // Show admin token in an alert
            alert(`Your note has been posted!\n\nAdmin Token: ${note.adminToken}\n\nSave this token if you want to edit or delete your note later.`);
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
                <h3>🔑 Admin Access</h3>
                <p>When posting a note, you'll receive an admin token. Save it if you want to:</p>
                <ul>
                    <li>Edit your note later</li>
                    <li>Delete your note</li>
                    <li>Access the admin panel</li>
                </ul>
            </div>

            <div class="tutorial-step">
                <h3>⚙️ Admin Features</h3>
                <p>With your admin token, you can:</p>
                <p>1. Go to /admin</p>
                <p>2. Enter your admin token</p>
                <p>3. Edit or delete your notes</p>
            </div>

            <div class="tutorial-step">
                <h3>💡 Tips</h3>
                <ul>
                    <li>Keep your admin token safe if you want to manage your note later</li>
                    <li>Each note has its own unique admin token</li>
                    <li>The site automatically refreshes to show new notes</li>
                </ul>
            </div>
        </div>
    `;
    document.body.appendChild(tutorial);
} 