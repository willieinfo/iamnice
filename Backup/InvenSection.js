
    import { AddImage } from './DisplayImage.js';
    
    // This json data will eventually come from Firebase
    const divCategory = [
        { "category": "Condominiums" },
        { "category": "Townhouse" },
        { "category": "Houses" }
    ];

    // Build the HTML header and categories
    let invCategories = `
        <div class="sectionHeader">
            <h2>Inventory</h2>
        </div>`;

    divCategory.forEach((item, ctr) => {
        const category = item.category;
        invCategories += `
            <div class="container">
                <h3>${category}</h3>
                <div id="${category}-container"></div>
                <label for="fileInput${ctr + 1}" class="file-upload-label">
                    Add Image
                    <input type="file" id="fileInput${ctr + 1}" accept="image/jpeg, image/png, image/bmp" />
                </label>
            </div>`;
    });

    // Append the generated HTML to the inventory container
    document.getElementById('Inventory').innerHTML = invCategories;

    function getImageFile(fileInput, containerId) {
        fileInput.addEventListener('change', function() {
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

            AddImage(file, 'images/' + containerId, containerId + '-container');
        });
    }

    document.addEventListener("DOMContentLoaded", function() {
        divCategory.forEach((item, ctr) => {
            const fileInput = document.getElementById(`fileInput${ctr + 1}`);
            getImageFile(fileInput, item.category);
        });
    });
