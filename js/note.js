function generateNoteID() {
    let s = '';
    do { s += Math.random().toString(36).slice(2); }
    while (s.length < 10);
    return s.slice(0, 10);
}

if (!localStorage.getItem(dbName)) {
    localStorage.setItem(dbName, '[]');
}

$('#cancelNote-btn').onclick = () => {
    $('.home-container').hidden = false;
    $('.addnote-container').hidden = true;
}

$('#addNote-btn').onclick = () => {
    // checking for textbox text is presented
    if (!$('#note_textbox').value || !$('#note_textbox').value.match(/\S/))
        return null;

    if ($('#note_textbox').value.length > 60) {
        $('#infobox').hidden = false;
        setTimeout(() => {
            $('#infobox').hidden = true;
        }, 3000);

        return null;
    }

    const notesData = JSON.parse(localStorage.getItem(dbName));

    // showing "remove all" button
    $('#home_removeAll-btn').hidden = false;

    // generating unique ID for new note
    const noteID = generateNoteID();

    // creating note data
    const noteObject = new Object(null);
    noteObject.text = $('#note_textbox').value;
    noteObject.id = noteID;
    noteObject.updated = new Date().toISOString();

    // saving new note
    notesData.push(noteObject);
    localStorage.setItem(dbName, JSON.stringify(notesData));

    // hiding new note interface, and showing main menu
    $('.home-container').hidden = false;
    $('.addnote-container').hidden = true;
    $('.main_hero-desc').hidden = true;

    // displaying new note on main menu

    // note container
    const noteContainer = document.createElement('div');
    noteContainer.className = 'note_container';
    noteContainer.id = `note-${noteObject.id}`;
    notesRoot.appendChild(noteContainer);

    // note preview text
    const noteText = document.createElement('p');
    noteText.className = 'note_text';
    noteText.title = new Date(noteObject.updated).toDateString();
    noteText.innerText = noteObject.text;
    noteContainer.appendChild(noteText);

    // delete note button
    const noteDeleteButton = document.createElement('i');
    noteDeleteButton.innerText = 'delete';
    noteDeleteButton.classList.add('material-icons', 'note_deleteicon');
    noteDeleteButton.title = 'Delete this note';
    noteDeleteButton.onclick = () => {
        $(`#note-${noteObject.id}`).remove();

        // finding note to delete
        const index = notesData.findIndex(item => item.id === noteID);

        // deleting it
        if (index !== -1) notesData.splice(index, 1);

        // saving
        localStorage.setItem(dbName, JSON.stringify(notesData));
    }

    noteContainer.appendChild(noteDeleteButton);
}