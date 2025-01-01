let currentEditId = null;

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
        const tableBody = document.getElementById('notesTableBody');
        tableBody.innerHTML = '';
        
        notes.forEach(note => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${note.id}</td>
                <td class="content-cell">${note.content}</td>
                <td>${new Date(note.createdAt).toLocaleString()}</td>
                <td class="action-cell">
                    <button class="edit-btn" onclick="openEditModal(${note.id}, \`${note.content.replace(/`/g, '\\`')}\`)">Edit</button>
                    <button class="delete-btn" onclick="deleteNote(${note.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

function openEditModal(id, content) {
    currentEditId = id;
    const modal = document.getElementById('editModal');
    const editor = document.getElementById('noteEditor');
    
    // Initialize TinyMCE if not already initialized
    if (!tinymce.get('noteEditor')) {
        tinymce.init({
            selector: '#noteEditor',
            height: 300,
            menubar: false,
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
        });
    }

    tinymce.get('noteEditor').setContent(content);
    modal.style.display = 'block';
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
    currentEditId = null;
}

async function saveEdit() {
    if (!currentEditId) return;

    const token = localStorage.getItem('adminToken');
    const content = tinymce.get('noteEditor').getContent();

    try {
        const response = await fetch(`/api/admin/notes/${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            closeEditModal();
            loadNotes();
        } else {
            alert('Failed to update note');
        }
    } catch (error) {
        console.error('Error updating note:', error);
        alert('Error updating note');
    }
}

function refreshNotes() {
    loadNotes();
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

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
} 