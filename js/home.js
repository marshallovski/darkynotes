function $(elem) {
    return document.querySelector(elem);
}

const dbName = 'darkynotes-storage';
const darkyNotesStorage = localStorage.getItem(dbName);
const notesData = JSON.parse(darkyNotesStorage) || '[]';
const notesRoot = $('#home_notes-container');

const addNoteBtn = $('#home_addNote-btn');
const removeAllBtn = $('#home_removeAll-btn');

addNoteBtn.onclick = async () => {
    $('.home-container').hidden = true;
    $('#note_textbox').value = '';
    $('.addnote-container').hidden = false;
};

removeAllBtn.onclick = () => {
    localStorage.setItem(dbName, '[]');
    while (notesRoot.firstChild)
        notesRoot.removeChild(notesRoot.firstChild);

    $('.main_hero-desc').hidden = false;
    removeAllBtn.hidden = true;
}

if (notesData.length > 0) {
    $('.main_hero-desc').hidden = true;
    $('#home_removeAll-btn').hidden = false;

    // sorting notes
    notesData.sort((a, b) =>
        new Date(a.updated) > new Date(b.updated) ? -1 : 1
    );

    notesData.forEach(note => {
        // note container
        const noteContainer = document.createElement('div');
        noteContainer.className = 'note_container';
        noteContainer.id = `note-${note.id}`;

        notesRoot.appendChild(noteContainer);

        // note preview text
        const noteText = document.createElement('p');
        noteText.className = 'note_text';
        noteText.title = new Date(note.updated).toDateString();
        noteText.innerText = note.text;

        noteContainer.appendChild(noteText);

        // delete note button
        const noteDeleteButton = document.createElement('i');
        noteDeleteButton.innerText = 'delete';
        noteDeleteButton.className = 'material-icons';
        noteDeleteButton.classList.add('material-icons', 'note_deleteicon');
        noteDeleteButton.title = 'Delete this note';
        noteDeleteButton.onclick = () => {
            $(`#note-${note.id}`).remove();

            // finding note to delete
            const index = notesData.findIndex(item => item.id === note.id);

            // deleting it
            if (index !== -1) notesData.splice(index, 1);

            // saving
            localStorage.setItem(dbName, JSON.stringify(notesData));
        }

        noteContainer.appendChild(noteDeleteButton);
    });
}