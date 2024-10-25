    import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";
    import { app } from "../firebase-config.js"

    export function Inventory(imgLocation,imgStorage) {
        const storage = getStorage(app);
        const uploadButton = document.getElementById('uploadTownhouse');
        const fileInput = document.getElementById('fileInput');

        const invenContainer = document.getElementById(imgLocation);
    
        uploadButton.addEventListener('click', async () => {
            const file = fileInput.files[0];
            if (!file) {
                alert("Please select a file first.");
                return;
            }
    
            // Control file types
            const validTypes = ['image/jpeg', 'image/png', 'image/bmp'];
            if (!validTypes.includes(file.type)) {
                alert('Please select a valid image file (JPEG, PNG, BMP).');
                return;
            }
    
            // Control file size
            const maxSize = 2 * 1024 * 1024; // 2 MB
            if (file.size > maxSize) {
                alert('File size exceeds 2 MB limit.');
                return;
            }            
    
            // Preview file first
            const reader = new FileReader();
            reader.onload = (event) => {
                const inventoryImg = document.createElement('img');
                inventoryImg.src = event.target.result;

                invenContainer.appendChild(inventoryImg);
            };
            reader.readAsDataURL(file);            
    
            const storageRef = ref(storage, imgStorage + file.name);
    
            try {
                await uploadBytes(storageRef, file);
                alert("Image uploaded successfully!");
                fetchImages();
            } catch (error) {
                console.error("Upload failed:", error);
                alert("Error uploading image.");
            }
        });
    

        async function fetchImages(imgStorage) {
            // Clear the container before fetching
            invenContainer.innerHTML = '';
    
            const listRef = ref(storage, imgStorage);
    
            // Fetching the image URLs
            const list = await listAll(listRef);
            list.items.forEach(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                invenContainer.classList.add('image-item');
                displayImage(url);
            });
        }
    
        function displayImage(url) {
            const imgInven = document.createElement('img');
            imgInven.src = url;
            imgInven.alt = "Uploaded Image";
            invenContainer.appendChild(imgInven);
        }
    
        // Fetch images on page load
        fetchImages(imgStorage);
    
    }
    document.addEventListener("DOMContentLoaded", function() {
        Inventory('townhouse-container','images/Townhouse'); 
        Inventory('condo-container','images/Condo'); 
        Inventory('houses-container','images/houses'); 
    });        
    //window.onload = Inventory;
    
