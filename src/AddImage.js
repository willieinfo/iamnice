
// Your storage script
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { app } from "./firestore-config.js";

import { Inventory, addRecordList } from "./MainApp.js";
// import { MessageBox } from "./MessageBox.js";

const storage = getStorage(app);

export async function AddImage(imgFile,imgStorage, imgContainer) {
    const storageRef = ref(storage, `${imgStorage}/${imgFile.name}`);
    
    try {
        await uploadBytes(storageRef, imgFile);
        console.log("Image uploaded successfully!")
        // MessageBox("Image uploaded successfully!",'Ok','Uploaded');
        //Inventory(imgStorage, imgContainer); // Refresh the images after upload

        const url_site = await getDownloadURL(storageRef);
        const categnme=imgContainer.split('-')[0]
        const currdate = new Date();

        addRecordList(
            {
                categnme: categnme,
                maindesc: imgFile.name,
                url_site: url_site,
                sourcedb: 'Firestore',
                datereco: currdate,
            }
        )

    } catch (error) {
        console.error("Upload failed:", error);
        alert("Error uploading image.");
    }
};

