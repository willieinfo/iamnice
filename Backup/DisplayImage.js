import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";

// import { app } from "./firestore-config.js";
import { app } from "../firebase-config.js";
import { Inventory } from "./MainApp.js";
import { MessageBox } from "./MessageBox.js";

const storage = getStorage(app);

export async function AddImage(imgFile,imgStorage, imgContainer) {
    // This is where firebase get into play
    // imgStorage = is where the image is saved
    const storageRef = ref(storage, `${imgStorage}/${imgFile.name}`);
    try {
        await uploadBytes(storageRef, imgFile);
        MessageBox("Image uploaded successfully!",'Ok','Uploaded');
        Inventory(imgStorage, imgContainer); // Refresh the images after upload
    } catch (error) {
        console.error("Upload failed:", error);
        alert("Error uploading image.");
    }
};

    // const reader = new FileReader();
    // reader.onload = (event) => {
    //     const inventoryImg = document.createElement('img');
    //     inventoryImg.src = event.target.result;
    //     document.getElementById(imgContainer).appendChild(inventoryImg);
    // };
    // reader.readAsDataURL(file);            
