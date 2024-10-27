import { getStorage, ref, getDownloadURL, listAll, deleteObject } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";
import { app } from "../firebase-config.js";

export function Inventory(imgStorage, imgContainer) {
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
            displayImage(url, itemRef);
        }
    }

    function displayImage(url, itemRef) {
        const imgInven = document.createElement('img');
        imgInven.src = url;
        imgInven.alt = "Uploaded Image";
        imgInven.classList.add('image-item');

        // Create edit and delete buttons
        // const editButton = document.createElement('button');
        // editButton.innerText = 'Edit';
        // editButton.onclick = () => editImage(itemRef);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'X';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = () => deleteImage(itemRef);

        // Append image and buttons to container
        const imageWrapper = document.createElement('div');
        imageWrapper.appendChild(imgInven);
        imageWrapper.appendChild(deleteButton);
        imageWrapper.classList.add('imageWrapper');
        invenContainer.appendChild(imageWrapper);
        // imageWrapper.appendChild(editButton);
  
    }

    async function deleteImage(itemRef) {
        const confirmed = confirm("Are you sure you want to delete this image?");
        if (confirmed) {
            try {
                await deleteObject(itemRef);
                alert("Image deleted successfully!");
                fetchImages(imgStorage); // Refresh the image list
            } catch (error) {
                console.error("Error deleting image:", error);
                alert("Error deleting image.");
            }
        }
    }

    async function editImage(itemRef) {
        const newUrl = prompt("Enter new image URL:");
        if (newUrl) {
            // Here you would implement the logic to replace the image with a new one
            // This example just shows a prompt; you will need to handle the actual upload
            alert("Edit functionality is not implemented in this example.");
            // Example: You would upload the new image to the same ref and then refresh
            // const response = await fetch(newUrl); // Get new image
            // const blob = await response.blob(); // Convert to blob
            // await uploadBytes(itemRef, blob); // Replace the existing image
            // fetchImages(imgStorage); // Refresh the image list
        }
    }

    // Fetch images on page load
    fetchImages(imgStorage);
}

document.addEventListener("DOMContentLoaded", function() {
    Inventory('images/Townhouse', 'townhouse-container');
    Inventory('images/Condo', 'condo-container');
    Inventory('images/houses', 'houses-container');
});


async function getImageUrl(imgStorage) {
    const storage = getStorage(app);
    const imageRef = ref(storage, imgStorage);
    
    try {
        const url = await getDownloadURL(imageRef);
        console.log("Image URL:", url);
        return url;
    } catch (error) {
        console.error("Error getting image URL:", error);
        return null;
    }
}

// Example usage:
// const imagePath = 'images/Townhouse/townhouse1.jpg'; // Replace with your image path
// getImageUrl(imagePath).then(url => {
//     if (url) {
//         // Do something with the URL
//         console.log("Retrieved image URL:", url);
//     }
// });
