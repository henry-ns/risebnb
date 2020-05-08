const state = {
  data: [],
  places: [],
  currentPage: 1,
  pageCount: 1,
};

function formatCurrency(value) {
  return Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

async function getData() {
  const response = await fetch(
    "https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72"
  );

  return response.json();
}

async function searchPlaces() {
  const name = document.getElementById("search-name").value;
  const type = document.getElementById("search-type").value;

  let places = [...state.data];

  if (!!type) {
    const regex = new RegExp(type, "gi");
    places = places.filter((item) => item.property_type.match(regex));
  }

  if (!!name) {
    const regex = new RegExp(name, "gi");

    places = places.filter((item) => item.name.match(regex));
  }

  state.pageCount = Math.ceil(places.length / 9);

  return places;
}

function createPlaceElement(data) {
  const item = `
    <div class="image-wrapper">
      <img
        src="${data.photo}"
        alt="Photo of ${data.name}"
      />
    </div>
    <div>
      <img src="./assets/icons/briefcase.svg" alt="Icon" />
      <span>${data.property_type}</span>
      <h1>${data.name}</h1>
      <strong>${formatCurrency(data.price)}</strong>
    </div>
  `;

  const place = document.createElement("li");
  place.innerHTML = item;

  return place;
}

async function handleSubmit(event) {
  event.preventDefault();

  if (!state.data.length) {
    state.data = await getData();
    state.pageCount = Math.ceil(state.data.length / 9);
  }

  state.places = await searchPlaces();

  updatePagitation();
}

function updatePlaces() {
  const list = document.querySelector(".places ul");

  list.innerHTML = "";

  const initialPosition = (state.currentPage - 1) * 9;

  state.places.slice(initialPosition, initialPosition + 9).forEach((place) => {
    child = createPlaceElement(place);

    list.appendChild(child);
  });
}

/* Paginations functions */

function updateElementStatus(id, conditionToDisable, className = "disabled") {
  const element = document.getElementById(id);

  if (conditionToDisable) {
    return element.classList.add(className);
  }

  element.classList.remove(className);
}

function updatePagitation() {
  updateElementStatus("pagination", state.pageCount === 0, "display-none");

  updateElementStatus("prev-btn-page", state.currentPage === 1);
  updateElementStatus("next-btn-page", state.currentPage === state.pageCount);

  const currentPageBtn = document.getElementById("current-page");
  const lastPageBtn = document.getElementById("last-page");

  currentPageBtn.innerText = state.currentPage;
  lastPageBtn.innerText = String(state.pageCount);

  updateElementStatus("first-page", currentPageBtn.innerText === "1");
  updateElementStatus(
    "last-page",
    lastPageBtn.innerText === currentPageBtn.innerText
  );

  updatePlaces();
}

function setCurrentPage(value) {
  state.currentPage = value;

  updatePagitation();
}

function increasePage() {
  const nextPage = state.currentPage + 1;

  setCurrentPage(nextPage > state.pageCount ? state.pageCount : nextPage);
}

function decreasePage() {
  const prevPage = state.currentPage - 1;

  setCurrentPage(prevPage < 1 ? 1 : prevPage);
}
