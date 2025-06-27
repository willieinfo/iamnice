document.addEventListener('DOMContentLoaded', function () {
    const divInventory = `
        <div class="Inventory" id="Inventory">
            <h4>Condominiums</h4>
            <div id="divCondominiums" class="image-section main"></div>

            <h4>Houses</h4>
            <div id="divHouses" class="image-section main"
                style="background-image: linear-gradient(to right, #ffff, gray) ">
            </div>

            <h4>Lots</h4>
            <div id="divLots" class="image-section main"></div>

            <h4>Warehouses</h4>
            <div id="divWarehouses" class="image-section main"
                style="background-image: linear-gradient(to right, #ffff, gray) ">
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
                        <source src="./inventory/Videos/ForSale1.mp4" type="video/mp4">
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
            <div class="showImage"></div>
            <textarea class="descript"></textarea>
        </div>
    `    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = divShowCase;
    document.body.appendChild(tempDiv.firstElementChild);


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
    const descriptText = showcase.querySelector('.descript');
    const titleBar = document.getElementById('propertyTitle');

    const allShowcases = document.querySelectorAll('.image-section.showcase');
    allShowcases.forEach((item) => {
        item.style.display = 'none';
    });    

    if (showcase.style.display === 'flex') {
        return; 
    }    

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '1000';
    document.body.appendChild(overlay)


    // titleBar.innerHTML = `${property.LOCATION.trim()} ${property.ITEMPRCE.trim()} `
    if (property.ITEMPRCE.trim()) {
        titleBar.innerHTML = `${property.LOCATION.trim()}    Asking Price: ${property.ITEMPRCE.trim()}`
     } else {
        titleBar.innerHTML = property.LOCATION.trim()
     }

    // Reset showImage container
    showImageContainer.innerHTML = '';

    // Render images in showImage div (FILENAME, FILENME2, FILENME3, FILENME4) for the specific record
    const images = [property.FILENAME, property.FILENME2, property.FILENME3, property.FILENME4,
        property.FILENME5, property.FILENME6, property.FILENME7, property.FILENME8];

    let imgCnt = 1
    images.forEach((imageSrc, index) => {
        if (imageSrc) {
            const img = document.createElement('img');
            imgCnt = index + 1

            img.src = imageSrc;
            showImageContainer.appendChild(img);
        } 
    });


    // Format the DESCRIPT field
    let formattedDescript = property.DESCRIPT.replace(/\\\\n/g, '\n');
    formattedDescript = formattedDescript.replace(/\n{2,}/g, '\n');
    descriptText.value = formattedDescript.trim();

    // Show the showcase div and center it in the viewport
    showcase.style.display = 'flex';

    const closeBtn = document.querySelector('.close-showcase');
    closeBtn.addEventListener('click', () => {
        showcase.style.display = 'none';
        overlay.style.display =  'none'
    });


}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

