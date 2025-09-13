document.addEventListener("DOMContentLoaded", () => {
  const categoryList = document.getElementById("plant-category-list");
  const cardContainer = document.getElementById("plant-card-container");
  const spinner = document.getElementById("plant-spinner");
  const modalContainer = document.getElementById("plant-details-container");

  let allPlants = [];

  const manageSpinner = (status) => {
    spinner.classList.toggle("hidden", !status);
    cardContainer.classList.toggle("hidden", status);
  };

  const loadCategories = async () => {
    try {
      const res = await fetch("https://openapi.programming-hero.com/api/categories");
      const data = await res.json();
      const categories = data.categories || [];

      categoryList.innerHTML = "";

      const allLi = document.createElement("li");
      allLi.innerHTML = `<button class="w-full text-left px-4 py-2 rounded-lg bg-green-700 text-white">All Trees</button>`;
      allLi.querySelector("button").addEventListener("click", () => {
        document.querySelectorAll("#plant-category-list li button").forEach(b => b.classList.remove("bg-green-700", "text-white"));
        allLi.querySelector("button").classList.add("bg-green-700", "text-white");
        displayPlantCards(allPlants);
      });
      categoryList.appendChild(allLi);

      categories.forEach((cat) => {
        if (!cat || !cat.name || !cat.id) return;
        const li = document.createElement("li");
        li.innerHTML = `<button class="w-full text-left px-4 py-2 rounded-lg hover:bg-green-100">${cat.name}</button>`;
        li.querySelector("button").addEventListener("click", () => {
          document.querySelectorAll("#plant-category-list li button").forEach(b => b.classList.remove("bg-green-700", "text-white"));
          li.querySelector("button").classList.add("bg-green-700", "text-white");
          filterPlantsByCategory(cat.id);
        });
        categoryList.appendChild(li);
      });

    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const loadAllPlants = async () => {
    manageSpinner(true);
    try {
      const res = await fetch("https://openapi.programming-hero.com/api/plants");
      const data = await res.json();
      allPlants = data.plants || [];
      displayPlantCards(allPlants);
    } catch (err) {
      console.error("Error loading plants:", err);
      cardContainer.innerHTML = `<p class="text-center text-red-500 py-10">Failed to load plants.</p>`;
    } finally {
      manageSpinner(false);
    }
  };

  const filterPlantsByCategory = async (categoryId) => {
    manageSpinner(true);
    try {
      const res = await fetch(`https://openapi.programming-hero.com/api/plant/${categoryId}`);
      const data = await res.json();
      const plants = data.data || [];
      displayPlantCards(plants);
    } catch (err) {
      console.error("Error filtering plants:", err);
    } finally {
      manageSpinner(false);
    }
  };

  const displayPlantCards = (plants) => {
    cardContainer.innerHTML = "";
    if (!plants.length) {
      cardContainer.innerHTML = `<p class="text-center text-gray-500 py-10 col-span-full">No plants to show.</p>`;
      return;
    }

    plants.forEach((plant) => {
      if (!plant || !plant.name || !plant.image) return; 

      const card = document.createElement("div");
      card.classList.add("bg-white", "shadow-md", "hover:shadow-lg", "transition");

      card.innerHTML = `
        <div class="p-4">
          <img src="${plant.image}" alt="${plant.name}" class="w-full h-40 object-cover"/>
        </div>
        <div class="px-5 pb-5">
          <h2 class="text-lg font-semibold text-gray-800 cursor-pointer hover:text-green-600">${plant.name}</h2>
          <p class="text-sm text-gray-600 mt-1">
            ${plant.description?.slice(0, 80) || "No description available..."}
          </p>
          <div class="flex justify-between items-center mt-3">
            <span class="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">${plant.category || "Unknown"}</span>
            <span class="font-semibold text-gray-800">$${plant.price || "0.00"}</span>
          </div>
          <button class="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition">
            Add to Cart
          </button>
        </div>
      `;

      card.querySelector("h2").addEventListener("click", () => showPlantModal(plant));
      cardContainer.appendChild(card);
    });
  };

  const showPlantModal = (plant) => {
    modalContainer.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}" class="w-full h-64 object-cover rounded mb-4">
      <h2 class="text-2xl font-bold">${plant.name}</h2>
      <p class="text-gray-700">${plant.description || "No description available"}</p>
      <p class="text-gray-500">Category: ${plant.category || "Unknown"}</p>
      <p class="text-green-700 font-semibold">Price: $${plant.price || "0.00"}</p>
    `;
    document.getElementById("plant_modal").showModal();
  };

  loadCategories();
  loadAllPlants();
});





