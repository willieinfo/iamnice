
import { getStorage, ref, getDownloadURL, listAll, deleteObject } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { collection, getDocs, addDoc, getDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

import { app, db } from "./firestore-config.js";
import { AddImage } from './AddImage.js';

// const db = getFirestore(app);

// Fetch Category data
async function fetchCategories() {
    const categoriesCollection = collection(db, 'Category'); 
    const categorySnapshot = await getDocs(categoriesCollection);

    // console.log(categoriesCollection)
    return categorySnapshot.docs.map(doc => ({ categnme: doc.data().categnme }));
}

// Dynamically build Inventory Section HTML in the DOM first
async function setupInventory() {
    const divCategnme = await fetchCategories();
    // console.log(divCategnme);

    // .Inventory DOM
    let invCategories = ``;
    let styles = '';


    // Create .Inventory DOM first
    divCategnme.forEach((item, ctr) => {
        const categnme = item.categnme;
        invCategories += `
            <div class="container">    
                <h3>${categnme}</h3>
                <div id="${categnme}-container"></div>
                <label for="fileInput${ctr + 1}" class="file-upload-label">
                    Add ${categnme} Image
                    <input type="file" id="fileInput${ctr + 1}" accept="image/jpeg, image/png, image/bmp" />
                </label>
            </div>
            <div style="border-bottom: 2px solid; height: 10px; width: 100%; color: #3B5998"></div>
        `;

        // Collect styles for each categnme
        styles += `
            #${categnme}-container {
                display: flex;
                flex-wrap: wrap; 
                // justify-content: flex-start; 
                padding: 10px; 
                justify-content: center;   
                align-items: center;          

            }
        `;
    });

    document.getElementById('Inventory').innerHTML = invCategories;
    
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    // Append the style element to the head of the document
    document.head.appendChild(styleElement);

    // Display Inventory Images to HTML Inventory Section
    // Parameters: Images, Image Container
    divCategnme.forEach((item, ctr) => {
        const fileInput = document.getElementById(`fileInput${ctr + 1}`); //Input type='file' id
        getImageFile(fileInput, item.categnme);

       Inventory('images/' + item.categnme, `${item.categnme}-container`);
    });
}

// input type="file" id="fileInput${ctr + 1}" change event call file validation
// There is no onclick() event on <input type='file'> 
function getImageFile(fileInput, containerId) {
    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/bmp'];
        if (!validTypes.includes(file.type)) {
            alert('Please select a valid image file (JPEG, PNG, BMP).');
            return;
        }

        const maxSize = 2 * 1024 * 1024; // 2 MB
        if (file.size > maxSize) {
            alert('File size exceeds 2 MB limit.');
            return;
        }

        // Add image after validation AddImage.js
        AddImage(file, 'images/' + containerId, containerId + '-container');
        setupListings() // refresh the list
    });
}

// Make sure DOM is created before calling Inventory function
document.addEventListener("DOMContentLoaded", setupInventory);

export function Inventory(imgStorage, imgContainer) {
    const storage = getStorage(app);
    const invenContainer = document.getElementById(imgContainer);

    if (!invenContainer) {
        console.error(`Container with ID ${imgContainer} not found.`);
        return; // Exit if the container does not exist
    }

    async function fetchImages(imgStorage) {
        invenContainer.innerHTML = '';
        const listRef = ref(storage, imgStorage);
        const list = await listAll(listRef);
        for (const itemRef of list.items) {
            const url = await getDownloadURL(itemRef);
            displayImage(url, itemRef);
        }
    }

    function displayImage(url, itemRef) {
        const imgInven = document.createElement('img');
        imgInven.src = url;
        imgInven.alt = "Uploaded Image";
        imgInven.classList.add('image-item');

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa', 'fa-trash', 'delete-button'); 
        deleteIcon.onclick = () => deleteImage(itemRef);

        const imageWrapper = document.createElement('div');
        imageWrapper.appendChild(imgInven); 
        imageWrapper.appendChild(deleteIcon);
        imageWrapper.classList.add('imageWrapper');
        invenContainer.appendChild(imageWrapper);
    }

    // delete icon image onclick() function
    async function deleteImage(itemRef) {
        const confirmed = confirm("Are you sure you want to delete this image?");
        //console.log(itemRef)
        if (confirmed) {
            try {
                await deleteObject(itemRef);
                fetchImages(imgStorage); // Refresh the image list
            } catch (error) {
                console.error("Error deleting image:", error);
                alert("Error deleting image.");
            }
        }
    }

    fetchImages(imgStorage);
}

// Fetch Listings data
async function fetchListings() {
    const listingsCollection = collection(db, 'Listings'); 
    const listingsSnapshot = await getDocs(listingsCollection);
    return listingsSnapshot.docs.map(doc => (
         { 
         id: doc.id, 
         categnme: doc.data().categnme ,
         locaname: doc.data().locaname ,
         maindesc: doc.data().maindesc ,
         descript: doc.data().descript ,
         itemprce: doc.data().itemprce ,
         url_site: doc.data().url_site ,
         source__: doc.data().source__ 
        }
    ));
}

