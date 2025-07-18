let creatureData = [];
let ascendedOnlies = [];
let ascendedOnlyCount = 0;
let origins = [];
let originCount = 0;
let eventOrigins = [];
let eventOriginCount = 0;
let worldBosses = [];
let worldBossCount = 0;
let arenaBosses = [];
let arenaBossCount = 0;

// Initialise the application.
document.addEventListener("DOMContentLoaded", () => {
  loadLocalJSONData("data/creatures.json").then((data) => {
    creatureData = data;
    // Create pie chart with creature origins.
    createOriginBarChart(data);
  });
});

function countAscendedOnlies(data) {
  ascendedOnlies = data.filter((creature) => creature.ascendedOnly == true);
  ascendedOnlyCount = ascendedOnlies.length;
  return ascendedOnlyCount;
}

function countOrigins(data) {
  origins = [...new Set(data.filter((creature) => creature.origin).map((creature) => creature.origin))];
  originCount = origins.length;
  return originCount;
}

function countEventOrigins(data) {
  eventOrigins = [...new Set(data.filter((creature) => creature.eventOrigin).map((creature) => creature.eventOrigin))];
  eventOriginCount = eventOrigins.length;
  return eventOriginCount;
}

function countWorldBosses(data) {
  worldBosses = data.filter((creature) => creature.isWorldBoss == true);
  worldBossCount = worldBosses.length;
  return worldBossCount;
}

function countArenaBosses(data) {
  arenaBosses = data.filter((creature) => creature.isArenaBoss == true);
  arenaBossCount = arenaBosses.length;
  return arenaBossCount;
}

function loadLocalJSONData(dataLocation) {
  return fetch(dataLocation)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok. ");
      }

      return response.json();
    })
    .then((data) => {
      countAscendedOnlies(data);
      countOrigins(data);
      countEventOrigins(data);
      countWorldBosses(data);
      countArenaBosses(data);

      // Print the results to the console.
      console.log("Found " + data.length + " creatures in the JSON file. ");

      console.log(ascendedOnlyCount + " of which are ASA exclusive creatures. ");
      if (ascendedOnlyCount > 0) {
        console.log("The ASA exclusive creatures are:\n");
        console.log(ascendedOnlies.map((creature) => "  " + creature.name).join("\n"));
      }

      console.log("Found " + origins.length + " different origins in the JSON file. ");
      if (origins.length > 0) {
        console.log("The origins are:\n");
        console.log(
          origins
            .sort()
            .map((origin) => "  " + origin)
            .join("\n")
        );
      }

      console.log("Found " + worldBossCount + " different world bosses in the JSON file. ");
      console.log("Found " + arenaBossCount + " different arena bosses in the JSON file. ");
      console.log("Found " + eventOriginCount + " different event origins in the JSON file. ");

      return data;
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation: ", error);
      return [];
    });
}

function createOriginBarChart(data) {
  const ctx = document.getElementById("originChart").getContext("2d");
  const orderedLabels = [
    "The Island",
    "The Center",
    "Scorched Earth",
    "Ragnarok",
    "Aberration",
    "Extinction",
    "Valguero",
    "Genesis Part 1",
    "Crystal Isles",
    "Genesis Part 2",
    "Lost Island",
    "Fjordur",
    "Club ARK",
    "Fantastic Tames",
    "Astraeos",
    "Lost Colony",
    "Aquatica",
  ];
  const values = orderedLabels.map((origin) => data.filter((creature) => creature.origin == origin).length);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: orderedLabels,
      datasets: [
        {
          label: "Unique Creatures Added",
          data: values,
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
        },
      },
    },
  });
}

function updateList(selectedMap) {
  const creatureList = document.getElementById("creatureList");
  creatureList.innerHTML = "";

  // Translate the selected map to the corresponding origin.
  const mapToOrigin = {
    theisland: "The Island",
    thecenter: "The Center",
    scorchedearth: "Scorched Earth",
    ragnarok: "Ragnarok",
    aberration: "Aberration",
    extinction: "Extinction",
    valguero: "Valguero",
    genesis: "Genesis Part 1",
    crystalisles: "Crystal Isles",
    genesis2: "Genesis Part 2",
    lostisland: "Lost Island",
    fjordur: "Fjordur",
    clubark: "Club ARK",
    fantastictames: "Fantastic Tames",
    astraeos: "Astraeos",
    lostcolony: "Lost Colony",
    aquatica: "Aquatica",
  };
  const selectedOrigin = mapToOrigin[selectedMap];

  const filteredCreatures = creatureData.filter((creature) => creature.origin == selectedOrigin);

  if (filteredCreatures.length > 0) {
    filteredCreatures.forEach((creature) => {
      const li = document.createElement("li");
      li.textContent = creature.name;
      li.addEventListener("click", () => showCreatureInfo(creature));
      creatureList.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "No creatures found for this map. ";
    creatureList.appendChild(li);
  }

  document.getElementById("creatureListContainer").style.minHeight = "600px";
}

function showCreatureInfo(creature) {
  const listSection = document.getElementById("listSection");
  const creatureListContainer = document.getElementById("creatureListContainer");
  const mapSelect = document.getElementById("mapSelect");
  const chartSection = document.getElementById("chartSection");

  // Hide the list section, creature list container and the chart.
  creatureListContainer.style.display = "none";
  mapSelect.style.display = "none";
  document.querySelector("#listSection h2").style.display = "none";
  document.querySelector("#listSection p").style.display = "none";
  chartSection.style.display = "none";

  // Show the info section.
  const infoSection = document.getElementById("infoSection");
  infoSection.style.display = "block";

  // Set the creature name and info.
  document.getElementById("creatureName").textContent = creature.name;

  const creatureInfo = document.getElementById("creatureInfo");
  creatureInfo.innerHTML = "";

  // Set the properties of the creature.
  const properties = [
    { label: "Origin", value: creature.origin },
    { label: "ASA Exclusive", value: creature.ascendedOnly ? "Yes" : "No" },
    { label: "Event Origin", value: creature.eventOrigin || "N/A" },
    { label: "World Boss", value: creature.isWorldBoss ? "Yes" : "No" },
    { label: "Arena Boss", value: creature.isArenaBoss ? "Yes" : "No" },
    { label: "Note", value: creature.note || "No additional notes." },
  ];

  properties.forEach((prop) => {
    const row = document.createElement("div");
    row.className = "info-row";

    const label = document.createElement("div");
    label.className = "info-label";
    label.textContent = prop.label + ":";

    const value = document.createElement("div");
    value.className = "info-value";
    value.textContent = prop.value;

    row.appendChild(label);
    row.appendChild(value);
    creatureInfo.appendChild(row);
  });
}

function showList() {
  const creatureListContainer = document.getElementById("creatureListContainer");
  const mapSelect = document.getElementById("mapSelect");

  creatureListContainer.style.display = "block";
  mapSelect.style.display = "block";
  document.querySelector("#listSection h2").style.display = "block";
  document.querySelector("#listSection p").style.display = "block";
  document.getElementById("chartSection").style.display = "block";

  document.getElementById("infoSection").style.display = "none";
}
