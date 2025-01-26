/**
 * Validates the 'editTitle' input field in the edit task form.
 * Checks if the field is empty. If empty, it highlights the field, 
 * displays an error message, and sets isValid to false.
 *
 * @returns {boolean} True if the title field is valid (not empty), otherwise false.
 */
function validateEditTitle() {
    let isValid = true;
    const titleInput = document.getElementById('editTitle');
    if (titleInput.value.trim() === "") {
        titleInput.style.border = '1px solid rgba(255, 129, 144, 1)';
        showErrorMessage(titleInput, 'This field is required');
        isValid = false;
    } else {
        titleInput.style.border = '1px solid rgba(41, 171, 226, 1)';
        removeErrorMessage(titleInput);
    }
    return isValid;
}



/**
 * Handles the input event on input fields, resetting the border color and removing error messages.
 *
 * @param {Event} event - The input event.
 */
function handleInputEdit(event) {
    const field = event.target;
    if (field.value.trim() !== "") {
        field.style.border = '1px solid rgba(41, 171, 226, 1)';
        removeErrorMessage(field);
    }
}


/**
 * Handles the blur event on input fields, validating the input and displaying error messages if necessary.
 *
 * @param {Event} event - The blur event.
 */
function handleBlurEdit(event) {
    const field = event.target;
    if (field.value.trim() !== "") {
        field.style.border = '1px solid rgba(209, 209, 209, 1)';
    } else {
        if (field.id !== 'editDescription') {
            field.style.border = '1px solid rgba(255, 129, 144, 1)';
            showErrorMessage(field, 'This field is required');
        } else {
            field.style.border = '1px solid rgba(209, 209, 209, 1)';
            removeErrorMessage(field);
        }
    }

}


/**
 * Toggles the visibility of the contact list in the edit task popup.
 * Updates the search field border radius, dropdown icon, and selected contacts display.
 * Also manages the event listener for closing the list on outside clicks.
 */
function toggleContactListEdit() {
    const contactList = document.getElementById("contact-list-edit");
    const contactSearch = document.getElementById("contact-search-edit");
    const selectedContacts = document.getElementById("selected-contacts-edit");
    const toggleButton = document.getElementById("toggle-list-edit");
    const dropdownIcon = toggleButton.querySelector(".dropdown-icon");
    contactList.classList.toggle("hidden");
    contactSearch.style.borderRadius = contactList.classList.contains("hidden") ? "10px" : "10px 10px 0 0";
    dropdownIcon.src = contactList.classList.contains("hidden") ? "./assets/icons/arrow_drop_down.svg" : "./assets/icons/arrow_drop_up.svg";
    selectedContacts.style.display = contactList.classList.contains("hidden") ? "flex" : "none";
    if (contactList.classList.contains("hidden")) {
        document.removeEventListener('click', closeContactListOnClickOutsideEdit);
        contactSearch.value = '';
    } else {
        document.addEventListener('click', closeContactListOnClickOutsideEdit);
    }
}


/**
 * Filters the contact list based on the search term entered in the contact search field.
 */
function filterContactsEdit() {
    const searchTerm = document.getElementById("contact-search-edit").value.toLowerCase();
    const contactItems = document.querySelectorAll("#contact-list-edit .contact-item");
    contactItems.forEach(item => {
        const name = item.textContent.toLowerCase();
        item.style.display = name.includes(searchTerm) ? "" : "none";
    });
    const contactList = document.getElementById("contact-list-edit");
    const isListOpen = !contactList.classList.contains("hidden");
    if (!isListOpen) {
        toggleContactListEdit();
    }
}


/**
 * Closes the contact list when the user clicks outside of it.
 *
 * @param {Event} event - The click event.
 */
function closeContactListOnClickOutsideEdit(event) {
    const contactList = document.getElementById("contact-list-edit");
    const contactSearch = document.getElementById("contact-search-edit");
    const toggleButton = document.getElementById("toggle-list-edit");
    const selectedContacts = document.getElementById("selected-contacts-edit");
    if (!contactList.contains(event.target) &&
        !contactSearch.contains(event.target) &&
        !toggleButton.contains(event.target)) {
        toggleContactListEdit();
        selectedContacts.style.display = "flex";
        contactSearch.value = '';
    }
}


/**
 * Generates the HTML for displaying selected contacts in the edit task popup.
 * Iterates through the assigned contacts in the task object and creates HTML
 * for each selected contact, displaying their initials and background color.
 * 
 * @param {Object} task - The task object containing the assigned contacts.
 * @returns {string} The HTML string representing the selected contacts.
 */
function displaySelectedContactsEdit(task) {
    let html = '';
    for (const contactId in task.Assigned_to) {
        const contact = task.Assigned_to[contactId];
        const initials = contact.name.split(' ').map(part => part.charAt(0)).join('');
        html += `
            <div class="selected-contact" style="background-color: ${contact.color}" data-contact-id="${contact.id}">
                ${initials}
            </div>
        `;
    }
    return html;
}


/**
 * Creates a contact item element for the edit task popup and appends it to the contact list.
 * Checks if the contact is already assigned to the task and sets the checkbox accordingly.
 * 
 * @param {Object} contact - The contact data.
 * @param {HTMLElement} contactList - The contact list element.
 * @param {Array} assignedContacts - An array of assigned contact objects.
 */
function createContactItemEdit(contact, contactList, assignedContacts) {
    const contactItem = document.createElement("div");
    contactItem.classList.add("contact-item");
    const initials = contact.name.split(" ").map(part => part.charAt(0)).join('');
    const isChecked = assignedContacts.some(c => c.id === contact.id);
    contactItem.innerHTML = `
        <div class="contact-logo" style="background-color: ${contact.color};" data-background="${contact.color}">
            ${initials} 
        </div>
        <span>${contact.name}</span>
        <div class="contact-checkbox ${isChecked ? 'checked' : ''}" data-contact-id="${contact.id}"></div> 
    `;
    if (isChecked) {
        contactItem.classList.add("checked");
    }
    contactList.appendChild(contactItem);
}


