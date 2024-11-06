
// Your storage script
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { app } from "./firestore-config.js";
import { collection, addDoc, getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

import { Inventory } from "./MainApp.js";
import { MessageBox } from "./MessageBox.js";

const db = getFirestore(app);
const storage = getStorage(app);

export async function AddImage(imgFile,imgStorage, imgContainer) {
    const storageRef = ref(storage, `${imgStorage}/${imgFile.name}`);
    
    try {
        await uploadBytes(storageRef, imgFile);
        MessageBox("Image uploaded successfully!",'Ok','Uploaded');
        Inventory(imgStorage, imgContainer); // Refresh the images after upload

        const url_site = await getDownloadURL(storageRef);
        console.log(url_site)
        const categnme=imgContainer.split('-')[0]
        console.log(categnme)
        console.log(imgFile.name)

        addDoc(collection(db, 'Listings'), {
            categnme: categnme,
            maindesc: imgFile.name,
            url_site: url_site,
            source__: 'Firestore'
        })


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
