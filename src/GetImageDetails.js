import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";
// import { app } from "./firestore-config.js";
import { app } from "./firebase-config.js";
// import { collection, addDoc, getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Function to use to get image details from firebase
export async function getImageDetails(imgStorage) {
    const storage = getStorage(app);
    const imageRef = ref(storage, imgStorage);

    try {
        const url = await getDownloadURL(imageRef);
        const filename = imageRef.name; // Extracts the filename
        const location = imageRef.fullPath; // Full storage path

        console.log("Image URL:", url);
        console.log("Filename:", filename);
        console.log("Location:", location);

        return { url, filename, location }; // Return an object with all details
    } catch (error) {
        console.error("Error getting image details:", error);
        return null;
    }
}

//getImageDetails('images/Condominiums/condominium1.jpg')

// Example usage:
// const imgStorage = 'images/Townhouse/townhouse1.jpg'; // Specify the path
// const imageDetails = await getImageDetails(imgStorage);
// console.log(imageDetails); // Will log URL, filename, and location
