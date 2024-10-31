
import { getStorage, ref, getDownloadURL, listAll, deleteObject } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { app } from "./firestore-config.js";
import { AddImage } from './AddImage.js';

const db = getFirestore(app);

// Fetch Category data
async function fetchCategories() {
    const categoriesCollection = collection(db, 'Category'); 
    const categorySnapshot = await getDocs(categoriesCollection);
    return categorySnapshot.docs.map(doc => ({ categnme: doc.data().categnme }));
}

// Dynamically build Inventory Section HTML in the DOM first
async function setupInventory() {
    const divCategnme = await fetchCategories();
    // console.log(divCategnme);

    let invCategories = ``;
    let styles = '';

    // Create DOM first
    divCategnme.forEach((item, ctr) => {
        const categnme = item.categnme;
        invCategories += `
            <div class="container">
                <h3>${categnme}</h3>
                <div id="${categnme}-container"></div>
                <label for="fileInput${ctr + 1}" class="file-upload-label">
                    Add Image
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
                justify-content: flex-start; 
                padding: 10px; 
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
        const fileInput = document.getElementById(`fileInput${ctr + 1}`);
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

// document.addEventListener("DOMContentLoaded", function() {
//     Inventory('images/Condominiums', 'Condominiums-container');
//     Inventory('images/Houses', 'Houses-container');
//     Inventory('images/Townhouse', 'Townhouse-container');
//     Inventory('images/Lots', 'Lots-container');

// });



// Remember, writing code is all about practice and patience—everyone starts somewhere. 
// If you keep experimenting and asking questions, you’ll continue to improve. 

