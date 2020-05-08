let data = [];
let currentPage = 1;
let pageCount = 1;

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

  let places = [...data];

  if (!!type) {
    const regex = new RegExp(type, "gi");
    places = places.filter((item) => item.property_type.match(regex));
  }

  if (!!name) {
    const regex = new RegExp(name, "gi");

    places = places.filter((item) => item.name.match(regex));
  }

  // if (places.length < 9) {
  //   fillPlaces = data.slice(0, 9).filter((item) => !places.includes(item));

  //   places.push(...fillPlaces);
  // }

  pageCount = Math.ceil(places.length / 9);
  console.log(places);

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

  if (!data.length) {
    data = await getData();
    pageCount = Math.ceil(data.length / 9);
  }

  const places = await searchPlaces();

  const list = document.querySelector(".places ul");

  list.innerHTML = "";

  const initialPosition = (currentPage - 1) * 9;

  places.slice(initialPosition, initialPosition + 9).forEach((place) => {
    child = createPlaceElement(place);

    list.appendChild(child);
  });
}
