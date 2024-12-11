const searchInput = document.getElementById("search");
const cardsContainer = document.getElementById("cards-container");
const filtersOffcanvas = document.querySelectorAll(".form-check-input");
let seedsData = [];

// Fetch seeds.json and initialize
fetch('data/seeds.json')
    .then(response => response.json())
    .then(data => {
        seedsData = [data]; // Assuming seeds.json is an array of seed objects
        renderCards(seedsData);
    });

// Event: Search input
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredSeeds = seedsData.filter(seed => seed.name.toLowerCase().includes(searchTerm));
    renderCards(filteredSeeds);
});

// Event: Filter changes
filtersOffcanvas.forEach(filter => {
    filter.addEventListener("change", applyFilters);
});

// Apply Filters
function applyFilters() {
    const selectedFilters = Array.from(filtersOffcanvas)
        .filter(filter => filter.checked)
        .map(filter => filter.value);

    const filteredSeeds = seedsData.filter(seed => {
        return selectedFilters.every(filter => {
            return Object.values(seed.data).flat().includes(filter);
        });
    });

    renderCards(filteredSeeds);
}

// Render Cards
function renderCards(seeds) {
    cardsContainer.innerHTML = seeds.map(seed => `
        <div class="col-md-4">
            <div class="card" style="border-radius: 10px; overflow: hidden;">
                <img src="assets/images/${seed.imgs[0].path}" class="card-img-top" alt="${seed.imgs[0].name}">
                <div class="d-flex align-items-center p-3">
                    <div>
                        <h6 class="mb-0">${seed.name}</h6>
                        <small class="text-muted">${seed.data.vers} ${seed.data.edtn}</small>
                    </div>
                    <button class="btn btn-outline-success btn-sm ms-3" onclick="showDetails(${JSON.stringify(seed).replace(/"/g, '&quot;')})">
                        View
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

// Show Details
function showDetails(seed) {
    document.getElementById("seed_name").textContent = seed.name;
    document.getElementById("seed_desc").textContent = seed.desc;
    document.getElementById("seed_spnb").textContent = seed.data.spnb || "N/A";
    document.getElementById("seed_spnl").textContent = seed.data.spnl || "N/A";
    document.getElementById("seed_vers").textContent = seed.data.vers || "N/A";
    document.getElementById("seed_edtn").textContent = seed.data.edtn || "N/A";
    document.getElementById("seed_best").textContent = seed.data.best || "N/A";
    document.getElementById("seed_surb").textContent = (seed.data.surb || []).join(", ") || "N/A";
    document.getElementById("seed_hstr").textContent = (seed.data.hstr || []).join(", ") || "N/A";
    document.getElementById("seed_estr").textContent = (seed.data.estr || []).join(", ") || "N/A";
    document.getElementById("seed_imgs").innerHTML = seed.imgs.map(img => `
        <div>
            <img src="assets/images/${img.path}" class="img-fluid" alt="${img.name}">
            <p>${img.name}</p>
        </div>
    `).join("");
}
