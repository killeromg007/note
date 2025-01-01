async function loadNotes() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/admin/login';
        return;
    }

    try {
        const response = await fetch('/api/admin/notes', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login';
            return;
        }

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
                    <button class="delete-btn" onclick="deleteNote(${note.id})">Delete</button>
                </div>
            `;
            notesList.appendChild(noteElement);
        });
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return;

    const token = localStorage.getItem('adminToken');
    try {
        const response = await fetch(`/api/admin/notes/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
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

function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
}

document.addEventListener('DOMContentLoaded', loadNotes); 