// ===== CART =====
let cart = [];

// ===== LOAD CATEGORIES =====
async function loadCategories() {
    const res = await fetch('https://openapi.programming-hero.com/api/categories');
    const data = await res.json();
    console.log('Categories data:', data);
    const categories = data.categories;

    const container = document.getElementById('categories');

    // All Trees button first
    const allBtn = document.createElement('button');
    allBtn.textContent = 'All Trees';
    allBtn.className = 'bg-green-700 text-white px-4 py-2 rounded text-left font-medium active-btn';
    allBtn.onclick = () => loadAllTrees(allBtn);
    container.appendChild(allBtn);

    // Category buttons
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat.category_name
        btn.className = 'bg-white border border-gray-300 px-4 py-2 rounded text-left hover:bg-green-100';
        btn.onclick = () => loadByCategory(cat.id, btn);
        container.appendChild(btn);
    });
}
// ===== LOAD ALL TREES =====
async function loadAllTrees(activeBtn) {
    setActiveButton(activeBtn);
    showSpinner();
    const res = await fetch('https://openapi.programming-hero.com/api/plants');
    const data = await res.json();
    displayCards(data.plants);
}

// ===== LOAD BY CATEGORY =====
async function loadByCategory(id, activeBtn) {
    setActiveButton(activeBtn);
    showSpinner();
    const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
    const data = await res.json();
    displayCards(data.plants);
}

// ===== DISPLAY CARDS =====
function displayCards(plants) {
    const container = document.getElementById('tree-cards');
    container.innerHTML = '';

    plants.slice(0, 6).forEach(plant => {
        const card = document.createElement('div');
        card.className = 'border rounded-lg overflow-hidden shadow-sm';
        card.innerHTML = `
      <img src="${plant.image}" alt="${plant.name || plant.plant_name}" class="w-full h-40 object-cover">
      <div class="p-3">
       <h4 class="font-bold text-gray-800 cursor-pointer hover:text-green-700" 
    onclick="loadPlantDetail('${plant.id}')">${plant.name || plant.name || plant.plant_name}</h4>
        <p class="text-gray-500 text-sm mt-1">${plant.short_description || ''}</p>
        <div class="flex justify-between items-center mt-2">
          <span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">${plant.category || ''}</span>
          <span class="font-bold text-gray-700">৳${plant.price}</span>
        </div>
        <button onclick="addToCart('${plant.name || plant.name || plant.plant_name}', ${plant.price})"
          class="mt-2 w-full bg-green-700 text-white py-1 rounded hover:bg-green-600">
          Add to Cart
        </button>
      </div>
    `;
        container.appendChild(card);
    });
}

// ===== ACTIVE BUTTON =====
function setActiveButton(activeBtn) {
    document.querySelectorAll('#categories button').forEach(btn => {
        btn.className = 'bg-white border border-gray-300 px-4 py-2 rounded text-left hover:bg-green-100';
    });
    activeBtn.className = 'bg-green-700 text-white px-4 py-2 rounded text-left font-medium';
}

// ===== SPINNER =====
function showSpinner() {
    const container = document.getElementById('tree-cards');
    container.innerHTML = '<div class="col-span-3 text-center py-8">Loading...</div>';
}

// ===== ADD TO CART =====
function addToCart(name, price) {
    cart.push({ name, price });
    updateCart();
}

// ===== UPDATE CART =====
function updateCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    container.innerHTML = '';

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'bg-green-50 rounded-lg p-2 flex justify-between items-center mb-2';
        div.innerHTML = `
            <div>
                <p class="font-semibold text-gray-800 text-sm">${item.name}</p>
                <p class="text-gray-500 text-xs">৳${item.price} × 1</p>
            </div>
            <button onclick="removeFromCart(${index})" 
                class="text-gray-400 hover:text-red-500 font-bold text-sm">✕</button>
        `;
        container.appendChild(div);
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalEl.textContent = '৳' + total;
}
// ===== REMOVE FROM CART =====
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// ===== PLANT DETAIL MODAL =====
async function loadPlantDetail(id) {
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
    const data = await res.json();
    const plant = data.plant;

    document.getElementById('modal-content').innerHTML = `
    <img src="${plant.image}" alt="${plant.name || plant.plant_name}" class="w-full h-48 object-cover rounded mb-4">
    <h2 class="text-xl font-bold text-gray-800 mb-2">${plant.name || plant.plant_name}</h2>
    <p class="text-gray-600 text-sm mb-2">${plant.short_description || ''}</p>
    <p class="text-gray-700"><strong>Category:</strong> ${plant.category || ''}</p>
    <p class="text-gray-700"><strong>Price:</strong> ৳${plant.price}</p>
    <p class="text-gray-700 mt-2">${plant.long_description || ''}</p>
  `;
    document.getElementById('modal').classList.remove('hidden');
}

// ===== CLOSE MODAL =====
function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

// ===== INIT =====
async function init() {
    await loadCategories();
    const firstBtn = document.querySelector('#categories button');
    if (firstBtn) loadAllTrees(firstBtn);
}
init();