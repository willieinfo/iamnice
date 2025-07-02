document.addEventListener('DOMContentLoaded', function () {
    const divInventory = `
        <div class="Inventory" id="Inventory">
            <div>
                <h4>Condominiums</h4>
                <div id="divCondominiums" class="image-section main"></div>
            </div>

            <div style="background-image: linear-gradient(to right, #ffff, gray) ">
                <h4>Houses</h4>
                <div id="divHouses" class="image-section main"></div>
            </div>

            <div>
                <h4>Lots</h4>
                <div id="divLots" class="image-section main"></div>
            </div>

            <div style="background-image: linear-gradient(to right, #ffff, gray) ">
                <h4>Warehouses</h4>
                <div id="divWarehouses" class="image-section main""></div>
            </div>

            <h4></h4>
            <div id="divVideos">
                <div class="showVid">
                    <video autoplay muted loop>
                        <source src="./inventory/Videos/ForSale1.mp4" type="video/mp4">
                        <p>It seems your browser does not support videos. <a href="./Images/video1.mp4" download>Download the video here</a>.</p>
                    </video>
                </div>
                <div class="showVid">
                    <video autoplay muted loop>
                        <source src="./inventory/Videos/ForSale2.mp4" type="video/mp4">
                        <p>It seems your browser does not support videos. <a href="./Images/video1.mp4" download>Download the video here</a>.</p>
                    </video>
                </div>
                <div class="showVid">
                    <video autoplay muted loop>
                        <source src="./inventory/Videos/ForSale3.mp4" type="video/mp4">
                        <p>It seems your browser does not support videos. <a href="./Images/video1.mp4" download>Download the video here</a>.</p>
                    </video>
                </div>
            </div>
        </div>
    `;


    document.getElementById("InvenList").innerHTML = divInventory;

    const divShowCase = `
        <div class="image-section showcase" style="display: none">
            <div class="titleBar-showcase">
                <span id="propertyTitle"></span>
                <button class="close-showcase">X</button>
            </div>
            <div class="imageDesc">
                <span class=subTitle></span>
                <p class="descript"></p>
            </div>
            <div class="showImage"></div>
        </div>
    `    

    const divShowPict = `
        <div class="image-showpict" style="display: none">
            <div class="titleBar-showpict">
                <span id="showpictTitle"></span>
                <button class="close-showpict">X</button>
            </div>
            <div class="showPict"></div>
        </div>
    `    

    const tempDiv1 = document.createElement('div');
    tempDiv1.innerHTML = divShowCase;
    const tempDiv2 = document.createElement('div');
    tempDiv2.innerHTML = divShowPict;

    document.body.appendChild(tempDiv1.firstElementChild);
    document.body.appendChild(tempDiv2.firstElementChild);


    // Fetch the data from the JSON file
    fetch('./inventory/DB_PROPERTY.json')
        .then(response => response.json())
        .then(data => renderInventory(data))
        .catch(err => console.error('Error fetching JSON:', err));
});

function renderInventory(data) {
    data.forEach(property => {
        const category = property.CATEGORY.toLowerCase(); // Convert category to lowercase
        const divCategory = document.getElementById(`div${capitalizeFirstLetter(category)}`);

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('imgContainer')
        const caption = document.createElement('div');
        caption.classList.add('caption')

        divCategory.appendChild(imgContainer);
        imgContainer.appendChild(caption);
        imgContainer.classList.add('imgContainer')

        // Set up the first image (FILENAME)
        const img = document.createElement('img');
        img.src = property.FILENAME;
        img.alt = property.CAPTION_;
        imgContainer.appendChild(img);
        caption.innerText = `${property.LOCATION.trim()} \n ${property.CAPTION_}`;

    
        // Handle click event on imgContainer for the specific property
        imgContainer.addEventListener('click', function () {
            showShowcase(property);
        });

    });
}

function showShowcase(property) {
    const showcase = document.querySelector('.image-section.showcase');
    const showImageContainer = showcase.querySelector('.showImage');
    const titleBar = document.getElementById('propertyTitle');
    const subTitle = showcase.querySelector('.subTitle');
    const descriptText = showcase.querySelector('.descript');
    const titleBarPict = document.getElementById('showpictTitle');
    const imageShowPict = document.querySelector('.image-showpict');
    const allShowcases = document.querySelectorAll('.image-section.showcase');
    
    allShowcases.forEach((item) => {
        item.style.display = 'none';
    });    

    if (showcase.style.display === 'flex') {
        return; 
    }

    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '1000';
    document.body.appendChild(overlay);

    titleBar.innerHTML = property.LOCATION.trim()
    subTitle.innerHTML = `Asking Price: ${property.ITEMPRCE.trim()}`

    // Reset showImage container
    showImageContainer.innerHTML = '';

    // Render images in showImage div (FILENAME, FILENME2, FILENME3, FILENME4) for the specific record
    const images = [property.FILENAME, property.FILENME2, property.FILENME3, property.FILENME4,
             property.FILENME5,  property.FILENME6,  property.FILENME7,  property.FILENME8];

    document.getElementById('loadingIndicator').style.display = 'flex';

    images.forEach((imageSrc, index) => {
        if (imageSrc) {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.classList.add('imgSmallBox');
            img.addEventListener('click', () => {
                // Show clicked image in imageShowPict
                imageShowPict.style.display = 'flex'; 
                let showPict = imageShowPict.querySelector('.showPict');
                showPict.innerHTML = ''; // Clear the previous image
                const newImg = document.createElement('img');
                newImg.style.minHeight = '700px';
                newImg.src = imageSrc;  
                newImg.objectfit = 'cover';
                showPict.appendChild(newImg);

                titleBarPict.style.top = '0';
                if (property.ITEMPRCE.trim()) {
                    titleBarPict.innerHTML = `${property.LOCATION.trim()} Asking Price: ${property.ITEMPRCE.trim()} Image ${index + 1}`;
                } else {
                    titleBarPict.innerHTML = `${property.LOCATION.trim()} Image ${index + 1}`;
                }

            });
            showImageContainer.appendChild(img);
        }
    });
    document.getElementById('loadingIndicator').style.display = 'none';

    // Format the DESCRIPT field
    let formattedDescript = property.DESCRIPT.replace(/\\\\n/g, '\n');
    formattedDescript = formattedDescript.replace(/\n{2,}/g, '\n');
    descriptText.innerText = formattedDescript.trim();

    // Show the showcase div and center it in the viewport
    showcase.style.display = 'flex';

    // Close the showcase when the close button is clicked
    const closeBtn = document.querySelector('.close-showcase');
    closeBtn.addEventListener('click', () => {
        showcase.style.display = 'none';
        overlay.style.display = 'none';
    });


    // Close the image preview when the close button is clicked
    const closePict = document.querySelector('.close-showpict');
    closePict.addEventListener('click', () => {
        imageShowPict.style.display = 'none';  // Corrected the line to hide imageShowPict
    });
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

