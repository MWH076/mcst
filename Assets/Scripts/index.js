// Fetch seeds data
async function fetchSeeds() {
    const response = await fetch('Data/seeds.json');
    return await response.json();
}

// Render seed cards
function renderSeedCards(seeds) {
    const container = document.querySelector('.row.g-3');
    container.innerHTML = '';
    seeds.forEach(seed => {
        const card = document.createElement('div');
        card.classList.add('col-md-4');
        card.innerHTML = `
            <div class="card" style="border-radius: 10px; overflow: hidden;">
                <img src="${seed.imgs[0].path}" class="card-img-top" alt="${seed.imgs[0].name}">
                <div class="d-flex align-items-center p-3">
                    <img src="https://via.placeholder.com/50" class="rounded me-3" alt="Profile Image">
                    <div class="d-flex justify-content-between align-items-center w-100">
                        <div>
                            <h6 class="mb-0">${seed.name}</h6>
                            <small class="text-muted">${seed.data.vers} ${seed.data.edtn}</small>
                        </div>
                        <button class="btn btn-outline-success btn-sm ms-3" data-bs-toggle="offcanvas" data-bs-target="#details" onclick="viewSeedDetails('${seed.name}')">
                            View
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Search seeds by name
function searchSeeds(seeds, query) {
    return seeds.filter(seed => seed.name.toLowerCase().includes(query.toLowerCase()));
}

// Filter seeds
function filterSeeds(seeds) {
    const filters = {};
    document.querySelectorAll('.form-check-input:checked').forEach(input => {
        filters[input.value] = true;
    });

    return seeds.filter(seed => {
        for (let key in filters) {
            if (
                !(
                    seed.data.spnb === key ||
                    seed.data.vers === key ||
                    seed.data.edtn === key ||
                    seed.data.surb.includes(key) ||
                    seed.data.estr.includes(key) ||
                    seed.data.hstr.includes(key) ||
                    seed.data.best === key
                )
            ) {
                return false;
            }
        }
        return true;
    });
}

// View seed details
function viewSeedDetails(seedName) {
    fetchSeeds().then(seeds => {
        const seed = seeds.find(s => s.name === seedName);
        document.getElementById('seed_name').innerText = seed.name;
        document.getElementById('seed_desc').innerText = seed.desc;
        document.getElementById('seed_seed').innerText = seed.seed;
        document.getElementById('seed_spnc').innerText = seed.data.spnl;
        document.getElementById('seed_spnb').innerText = seed.data.spnb;
        document.getElementById('seed_edtn').innerText = seed.data.edtn;
        document.getElementById('seed_vers').innerText = seed.data.vers;
        document.getElementById('seed_surb').innerText = seed.data.surb.join(', ');
        document.getElementById('seed_estr').innerText = seed.data.estr.join(', ');
        document.getElementById('seed_hstr').innerText = seed.data.hstr.join(', ');
        document.getElementById('seed_best').innerText = seed.data.best;

        const imagesContainer = document.getElementById('seed_imgs');
        imagesContainer.innerHTML = '';
        seed.imgs.forEach(img => {
            const imgElement = document.createElement('img');
            imgElement.src = `${img.path}`;
            imgElement.alt = img.name;
            imgElement.style = 'width: 100%; margin-top: 10px;';
            imagesContainer.appendChild(imgElement);
        });
    });
}

// Event listeners
fetchSeeds().then(seeds => {
    renderSeedCards(seeds);

    document.getElementById('search').addEventListener('input', event => {
        const query = event.target.value;
        const filteredSeeds = searchSeeds(seeds, query);
        renderSeedCards(filteredSeeds);
    });

    document.querySelectorAll('.form-check-input').forEach(input => {
        input.addEventListener('change', () => {
            const filteredSeeds = filterSeeds(seeds);
            renderSeedCards(filteredSeeds);
        });
    });
});

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});