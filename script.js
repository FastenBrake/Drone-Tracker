
const API_URL = "https://drone-tracker-backend.onrender.com/telemetry";

let drone = {
    battery: 0,
    voltage: 0,
    altitude: 0,
    speed: 0,
    satellites: 0,
    latitude: 0,
    longitude: 0,
    heading: null,
    mode: "--",
    gpsFix: false
};

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function updateDrone(data) {
    drone = { ...drone, ...data };

    setText("battery", Math.round(data.battery ?? 0));
    setText("voltage", Number(data.voltage ?? 0).toFixed(1));
    setText("altitude", Number(data.altitude ?? 0).toFixed(1));
    setText("speed", Number(data.speed ?? 0).toFixed(1));
    setText("speed-kmh", (Number(data.speed ?? 0) * 3.6).toFixed(1));
    setText("satellites", data.satellites ?? 0);
    setText("latitude", Number(data.latitude ?? 0).toFixed(6));
    setText("longitude", Number(data.longitude ?? 0).toFixed(6));
    setText("heading", data.heading == null ? "--" : Math.round(data.heading));
    setText("mode", data.mode ?? "--");
    setText("gps-status", (data.satellites ?? 0) >= 4 ? "GPS beschikbaar" : "GPS onzeker");

    const batteryBar = document.getElementById("battery-bar");
    if (batteryBar) {
        batteryBar.style.width = `${Math.max(0, Math.min(100, data.battery ?? 0))}%`;
    }

    // Laat de keuzelijst de gemelde vluchtmodus volgen.
    const modeSelect = document.getElementById("flight-mode");
    if (modeSelect && [...modeSelect.options].some(option => option.value === data.mode)) {
        modeSelect.value = data.mode;
    }
}

function updateConnection(online) {
    setText("connection-status", online ? "LIVE" : "OFFLINE");
    setText("link-status", online ? "Verbonden" : "Geen verbinding");

    const dot = document.querySelector(".status-dot");
    if (dot) {
        dot.style.backgroundColor = online ? "#22c55e" : "#ef4444";
    }
}

async function fetchTelemetry() {
    try {
        const response = await fetch(API_URL, { cache: "no-store" });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (result.online && result.data) {
            updateDrone(result.data);
            updateConnection(true);
        } else {
            updateConnection(false);
        }
    } catch (error) {
        console.error("Telemetrie ophalen mislukt:", error);
        updateConnection(false);
    }
}

// Haal onmiddellijk gegevens op en vernieuw ze daarna elke 2 seconden.
fetchTelemetry();
setInterval(fetchTelemetry, 2000);

// Deze instellingen zijn voorlopig alleen lokaal; ze sturen
// geen opdrachten naar de drone.
document.getElementById("save-settings").addEventListener("click", function () {
    const maxAltitude = document.getElementById("max-altitude").value;
    document.getElementById("settings-message").textContent =
        `Instelling lokaal ingevuld: maximale hoogte ${maxAltitude} m. Niet naar de drone verzonden.`;
});

let waypointNumber = 0;

document.getElementById("add-waypoint").addEventListener("click", function () {
    waypointNumber++;

    const waypoint = document.createElement("div");
    waypoint.className = "waypoint";
    waypoint.textContent =
        `Waypoint ${waypointNumber} — ${Number(drone.latitude).toFixed(5)}, ${Number(drone.longitude).toFixed(5)}`;

    document.getElementById("waypoints").appendChild(waypoint);
});

document.getElementById("send-mission").addEventListener("click", function () {
    alert("De missie is nog niet naar de drone verzonden. Deze functie is voorlopig alleen een voorbeeld.");
});
