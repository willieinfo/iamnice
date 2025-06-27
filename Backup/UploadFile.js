import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";
import { app } from "./src/firebase-config.js";
import { Inventory } from "./MainApp.js";
import { MessageBox } from "./MessageBox.js";

const storage = getStorage(app);

export async function UploadFile(imgStorage, imgContainer) {
    const fileInput = document.getElementById('fileInput');
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

    // const reader = new FileReader();
    // reader.onload = (event) => {
    //     const inventoryImg = document.createElement('img');
    //     inventoryImg.src = event.target.result;
    //     document.getElementById(imgContainer).appendChild(inventoryImg);
    // };
    // reader.readAsDataURL(file);            

    // This is where firebase get into play
    // imgStorage = is where the image is saved
    const storageRef = ref(storage, `${imgStorage}/${file.name}`);
    try {
        await uploadBytes(storageRef, file);
        MessageBox("Image uploaded successfully!",'Ok','Uploaded');
        Inventory(imgStorage, imgContainer); // Refresh the images after upload
    } catch (error) {
        console.error("Upload failed:", error);
        alert("Error uploading image.");
    }
};
