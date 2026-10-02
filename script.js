/* ---------------------------------------
   CreativeSites
   Data-driven Gallery
--------------------------------------- */


/* ---------------------------------------
   State
--------------------------------------- */
let sites = [];
let currentSiteIndex = 0;
let currentImageIndex = 0;

/* ---------------------------------------
   Elements
--------------------------------------- */
const image = document.getElementById("site-image");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const infoButton = document.getElementById("info");
const randButton = document.getElementById("rand");
const gallery = document.querySelector(".gallery");
const infoPanel = document.getElementById("site-info");
const siteName = document.getElementById("site-name");
const siteDescription = document.getElementById("site-description");


/* ---------------------------------------
   Load Database
--------------------------------------- */
async function loadSites() {
    try {
        const response = await fetch("db.json");
        if (!response.ok) {
            throw new Error( `Could not load db.json: ${response.status}` );
        }

        const database = await response.json();
        sites = database.sites;
        if (!sites || sites.length === 0) {
            throw new Error( "No sites found in db.json");
        }

        currentSiteIndex = 0;
        currentImageIndex = 0;
        updateSite();

    } catch (error) {
        console.error("Failed to load CreativeSites database:", error);
    }
}


/* ---------------------------------------
   Update Everything
--------------------------------------- */
function updateSite() {
    const site = sites[currentSiteIndex];
    if (!site) { return; }

    currentImageIndex = 0;
    image.src = site.images[currentImageIndex];
    image.alt = `${site.name} website preview`;

    const siteName = document.getElementById("site-name");
    siteName.textContent = site.name;
    siteName.href = site.url;

    const siteDescription = document.getElementById("site-description");
    siteDescription.textContent = site.description;

    //infoPanel.classList.( "visible" );
}


/* ---------------------------------------
   Change Image
--------------------------------------- */
function showImage(index) {
    const site = sites[currentSiteIndex];
    if (!site || !site.images.length) return;
    if (index < 0) index = site.images.length - 1;
    if (index >= site.images.length) index = 0;
    currentImageIndex = index;
    image.classList.add("changing");
    
    setTimeout(() => {
        image.src = site.images[currentImageIndex];
        image.onload = () => { image.classList.remove( "changing" ); };
    }, 180);
}


/* ---------------------------------------
   Image Navigation
--------------------------------------- */
function nextImage() {
    showImage( currentImageIndex + 1 );
}
function previousImage() {
    showImage( currentImageIndex - 1 );
}


/* ---------------------------------------
   Next Random Site
--------------------------------------- */
function nextRandomSite() {
    if (sites.length <= 1) return;
    let randomIndex;
    do {
        randomIndex = Math.floor( Math.random() * sites.length );
    } while (
        randomIndex === currentSiteIndex
    );
    currentSiteIndex = randomIndex;
    updateSite();
}


/* ---------------------------------------
   Info Button
--------------------------------------- */
infoButton.addEventListener("click",(event) => {
        event.stopPropagation();
        infoPanel.classList.toggle( "visible" );
    }
);

randButton.addEventListener("click",(event) => {
        event.stopPropagation();
        nextRandomSite();
    }
);


/* ---------------------------------------
   Mouse Controls
--------------------------------------- */
nextButton.addEventListener("click", nextImage);
previousButton.addEventListener("click", previousImage);


/* ---------------------------------------
   Keyboard Controls
--------------------------------------- */
document.addEventListener( "keydown", (event) => {

        // Don't intercept keyboard navigation while clicking or interacting with a link.
        if (event.target.tagName === "A") return;
        if (event.key === "ArrowRight") nextImage();
        if (event.key === "ArrowLeft") previousImage();
        if (event.key.toLowerCase() === "i") infoPanel.classList.toggle("visible");
        if (event.key.toLowerCase() === "n") nextRandomSite();
        // if (event.key === "Escape") infoPanel.classList.remove( "visible" );
        // console.log(`${event.key}`);
    }
);


/* ---------------------------------------
   Touch / Swipe
--------------------------------------- */

let touchStartX = 0;
let touchEndX = 0;
document.addEventListener( "touchstart", (event) => {
        touchStartX = event.changedTouches[0].screenX;
    }, { passive: true }
);


document.addEventListener( "touchend", (event) => { 
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true }
);


function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) < 50) return; //Ignore small movements.
    if (swipeDistance < 0) nextImage();
    else previousImage();

}


/* ---------------------------------------
   Start Application
--------------------------------------- */
loadSites();