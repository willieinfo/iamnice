

    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
    import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-analytics.js";
    import { app, analytics } from "../firebase-config.js"

    export function MainApp() {
        const storage = getStorage(app);

        const uploadButton = document.getElementById('uploadButton');
        const fileInput = document.getElementById('fileInput');
        const imageContainer = document.getElementById('image-container');
    
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
                const img = document.createElement('img');
                img.src = event.target.result;
                imageContainer.appendChild(img);
            };
            reader.readAsDataURL(file);            
    
            const storageRef = ref(storage, 'images/' + file.name);
    
            try {
                await uploadBytes(storageRef, file);
                alert("Image uploaded successfully!");
                fetchImages();
            } catch (error) {
                console.error("Upload failed:", error);
                alert("Error uploading image.");
            }
        });
    
        async function fetchImages() {
            // Clear the container before fetching
            imageContainer.innerHTML = '';
    
            const listRef = ref(storage, 'images/');
    
            // Fetching the image URLs
            const list = await listAll(listRef);
            list.items.forEach(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                displayImage(url);
            });
        }
    
        function displayImage(url) {
            const img = document.createElement('img');
            img.src = url;
            img.alt = "Uploaded Image";
            imageContainer.appendChild(img);
        }
    
        // Fetch images on page load
        fetchImages();
    
    }

    window.onload = MainApp;
    