// ${item.categnme ? `<p id="p1">${item.categnme}</p>` : ''}

async function setupListings() {
    const divListings = await fetchListings();
    let invListings = ``;

    divListings.forEach((item) => {
        invListings += `
            <div class="liDiv" onclick="showListingForm('${item.id}')">
                <li>
                    ${item.categnme ? `        
                    <div class="categnme-container">
                        <p id="p1">${item.categnme}</p>
                        ${item.source__ === 'Firestore' ? `<p class="storage">Storage</p>` : ''}
                    </div>
                ` : ''}        

                    ${item.locaname ? `<p id="p2">${item.locaname}</p>` : ''}
                    <br>
                    ${item.maindesc ? `<p id="p3">${item.maindesc}</p>` : ''}
                    ${item.descript ? `<p id="p4">${item.descript}</p>` : ''}
                    ${item.itemprce ? `<p id="p5">Price: ${item.itemprce}</p>` : ''}
                    ${item.url_site ? `<p id="p6" style="display:none;">${item.url_site}</p>` : ''}
                </li>
            </div>
        `;

        // Call the new function to append the image if url_site exists
       
        // if (item.url_site && item.source__ !== 'Firestore') {
        //    displayListingImage(item.url_site, item.categnme);
        // }
        
        if (item.url_site) {
            displayListingImage(item.url_site, item.categnme, item.id);
         }
     });

    // Only add the header if there are any listings
    if (invListings) {
        invListings = `
            <div id="propTitle">
                <span>Property Listings</span>
                <button id="addPropBtn" onclick="showListingForm('')">Add Record</button>
            </div>` + invListings;
    } else {
        invListings = 
                `<div id="propTitle">
                    <span>No Property Listing Record</span>
                    <button id="addPropBtn" onclick="showListingForm('')">Add Record</button>
                </div>`;
    }

    document.getElementById('Listings').innerHTML = invListings;

    if (window.innerWidth > 768) {
        const inventoryHeight = document.querySelector('.Inventory').clientHeight;
        document.getElementById('Listings').style.height = `${inventoryHeight}px`;
    }    
}

// Modified function to append the image to the appropriate container
function displayListingImage(url, categnme, docId) {
    const containerId = `${categnme.trim()}-container`;
    const container = document.getElementById(containerId);

    if (container) {
        // Check if the image already exists in the container by comparing the URL
        const existingImage = container.querySelector(`img[src="${url}"]`);
        if (existingImage) {
            // If the image already exists, don't add it again
            console.log("Image already exists in the container, skipping.");
            return;
        }

        // If no existing image, create a new image element
        const imgElement = document.createElement('img');
        imgElement.src = url;
        imgElement.alt = `Listing Image for ${categnme}`;
        imgElement.classList.add('image-item');

        const imageWrapper = document.createElement('div');
        imageWrapper.appendChild(imgElement); 
        imageWrapper.classList.add('imageWrapper');
        container.appendChild(imageWrapper);

        // Add an onclick event to open the listing form
        container.onclick = () => showListingForm(docId);
    } else {
        console.error(`Container with ID ${containerId} not found.`);
    }
}


// Call setupListings after DOM content is loaded
document.addEventListener("DOMContentLoaded", setupListings);


