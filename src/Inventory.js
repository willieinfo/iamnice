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
                <div id="divWarehouses" class="image-section main"></div>
            </div>

            <h4></h4>
            <div id="divVideos">
                <div class="showVid">
                    <video autoplay muted loop>
                        <source src="./inventory/Videos/ForSale1.mp4" type="video/mp4">
                    </video>
                </div>
                <div class="showVid">
                    <video autoplay muted loop>
                        <source src="./inventory/Videos/ForSale4.mp4" type="video/mp4">
                    </video>
                </div>
                <div class="showVid">
                    <video autoplay muted loop>
                        <source src="./inventory/Videos/ForSale2.mp4" type="video/mp4">
                    </video>
                </div>
            </div>
        </div>
    `;


    document.getElementById("InvenList").innerHTML = divInventory;
                // <div id="contactMe">Please call 0917-828-3887 or <span id="gotoEmail">email e.estrada@remaxcapital.ph</span></div>

    const divShowCase = `
        <div class="image-section showcase" style="display: none">
            <div class="titleBar-showcase">
                <span id="propertyTitle"></span>
                <div id="contactMe">Interested? Please call 0917-828-3887 or <span id="gotoEmail">email e.estrada@remaxcapital.ph</span></div>
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

    const divShowVideo = `
        <div class="enlargeVid" style="display: none">
            <div class="titleBar-showVid">
                <span id="showVidTitle"></span>
                <button class="close-video">X</button>
            </div>
            <div class="videoShowcase">
                <video autoplay muted loop>
                    <source type="video/mp4">
                </video>
            </div>
        </div>
    `    
    const tempDiv1 = document.createElement('div');
    tempDiv1.innerHTML = divShowCase;
    const tempDiv2 = document.createElement('div');
    tempDiv2.innerHTML = divShowPict;
    const tempDiv3 = document.createElement('div');
    tempDiv3.innerHTML = divShowVideo;

    document.body.appendChild(tempDiv1.firstElementChild);
    document.body.appendChild(tempDiv2.firstElementChild);
    document.body.appendChild(tempDiv3.firstElementChild);


    // Fetch once
    fetch('./inventory/DB_PROPERTY.json')
        .then(response => response.json())
        .then(data => {
            globalData = data;
            renderInventory(globalData); // initial load
        });

});


export function renderInventory(data, min = 0, max = Infinity) {

    // document.querySelectorAll('.image-section.main').forEach(div => div.innerHTML = '');
    [
      'divCondominiums',
      'divHouses',
      'divLots',
      'divWarehouses'
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '';
    });    

    let invCounter=0
    let firstMatchElement = null; // 👈 track first match
    let hasFilter = min > 0

    data.forEach(property => {
        const category = property.CATEGORY.toLowerCase(); // Convert category to lowercase
        const divCategory = document.getElementById(`div${capitalizeFirstLetter(category)}`);

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('imgContainer')
        const caption = document.createElement('div');
        caption.classList.add('caption')

        divCategory.appendChild(imgContainer);
        imgContainer.appendChild(caption);

        // Set up the first image (FILENAME)
        const img = document.createElement('img');
        img.src = property.FILENAME;
        img.alt = property.CAPTION_;
        imgContainer.appendChild(img);
        caption.innerText = `${property.LOCATION.trim()} \n ${property.CAPTION_.trim()} \n ${property.ITEMPRCE.trim()}`;

        const isMatch = property.ASKPRICE >= min && property.ASKPRICE <= max;
        if (hasFilter) {
            if (isMatch) {
                // imgContainer.classList.add('imgMatch');
        	    imgContainer.classList.add('imgHighlighter')

                if (!firstMatchElement) {
                    firstMatchElement = imgContainer;
                }

                invCounter++;
            } else {
                // imgContainer.classList.add('imgDim');
            }
        }


        if (property.BADGEMSG) {
            const badge = document.createElement('span')
                // badge.className = 'message-badge';
                badge.style.backgroundColor = '#ff4d4f';
                badge.style.color = '#fff';
                badge.style.borderRadius = '20px';
                badge.style.padding = '2px 6px';
                badge.style.fontSize = '12px';
                badge.style.position = 'absolute';
                badge.style.top = '-5px';
                badge.style.right = '-5px';
                badge.style.zIndex = '10';
                badge.style.boxShadow = '2px 2px 6px rgba(0, 0, 0, 0.2)';
                badge.textContent = property.BADGEMSG.trim()

                if (property.BADGEMSG.trim()==='SOLD' || property.BADGEMSG.trim()==='ON HOLD') {
                    badge.style.backgroundColor = 'rgb(0,0,255)';
                    badge.style.transform = 'rotate(-30deg)';  
                    badge.style.transformOrigin = 'center';
                    badge.style.top = '-12px';  
                    badge.style.right = '-5px'; 
                }
                imgContainer.appendChild(badge);
        }

        // Handle click event on imgContainer for the specific property
        imgContainer.addEventListener('click', function () {
            showShowcase(property);
        });

    });

    if (invCounter > 0) {
        showNotification( `${invCounter} properties highlighted` ) 
    } else {
        showNotification( `No records found` ) 
    }

    // ✅ Scroll AFTER everything is rendered
   if (firstMatchElement) {
        firstMatchElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center' // or 'start'
        });
    }
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
    const images = [
        property.FILENAME,
        property.FILENME2,
        property.FILENME3,
        property.FILENME4,
        property.FILENME5,
        property.FILENME6,
        property.FILENME7,
        property.FILENME8
    ];


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
                newImg.style.objectFit = 'cover';
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

    const gotoEmail = document.getElementById('gotoEmail');
    gotoEmail.addEventListener('click', () => {
        showcase.style.display = 'none';
        overlay.style.display = 'none';

        emailMessage(property.LOCATION.trim())
        // scroll to #Contact
        const contactDiv = document.getElementById('Contact')

        setTimeout(() => {
            contactDiv.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);        
      
    });


    // Close the image preview when the close button is clicked
    const closePict = document.querySelector('.close-showpict');
    closePict.addEventListener('click', () => {
        imageShowPict.style.display = 'none';  // Corrected the line to hide imageShowPict
    });

}

