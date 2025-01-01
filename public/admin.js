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
                <div class="note-content-wrapper">
                    <div class="note-content">${note.content}</div>
                    <div class="note-date">${new Date(note.createdAt).toLocaleString()}</div>
                </div>
                <div class="note-actions">
                    <button class="edit-btn" onclick="editNote('${note.id}', this)">Edit</button>
                    <button class="delete-btn" onclick="deleteNote('${note.id}')">Delete</button>
                </div>
            `;
            notesList.appendChild(noteElement);
        });
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

async function editNote(id, button) {
    const noteElement = button.closest('.note');
    const contentDiv = noteElement.querySelector('.note-content');
    const content = contentDiv.textContent;

    noteElement.classList.add('edit-mode');
    contentDiv.innerHTML = `
        <textarea>${content}</textarea>
        <button class="save-btn" onclick="saveNote('${id}', this)">Save</button>
    `;
}

async function saveNote(id, button) {
    const noteElement = button.closest('.note');
    const textarea = noteElement.querySelector('textarea');
    const content = textarea.value;

    try {
        const response = await fetch(`/api/notes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-Token': localStorage.getItem('adminToken')
            },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            loadNotes();
        } else {
            alert('Failed to update note');
        }
    } catch (error) {
        console.error('Error updating note:', error);
    }
}

async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
        const response = await fetch(`/api/notes/${id}`, {
            method: 'DELETE',
            headers: {
                'X-Admin-Token': localStorage.getItem('adminToken')
            }
        });

        if (response.ok) {
            loadNotes();
        } else {
            alert('Failed to delete note');
        }
    } catch (error) {
        console.error('Error deleting note:', error);
    }
}

// Load notes when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const adminToken = prompt('Please enter admin token:');
    if (adminToken) {
        localStorage.setItem('adminToken', adminToken);
        loadNotes();
    } else {
        window.location.href = '/';
    }
}); 