window.showListingForm = function(docId) {
    if (document.getElementById('inventory-form')) {
        console.log("inventory-form exists");
        return; // If it already exists, do nothing
    }

    // Create the form element
    const listForm = document.createElement('form');
    listForm.id = "inventory-form";
    listForm.style.display = "none";  // Start with it hidden

    listForm.innerHTML = `
        <div id="titleBar">Property Description</div>
        <br>
        <div id="inputSection">
            <label for="categList">Select Category</label>
            <select id="categList"></select>
            <br>
            <label for="locaname">Location</label>
            <input type="text" id="locaname" name="locaname" spellcheck="false" required>

            <label for="maindesc">Address</label>
            <input type="text" id="maindesc" name="maindesc" spellcheck="false" required>

            <label for="descript">Particulars</label>
            <textarea id="descript" name="descript" spellcheck="false" style="font-family: Arial; font-size: 14px;"></textarea>

            <label for="maindesc">Price</label>
            <input type="text" id="itemprce" name="itemprce">
            
            <label for="url_site">URL (Image Address)</label>
            <textarea id="url_site" name="url_site" spellcheck="false" style="font-family: Arial; font-size: 14px;"></textarea>

            <div id="btnDiv">
                <button type="submit" id="saveBtn">Save</button>
                <button type="button" id="cancelBtn">Cancel</button>
            </div>
        </div>
    `;

    // Create the overlay background for the modal
    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black background
    overlay.style.zIndex = 999; 

    // Append the form to the container with id 'Inventory'
    document.getElementById('Inventory').appendChild(listForm);
    document.getElementById('Inventory').appendChild(overlay);

    // Show the form by changing its display style
    document.getElementById('inventory-form').style.display = 'flex';

    // Use scrollIntoView to bring the modal into view
    document.getElementById('inventory-form').scrollIntoView({
        behavior: 'smooth',   // Smooth scroll animation
        block: 'center',      // Center the modal vertically in the viewport
        inline: 'nearest'     // Align it horizontally
    });

    // Event listener for Cancel button to close the modal
    document.getElementById('cancelBtn').addEventListener('click', () => {
        document.getElementById('inventory-form').remove(); // Remove the form from the DOM
        document.getElementById('modal-overlay').remove();  // Remove overlay
    });

    // Event listener for Save button to edit or add data and close the modal
    document.getElementById('saveBtn').addEventListener('click', (e) => {
        e.preventDefault();
        
        if (docId) {
            // Edit existing record
            editRecordList(docId);
        } else {
            // Add new record
            const newListingData = {
                categnme: document.getElementById('categList').value,
                locaname: document.getElementById('locaname').value,
                maindesc: document.getElementById('maindesc').value,
                descript: document.getElementById('descript').value,
                itemprce: document.getElementById('itemprce').value,
                url_site: document.getElementById('url_site').value,
            };
            addRecordList(newListingData); // Add new record
        }

        document.getElementById('inventory-form').remove(); // Remove the form from the DOM
        document.getElementById('modal-overlay').remove();  // Remove overlay
    });

    // If editing an existing record, show its details
    if (docId) {
        showRecordList(docId);
    } else {
        // If adding new, populate with default empty values
        document.getElementById('locaname').value = '';
        document.getElementById('maindesc').value = '';
        document.getElementById('descript').value = '';
        document.getElementById('itemprce').value = '';
        document.getElementById('url_site').value = '';
    }

    populateCategories()
}

async function populateCategories() {
    const divCategnme = await fetchCategories();
    const categList = document.getElementById('categList');

    // Clear any existing options first, if needed
    categList.innerHTML = '';

    // Populate the select dropdown with category options
    divCategnme.forEach((category) => {
        const categOption = document.createElement('option');
        categOption.value = category.categnme;
        categOption.textContent = category.categnme;
        categList.appendChild(categOption);
    });
}


async function showRecordList(docId) {

    const item = await getListingRecord(docId);  // Fetch the specific document based on docId
    if (!item) return;  // If no item is found, do nothing

    document.getElementById('locaname').value = item.locaname || '';
    document.getElementById('maindesc').value = item.maindesc || '';
    document.getElementById('descript').value = item.descript || '';
    document.getElementById('itemprce').value = item.itemprce || '';
    document.getElementById('url_site').value = item.url_site || '';
  
    // Populate the select dropdown with category options
    const divCategnme = await fetchCategories();
    const categList = document.getElementById('categList');

    // Clear any existing options first, if needed
    categList.innerHTML = '';

    divCategnme.forEach((category) => {
        const categOption = document.createElement('option');
        categOption.value = category.categnme; 
        categOption.textContent = category.categnme;
        
        // Set the selected option if it matches the item.categnme
        if (category.categnme === item.categnme) {
            categOption.selected = true;  // This makes the option selected
        }

        categList.appendChild(categOption);
    });    
    

}

// Get the record form "Listings" collection
async function getListingRecord(docId) {
    const docRef = doc(db, 'Listings', docId);  // Get reference to the document
    const docSnap = await getDoc(docRef);       // Fetch the document

    if (docSnap.exists()) {
        return docSnap.data();  // Return the document data
    } else {
        console.log("No such document!");
        return null;
    }
}


// Add a new listing to the "Listings" collection
export async function addRecordList(listingData) {
    try {
        const docRef = await addDoc(collection(db, 'Listings'), listingData);
        setupListings() // refresh the list

        console.log("Document written with ID: ", docRef.id);  // This is the auto-generated document ID
        return docRef.id; // You can use this ID later
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// Edit the record in the "Listings" collection
async function editRecordList(docId) {
    try {
        await setDoc(doc(db, 'Listings', docId),{
            categnme : document.getElementById('categList').value ,
            locaname : document.getElementById('locaname').value ,
            maindesc : document.getElementById('maindesc').value ,
            descript : document.getElementById('descript').value ,
            itemprce : document.getElementById('itemprce').value ,
            url_site : document.getElementById('url_site').value
        });
        setupListings() // refresh the list
    } catch (e) {
        console.error("Error editing document: ", e);
    } 
}


// Remember, writing code is all about practice and patience—everyone starts somewhere. 
// If you keep experimenting and asking questions, you’ll continue to improve. 