/**
 * Updates the display of selected contacts in the edit task popup.
 * Clears existing selected contacts, iterates through checked checkboxes,
 * and updates the `selectedContactsDataEdit` object and the display.
 */
function updateSelectedContactsEdit() {
    const selectedContactsDiv = document.getElementById("selected-contacts-edit");
    selectedContactsDiv.innerHTML = '';
    const selectedCheckboxes = document.querySelectorAll("#contact-list-edit .contact-checkbox.checked");
    selectedContactsDataEdit = {};
    selectedCheckboxes.forEach(checkbox => {
        const contactId = checkbox.dataset.contactId;
        const contactItem = checkbox.parentElement;
        const logo = contactItem.querySelector(".contact-logo");
        const name = contactItem.querySelector("span").textContent;
        const color = logo.style.backgroundColor;
        selectedContactsDataEdit[contactId] = { name, id: contactId, color };
        selectedContactsDiv.innerHTML += `
            <div class="selected-contact" style="background-color: ${color}">
                ${logo.innerText}
            </div>
        `;
    });
}


/**
 * Retrieves the subtasks from the edit task form, including their descriptions and checked status.
 * Prioritizes the text from input fields if a subtask is being edited.
 * 
 * @param {Object} originalTask - The original task object containing the subtasks.
 * @returns {Object} An object containing the updated subtask data.
 */
function getSubtasksEditTask(originalTask) {
    const subtasks = { ...originalTask.Subtasks };
    document.querySelectorAll("#subtask-list-edit .subtask-item").forEach(item => {
        const subtaskText = item.querySelector('.subtask-edit-input')?.value.trim()
            || item.querySelector('.subtask-text')?.innerText.trim() || '';
        const subtaskId = item.dataset.subtaskId;
        if (subtasks[subtaskId]) {
            subtasks[subtaskId].description = subtaskText;
        } else {
            subtasks[subtaskId] = { id: subtaskId, description: subtaskText, isChecked: false };
        }
    });
    return subtasks;
}


/**
 * Handles the click event on a contact checkbox in the edit task popup.
 * Toggles the "checked" class on the checkbox and its parent contact item,
 * and updates the display of selected contacts.
 * 
 * @param {Event} event - The click event object.
 */
function handleContactCheckboxClickEdit(event) {
    const checkbox = event.target.closest(".contact-checkbox");
    if (checkbox) {
        checkbox.classList.toggle("checked");
        checkbox.parentElement.classList.toggle("checked");
        updateSelectedContactsEdit();
    }
}


/**
 * Saves the edited subtask, updating the UI and Firebase.
 * Handles empty subtask descriptions and provides visual error indication.
 * 
 * @param {HTMLElement} element - The element that triggered the save action.
 */
function saveSubtaskEditTask(element) {
    const li = element.closest('li');
    const subtaskInput = li.querySelector('input');
    const newText = subtaskInput.value.trim();
    const originalText = li.dataset.originalText;

    if (newText === '') {
        handleEmptySubtask(li);
        return;
    }
    subtaskInput.style.borderBottom = '';
    li.innerHTML = generateSavedSubtaskHTML(newText, originalText);
}


/**
 * Handles the case when the subtask description is empty.
 * Removes the subtask if it's new or displays an error message if it's existing.
 * 
 * @param {HTMLElement} li - The list item element representing the subtask.
 */
function handleEmptySubtask(li) {
    if (!li.dataset.subtaskId) {
        li.remove();
    } else {
        const subtaskInput = li.querySelector('input');
        subtaskInput.style.borderBottom = '2px solid rgb(255, 129, 144)';
    }
}


/**
 * Updates a subtask in Firebase with the new description.
 * 
 * @param {HTMLElement} li - The list item element representing the subtask.
 * @param {string} newText - The updated subtask description.
 */
async function updateSubtaskInFirebase(li, newText) {
    const taskId = document.getElementById('editTaskDetailsPopup').dataset.taskId;
    const firebaseId = document.getElementById('editTaskDetailsPopup').dataset.firebaseId;
    const subtaskId = li.dataset.subtaskId;
    const task = await getTaskByIdToEdit(taskId);
    if (!task || !task.Subtasks || !task.Subtasks[subtaskId]) return;
    task.Subtasks[subtaskId].description = newText;
    try {
        await putData(`tasks/${firebaseId}`, task);
    } catch (error) {
        console.error('Error updating subtask in Firebase:', error);
    }
}


/**
 * Edits a subtask in the edit task popup, replacing its text with an input field for editing.
 * Stores the original subtask text in a data attribute for potential reversion.
 * 
 * @param {HTMLElement} element - The element that triggered the edit action (e.g., the subtask text div).
 * @param {string} originalText - The original text of the subtask.
 */
function editSubtaskEditTask(element, originalText) {
    const li = element.closest('li');
    li.dataset.originalText = originalText;
    li.innerHTML = generateEditSubtaskHTMLEditTask(originalText);
    const subtaskInput = li.querySelector('input');
    subtaskInput.focus();
}


/**
 * Deletes a subtask from the edit task popup and updates Firebase.
 * 
 * @param {HTMLElement} element - The element that triggered the delete action (e.g., the delete icon).
 */
async function deleteSubtaskEditTask(element) {
    const listItem = element.closest('.subtask-item');
    const subtaskId = listItem.dataset.subtaskId;
    subtasksToDelete.push(subtaskId);
    listItem.remove();
}