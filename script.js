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
    // Create pie chart with creature origins.
    createOriginsBarChart(data);
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

function createBarChart(labels, data) {
  const container = document.createElement("div");
  container.style.width = "800px";
  container.style.height = "500px";

  const canvas = document.createElement("canvas");
  container.appendChild(canvas);

  const colours = [
    // Reds
    "#FF0000", // Pure red
    "#FF3333", // Light red
    // Oranges
    "#FF6600", // Orange
    "#FF9900", // Amber
    // Yellows
    "#FFCC00", // Gold
    "#FFFF00", // Pure yellow
    // Greens
    "#CCFF00", // Lime
    "#66FF00", // Light green
    "#00FF00", // Pure green
    "#00FF66", // Spring green
    // Blues/Cyans
    "#00FFCC", // Aquamarine
    "#00FFFF", // Cyan
    "#00CCFF", // Sky blue
    "#0066FF", // Azure
    "#0000FF", // Pure blue
    // Purples
    "#6600FF", // Violet
    "#9900FF", // Purple
    "#CC00FF", // Magenta
    "#FF00FF", // Fuchsia
    "#FF00CC", // Pink
  ];

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: function (context) {
            const index = context.dataIndex % colours.length;
            return colours[index];
          },
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      indexAxis: "y", // Horizontal bar chart.
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const total = context.dataset.data.reduce((sum, value) => sum + value, 0);
              const percentage = (context.raw / total) * 100;
              const formattedPercentage = percentage.toFixed(2);
              return `Count: ${context.raw} (${formattedPercentage}%)`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Number of Creatures",
          },
        },
        y: {
          title: {
            display: true,
            text: "Origin",
          },
        },
      },
    },
  });

  return container;
}

function createOriginsBarChart(data) {
  // Create a map of origin counts.
  const originCounts = {};

  origins.forEach((origin) => {
    originCounts[origin] = 0;
  });

  origins.forEach((origin) => {
    originCounts[origin] = data.filter((creature) => creature.origin == origin).length;
  });

  // Sort the origins for consistent display.
  const sortedOrigins = [...origins].sort();

  // Get data in same order as sorted origins.
  const chartData = sortedOrigins.map((origin) => originCounts[origin]);

  // Create the bar chart.
  const chartContainer = createBarChart(sortedOrigins, chartData);
  const chartsSection = document.getElementById("charts") || document.body;

  const title = document.createElement("h2");
  title.textContent = `Creature Origins Distribution (${originCount} origins) `;

  chartsSection.appendChild(title);
  chartsSection.appendChild(chartContainer);

  console.log("Origins bar chart created with " + originCount + " origins. ");
}