function emailMessage(msg) {
    const textBody = document.getElementById('message_')
    let emailMsg = `Hello Eunice, I am interested to see ${msg} property`
    textBody.value = emailMsg
    textBody.focus()
 }

document.querySelectorAll('.prceRnge').forEach(el => {
    el.addEventListener('click', function () {
        const rangeId = this.id; // e.g. prceRnge10_15

        document.querySelectorAll('.prceRnge').forEach(btn => {
            btn.classList.remove('active');
        });

        this.classList.add('active');

        let min = 0, max = Infinity;

        if (rangeId === 'prceRnge10_15') {
            min = 10; max = 15;
        } else if (rangeId === 'prceRnge16_25') {
            min = 16; max = 25;
        } else if (rangeId === 'prceRnge26_50') {
            min = 26; max = 50;
        } else if (rangeId === 'prceRnge51_Up') {
            min = 51; max = Infinity;
        }
        renderInventory(globalData, min, max); // pass range
    });
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

document.addEventListener('DOMContentLoaded', function () {

    document.querySelectorAll(".showVid").forEach((element, index) => {
        element.addEventListener('click', () => {
            // Get the video source from the clicked video
            const videoSrc = element.querySelector("video source").getAttribute("src");
            
            // Show and animate the enlargeVid
            const enlargeVid = document.querySelector(".enlargeVid");
            enlargeVid.style.display = "block";  // Make the enlargeVid visible
            enlargeVid.classList.add("active"); // Trigger the animation
            
            // Set the title dynamically (this could be adjusted if you have specific titles)
            document.getElementById("showVidTitle").textContent = "Video #" + (index + 1);
            
            // Set the video source inside .videoShowcase
            const showcaseVideo = enlargeVid.querySelector("video");
            showcaseVideo.querySelector("source").setAttribute("src", videoSrc);
            showcaseVideo.load();  // Reload video to play the new source
            showcaseVideo.play();  // Start playing the video
        });
    });


    // Close button functionality
    document.querySelector(".close-video").addEventListener("click", () => {
        const enlargeVid = document.querySelector(".enlargeVid");
        enlargeVid.classList.remove("active");  // Animate back to 0 size
        setTimeout(() => {
            enlargeVid.style.display = "none";  // Hide the enlargeVid after animation
        }, 500); 
    });

})




