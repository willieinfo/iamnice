    import { getStorage, ref, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";
    import { app } from "../firebase-config.js"

    export function Inventory(imgStorage,imgContainer) {
        const storage = getStorage(app);
        const invenContainer = document.getElementById(imgContainer);
   
        async function fetchImages(imgStorage) {
            // Clear the container before fetching
            invenContainer.innerHTML = '';
            const listRef = ref(storage, imgStorage);
        
            // Fetching the image URLs
            const list = await listAll(listRef);
            for (const itemRef of list.items) {
                const url = await getDownloadURL(itemRef);
                displayImage(url);
            }
        }

        function displayImage(url) {
            const imgInven = document.createElement('img');
            imgInven.src = url;
            imgInven.alt = "Uploaded Image";
            imgInven.classList.add('image-item'); // Add the class to the image
            invenContainer.appendChild(imgInven);
        }
        
        //Fetch images on page load
        fetchImages(imgStorage);
    
    }

    document.addEventListener("DOMContentLoaded", function() {
        Inventory('images/Townhouse','townhouse-container'); 
        Inventory('images/Condo','condo-container'); 
        Inventory('images/houses','houses-container'); 
    });        
   
    
