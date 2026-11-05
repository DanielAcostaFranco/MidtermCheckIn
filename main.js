const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const cardsResults = document.getElementById("cards_results");

searchButton.addEventListener('click', getDataPlaces)

async function getDataPlaces() {
    const id = searchInput.value;
    console.log(id)
    const url = `https://api.inaturalist.org/v1/places/autocomplete?q=${id}`
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error (`Response status: ${response.status}`);
        }
        const result = await response.json();
        const places = result.results
        console.log(places);
        console.log(places[0]);

        places.forEach((place) => {
            const card = document.createElement('article')
            card.classList.add("place-card");
            const name = document.createElement("a")
            name.textContent = place.display_name;
            card.append(name);
            results.append(card);
            const placeId = place.id;
            console.log(placeId)
            name.href = `https://api.inaturalist.org/v1/observations?place_id=${placeId}`
            name.addEventListener("click", (event) => {
                event.preventDefault();
                getPictures(placeId);
            });
        })

    } catch(error) {
        console.log(error)
    }
}

async function getPictures(placeId) {
    const url = `https://api.inaturalist.org/v1/observations?place_id=${placeId}`;
    const response = await fetch(url);
    

    if (!response.ok) {
        throw new Error (`Response status: ${response.status}`);
    }

    const result = await response.json();
    const observations = result.results;

    observations.forEach((observation) => {
        const imageUrl = observation.taxon?.default_photo?.url;
        if (!imageUrl) {
            return;
        }

        const imageCard = document.createElement('article');
        imageCard.classList.add("image-card");
        const image = document.createElement('img');
        image.src = imageUrl;
        const title = observation.species_guess || "iNaturalist observation";
        image.alt = title;
        const imageTitle = document.createElement("h2");
        imageTitle.textContent = title;
        imageCard.append(image);
        imageCard.append(imageTitle);
        cardsResults.append(imageCard);
    });
}
