import { setDoc, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { db } from "./firestore-config.js";
// import { MessageBox } from "./MessageBox.js";

// Variable to store the previous theme
let previousTheme = {
    mainBgColor: getComputedStyle(document.documentElement).getPropertyValue('--main-bg-color'),
    secondBgColor: getComputedStyle(document.documentElement).getPropertyValue('--second-bg-color'),
    darkerBgColor: getComputedStyle(document.documentElement).getPropertyValue('--darker-bg-color')
};

// Event listener for Cancel button
document.getElementById('cancelBtn').addEventListener('click', () => {
    // Revert to the previous theme
    document.documentElement.style.setProperty('--main-bg-color', previousTheme.mainBgColor);
    document.documentElement.style.setProperty('--second-bg-color', previousTheme.secondBgColor);
    document.documentElement.style.setProperty('--darker-bg-color', previousTheme.darkerBgColor);

    console.log("Theme reverted to previous theme");
});

// Event listener for the save button
document.getElementById('saveBtn').addEventListener('click', async () => {
    // Capture the current theme colors
    const currentTheme = {
        mainBgColor: getComputedStyle(document.documentElement).getPropertyValue('--main-bg-color').trim(),
        secondBgColor: getComputedStyle(document.documentElement).getPropertyValue('--second-bg-color').trim(),
        darkerBgColor: getComputedStyle(document.documentElement).getPropertyValue('--darker-bg-color').trim()
    };

    // Save the theme colors to Firestore
    try {
        const docRef = doc(db, 'UserColor', 'colorSettings'); // Reference to the specific document
        await setDoc(docRef, currentTheme); // Save the color data

        showNotification("Theme saved successfully!");
        // MessageBox("Theme saved successfully!",'Ok','Color Theme');
    } catch (error) {
        console.error("Error saving theme: ", error);
    }
});    


// Event listeners for each color div
document.getElementById('blueDiv').addEventListener('click', () => changeTheme('blue'));
document.getElementById('greenDiv').addEventListener('click', () => changeTheme('green'));
document.getElementById('violetDiv').addEventListener('click', () => changeTheme('violet'));
document.getElementById('maroonDiv').addEventListener('click', () => changeTheme('maroon'));
document.getElementById('redDiv').addEventListener('click', () => changeTheme('red'));
document.getElementById('tomatoDiv').addEventListener('click', () => changeTheme('tomato'));

// Function to change the theme based on the selected color
function changeTheme(color) {
    // Save the current theme before changing it
    previousTheme.mainBgColor = getComputedStyle(document.documentElement).getPropertyValue('--main-bg-color');
    previousTheme.secondBgColor = getComputedStyle(document.documentElement).getPropertyValue('--second-bg-color');
    previousTheme.darkerBgColor = getComputedStyle(document.documentElement).getPropertyValue('--darker-bg-color');

    switch (color) {
        case 'blue':
            document.documentElement.style.setProperty('--main-bg-color', 'rgb(0, 64, 128)');
            document.documentElement.style.setProperty('--second-bg-color', 'rgb(59, 89, 152)');
            document.documentElement.style.setProperty('--darker-bg-color', 'rgb(0, 0, 105)');
            break;
        case 'green':
            document.documentElement.style.setProperty('--main-bg-color', 'rgb(0, 64, 64)');
            document.documentElement.style.setProperty('--second-bg-color', 'rgb(34, 139, 34)');
            document.documentElement.style.setProperty('--darker-bg-color', 'rgb(0, 100, 0)');
            break;
        case 'violet':
            document.documentElement.style.setProperty('--main-bg-color', 'rgb(64, 0, 128)');
            document.documentElement.style.setProperty('--second-bg-color', 'rgb(138, 43, 226)');
            document.documentElement.style.setProperty('--darker-bg-color', 'rgb(75, 0, 130)');
            break;
        case 'maroon':
            document.documentElement.style.setProperty('--main-bg-color', 'rgb(128, 0, 64)');
            document.documentElement.style.setProperty('--second-bg-color', 'rgb(176, 0, 0)');
            document.documentElement.style.setProperty('--darker-bg-color', 'rgb(98, 0, 0)');
            break;
        case 'red':
            document.documentElement.style.setProperty('--main-bg-color', 'rgb(179, 0, 0)');
            document.documentElement.style.setProperty('--second-bg-color', 'rgb(220, 20, 60)');
            document.documentElement.style.setProperty('--darker-bg-color', 'rgb(139, 0, 0)');
            break;
        case 'tomato':
            document.documentElement.style.setProperty('--main-bg-color', 'rgb(255, 99, 71)');
            document.documentElement.style.setProperty('--second-bg-color', 'rgb(255, 69, 0)');
            document.documentElement.style.setProperty('--darker-bg-color', 'rgb(255, 0, 0)');
            break;
        default:
            // Default case to reset to a basic theme or handle an error if needed
            document.documentElement.style.setProperty('--main-bg-color', 'rgb(255, 255, 255)');
            document.documentElement.style.setProperty('--second-bg-color', 'rgb(240, 240, 240)');
            document.documentElement.style.setProperty('--darker-bg-color', 'rgb(200, 200, 200)');
            break;
    }
}

   
export async function setUserColor() {
    const docRef = doc(db, 'UserColor', 'colorSettings');  // Add a unique ID to the document reference
    const docSnap = await getDoc(docRef);  // Fetch the document using docRef

    if (docSnap.exists()) {
        const data = docSnap.data();
        document.documentElement.style.setProperty('--main-bg-color', data.mainBgColor);
        document.documentElement.style.setProperty('--second-bg-color', data.secondBgColor);
        document.documentElement.style.setProperty('--darker-bg-color', data.darkerBgColor);
        return data;  // Return the document data
    } else {
        const colorData = {
            mainBgColor: 'rgb(0, 64, 128)',
            secondBgColor: 'rgb(59, 89, 152)',
            darkerBgColor: 'rgb(0, 0, 139)',
        };
        await setDoc(docRef, colorData);  // Use setDoc instead of addDoc for specific document reference
        document.documentElement.style.setProperty('--main-bg-color', colorData.mainBgColor);
        document.documentElement.style.setProperty('--second-bg-color', colorData.secondBgColor);
        document.documentElement.style.setProperty('--darker-bg-color', colorData.darkerBgColor);
    }
}

        // async function applyColorsAndShowContent() {
            // Apply user color preferences
            await setUserColor();

            // Hide the loading screen once the colors are applied
            document.getElementById('loadingIndicator').style.display = 'none';
            document.getElementById('loading-overlay').style.display = 'none';

            // Once colors are applied, make the body visible
            document.getElementById('mySidenav').style.visibility = 'visible';
            document.querySelector('.mainWrapper').style.visibility = 'visible';
        // }

        // Run the function once the DOM is fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            applyColorsAndShowContent();
        });
