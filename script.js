// Global variables for tracking counts
let ascendedOnlyCount = 0;
let origins = [];

// Initialise the application.
document.addEventListener("DOMContentLoaded", () => {
  loadDOMElements();
  loadLocalJSONData("data/creatures.json");
});

// Load all the DOM elements.
function loadDOMElements() {
  document.getElementById("randomButton").addEventListener("click", () => console.log("Hello World!"));
}

function loadLocalJSONData(dataLocation) {
  fetch(dataLocation)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok. ");
      }

      return response.json();
    })
    .then((data) => {
      data.forEach((creature) => {
        // Count the ASA exclusives.
        if (creature.ascendedOnly == true) {
          ascendedOnlyCount++;
        }

        // Add all unique origins to the origins list.
        if (creature.origin && !origins.includes(creature.origin)) {
          origins.push(creature.origin);
        }
      });

      // Print the results to the console.
      console.log("Found " + data.length + " creatures in the JSON file. ");

      console.log(ascendedOnlyCount + " of which are ASA exclusive creatures. ");
      if (ascendedOnlyCount > 0) {
        console.log("The ASA exclusive creatures are:\n");
        console.log(
          data
            .filter((creature) => creature.ascendedOnly)
            .map((creature) => "  " + creature.name)
            .join("\n")
        );
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
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation: ", error);
    });
}
