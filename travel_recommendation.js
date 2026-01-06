const searchBtn = document.getElementById("btnSearch");
const clearBtn = document.getElementById("btnReset");
const input = document.getElementById("conditionInput");
const resultsDiv = document.getElementById("recommendations");

let data = {};

// =======================
// FETCH JSON DATA
// =======================
fetch("travel_recommendation_api.json")
  .then(response => response.json())
  .then(json => {
    data = json;
    console.log("Data loaded:", data);
  })
  .catch(error => console.error("Fetch error:", error));

// =======================
// SEARCH HANDLER
// =======================
searchBtn.addEventListener("click", () => {
  const keyword = input.value.toLowerCase().trim();
  resultsDiv.innerHTML = "";

  if (!keyword) return;

  if (keyword === "beach" || keyword === "beaches") {
    showBeaches();
  } else if (keyword === "temple" || keyword === "temples") {
    showTemples();
  } else if (keyword === "country" || keyword === "countries") {
    showCountries();
  } else {
    resultsDiv.innerHTML = "<p>No recommendations found.</p>";
  }
});

// =======================
// CLEAR BUTTON
// =======================
clearBtn.addEventListener("click", () => {
  resultsDiv.innerHTML = "";
  input.value = "";
});

// =======================
// DISPLAY FUNCTIONS
// =======================
function showBeaches() {
  data.beaches.forEach(beach => {
    createCard(beach.name, beach.imageUrl, beach.description);
  });
}

function showTemples() {
  data.temples.forEach(temple => {
    createCard(temple.name, temple.imageUrl, temple.description);
  });
}

function showCountries() {
  data.countries.forEach(country => {
    country.cities.forEach(city => {
      const time = getCountryTime(country.name);
      createCard(
        city.name,
        city.imageUrl,
        city.description,
        time
      );
    });
  });
}

// =======================
// CARD CREATOR
// =======================
function createCard(name, image, description, time = null) {
  const card = document.createElement("div");
  card.className = "recommendation-card";

  card.innerHTML = `
    <img src="${image}" alt="${name}">
    <h3>${name}</h3>
    <p>${description}</p>
    ${time ? `<p><strong>Local Time:</strong> ${time}</p>` : ""}
  `;

  resultsDiv.appendChild(card);
}

// =======================
// OPTIONAL TIME LOGIC
// =======================
function getCountryTime(country) {
  let timeZone;

  if (country === "Australia") timeZone = "Australia/Sydney";
  if (country === "Japan") timeZone = "Asia/Tokyo";
  if (country === "Brazil") timeZone = "America/Sao_Paulo";

  if (!timeZone) return null;

  const options = {
    timeZone,
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  };

  return new Date().toLocaleTimeString("en-US", options);
}
