
import { getStorage, ref, getDownloadURL, listAll, deleteObject } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { app } from "./firestore-config.js";
import { AddImage } from './AddImage.js';

const db = getFirestore(app);

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

async function setupListings() {
    const divListings = await fetchListings();
    let invListings = ``;

    divListings.forEach((item) => {
        invListings += `
            <div class="liDiv" onclick="showListingForm()">
                <li>
                    ${item.categnme ? `<p id="p1">${item.categnme}</p>` : ''}
                    ${item.locaname ? `<p id="p2">${item.locaname}</p>` : ''}
                    ${item.maindesc ? `<p id="p3">${item.maindesc}</p>` : ''}
                    ${item.descript ? `<p id="p4">${item.descript}</p>` : ''}
                    ${item.itemprce ? `<p id="p5">Price: ${item.itemprce}</p>` : ''}
                </li>
            </div>
        `;

        // Call the new function to append the image if url_site exists
        
        // if (item.url_site && item.source__ !== 'Firestore') {
        //    displayListingImage(item.url_site, item.categnme);
        // }
        if (item.url_site) {
            displayListingImage(item.url_site, item.categnme);
         }
     });

    // Only add the header if there are any listings
    if (invListings) {
        invListings = `<span>Property Listings</span>` + invListings;
    } else {
        invListings = `<span>No Listings Available</span>`;
    }

    document.getElementById('Listings').innerHTML = invListings;

    if (window.innerWidth > 768) {
        const inventoryHeight = document.querySelector('.Inventory').clientHeight;
        document.getElementById('Listings').style.height = `${inventoryHeight}px`;
    }    
}

// Modified function to append the image to the appropriate container
function displayListingImage(url, categnme) {
    const containerId = `${categnme.trim()}-container`;
    const container = document.getElementById(containerId);
    
    if (container) {
        const imgElement = document.createElement('img');
        imgElement.src = url;
        imgElement.alt = `Listing Image for ${categnme}`;
        imgElement.classList.add('image-item');

        const imageWrapper = document.createElement('div');
        imageWrapper.appendChild(imgElement); 
        imageWrapper.classList.add('imageWrapper');
        container.appendChild(imageWrapper);

        // container.onclick = () => alert('Image is clicked');
        container.onclick = () => showListingForm();

    } else {
        console.error(`Container with ID ${containerId} not found.`);
    }
}

// Call setupListings after DOM content is loaded
document.addEventListener("DOMContentLoaded", setupListings);

window.showListingForm = function()  {
    if (document.getElementById('inventory-form')) {
        return; // If it already exists, do nothing
    }
    console.log("inventory-form exist")
    // Create the form element
    const listForm = document.createElement('form');
    listForm.id = "inventory-form";
    listForm.style.display = "none";  // Start with it hidden

    listForm.innerHTML = `
        <div id="titleBar">Property Description</div>
        <br>
        <div id="inputSection">
            <label for="categList">Select Category</label>
            <select id="categList" tabindex="1">
                <option>Option 1</option>
                <option>Option 2</option>
            </select>
            <br>
            <label for="locaname">Location</label>
            <input type="text" id="locaname" name="locaname" spellcheck="false" required>
            
            <label for="maindesc">Description</label>
            <input type="text" id="maindesc" name="maindesc" spellcheck="false" required>
            
            <label for="descript">Particulars</label>
            <textarea id="descript" name="descript" spellcheck="false"></textarea>
            
            <label for="url_site">URL (Image Address)</label>
            <textarea id="url_site" name="url_site" spellcheck="false"></textarea>

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
    // document.getElementById('Inventory').appendChild(overlay);

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
        // document.getElementById('inventory-form').style.display = 'none'; // Hide the form
        document.getElementById('inventory-form').remove(); // Remove the form from the DOM

    });

    // document.body.appendChild(overlay);
}


// function showListingForm() {
//     const listForm=`
//         <form id="inventory-form" style="display: none">
//         <div id="titleBar">Property Description</div>
//         <br>
//         <div id="inputSection">
//             <label for="categList">Select Category</label>
//             <select id="categList" tabindex=1>
//                 <option>Option 1</option>
//                 <option>Option 2</option>
//             </select>
//             <br>
//             <label for="locaname">Location</label>
//             <input type="text" id="locaname" name="locaname" spellcheck="false" required>
            
//             <label for="maindesc">Description</label>
//             <input type="text" id="maindesc" name="maindesc" spellcheck="false" required>
            
//             <label for="descript">Particulars</label>
//             <textarea type="text" id="descript" name="descript" spellcheck="false"></textarea>
            
//             <label for="url_site">URL (Image Address)</label>
//             <textarea type="text" id="url_site" name="url_site" spellcheck="false"></textarea>

//             <div id="btnDiv">
//                 <button id="saveBtn">Save</button>
//                 <button id="cancelBtn">Cancel</button>
//             </div>
//         </div>
//     `
//     document.getElementById('Inventory').appendChild(listForm)
//     document.getElementById('inventory-form').display='flex'
// }

// Remember, writing code is all about practice and patience—everyone starts somewhere. 
// If you keep experimenting and asking questions, you’ll continue to improve. 

