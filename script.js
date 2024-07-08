const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item));

    checkUI();

}


// When clicking the button addItem this functions runs and the be
function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value.toLowerCase(); // Normalize case when adding

    if (newItem === '') {
        alert('Please add an item');
        return;
    }

    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.remove(); // Remove the old item from the DOM
        itemToEdit.classList.remove('edit-mode');
        isEditMode = false;
    } else {
        if (CheckIfItemExists(newItem)) {
            alert('That item already exists!');
            return;
        }
    }

    addItemToDOM(newItem);
    addItemToStorage(newItem);

    checkUI();

    itemInput.value = '';
}



function addItemToDOM(item) {
    // Create List Item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item)); // idk what the .createTextNode thing does

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    // Add li to DOM 
    itemList.appendChild(li);

}




function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

// Local Storage

function addItemToStorage(item) {
    const itemsFromStorage = getItemFromStorage();

    // if(localStorage.getItem('items') === null) {
    //     itemsFromStorage = [];
    // }
    // else {
    //     itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    // }

    itemsFromStorage.push(item.toLowerCase());

    // Convert to JSON String and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));  
}



function getItemFromStorage() {
    let itemsFromStorage;

    if(localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    }
    else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    }
    else {
        setItemToEdit(e.target);
    }
}


function CheckIfItemExists(item) {
    const itemsFromStorage = getItemFromStorage().map(i => i.toLowerCase());
    return itemsFromStorage.includes(item.toLowerCase());
}


function setItemToEdit(item) {
    isEditMode = true;

    itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = 'green'
    itemInput.value = item.textContent;
}

// Remove
function removeItem(item) {
    if (confirm('Are you sure?')) {
        item.remove();

        removeItemFromStorage(item.textContent);
        
        // when we delete items and there are no left
        checkUI();  
    }
}




function removeItemFromStorage(item) {
    let itemsFromStorage = getItemFromStorage();

    // Filter item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    // Re-set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}





function clearItems(e) {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    //  Clear from localStorage
    localStorage.removeItem('items');

    checkUI();
}

function filterItems(e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        }
        else {
            item.style.display = 'none';
            // clearBtn.style.display = 'none';
        }
    });

}



// DynamicUI  ----   RESET   -----
function checkUI() {
    itemInput.value = '';

    const items = itemList.querySelectorAll('li');
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    }
    else{
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}

// Initialise app
function init() {
    // Event Listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems)


    // when page loads 
    checkUI();
}


init();
