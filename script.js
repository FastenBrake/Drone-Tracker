// =====================================================
// 1. DRONE DATA
// =====================================================

let drone = {

    battery: 87,

    voltage: 16.4,

    altitude: 24.5,

    speed: 8.2,

    satellites: 14,

    latitude: 50.8503,

    longitude: 2.8777,

    heading: 125,

    mode: "AUTO",

    gpsFix: true

};


// =====================================================
// 2. WEBSITE BIJWERKEN
// =====================================================

function updateDrone(data) {

    // Batterij
    document.getElementById("battery").textContent =
        Math.round(data.battery);

    document.getElementById("battery-bar").style.width =
        data.battery + "%";

    document.getElementById("voltage").textContent =
        data.voltage.toFixed(1);


    // Hoogte
    document.getElementById("altitude").textContent =
        data.altitude.toFixed(1);


    // Snelheid
    document.getElementById("speed").textContent =
        data.speed.toFixed(1);

    document.getElementById("speed-kmh").textContent =
        (data.speed * 3.6).toFixed(1);


    // GPS
    document.getElementById("satellites").textContent =
        data.satellites;

    document.getElementById("latitude").textContent =
        data.latitude.toFixed(6);

    document.getElementById("longitude").textContent =
        data.longitude.toFixed(6);


    // Heading
    document.getElementById("heading").textContent =
        Math.round(data.heading);


    // Flight mode
    document.getElementById("mode").textContent =
        data.mode;


    // GPS status
    document.getElementById("gps-status").textContent =
        data.gpsFix ? "3D FIX" : "GEEN FIX";
}


// =====================================================
// 3. SIMULATIE
// =====================================================
//
// Deze functie doet alsof we telemetrie van de drone
// ontvangen.
//
// LATER verwijderen we deze functie en ontvangen we
// de data via MAVLink → backend → WebSocket.
//

function simulateDrone() {

    // Batterij langzaam laten dalen

    drone.battery -= 0.02;

    if (drone.battery < 0) {
        drone.battery = 100;
    }


    // Kleine veranderingen simuleren

    drone.altitude +=
        (Math.random() - 0.5) * 0.4;

    drone.speed +=
        (Math.random() - 0.5) * 0.3;

    drone.heading +=
        (Math.random() - 0.5) * 2;


    // Grenzen

    drone.altitude =
        Math.max(0, drone.altitude);

    drone.speed =
        Math.max(0, drone.speed);

    drone.heading =
        (drone.heading + 360) % 360;


    // Website opnieuw tekenen

    updateDrone(drone);
}


// =====================================================
// 4. FLIGHT MODE
// =====================================================

document
    .getElementById("flight-mode")
    .addEventListener("change", function () {

        drone.mode = this.value;

        updateDrone(drone);
    });


// =====================================================
// 5. INSTELLINGEN OPSLAAN
// =====================================================

document
    .getElementById("save-settings")
    .addEventListener("click", function () {

        const maxAltitude =
            document.getElementById("max-altitude").value;

        const message =
            document.getElementById("settings-message");

        message.textContent =
            "Instellingen opgeslagen (simulatie). " +
            "Maximale hoogte: " +
            maxAltitude +
            " m";

        /*
         * LATER:
         *
         * Hier sturen we bijvoorbeeld:
         *
         * MAVLink PARAM_SET
         *
         * naar ArduPilot.
         */
    });


// =====================================================
// 6. WAYPOINTS
// =====================================================

let waypointNumber = 0;


document
    .getElementById("add-waypoint")
    .addEventListener("click", function () {

        waypointNumber++;

        const waypoint =
            document.createElement("div");

        waypoint.className = "waypoint";

        waypoint.textContent =
            "Waypoint " +
            waypointNumber +
            " — " +
            drone.latitude.toFixed(5) +
            ", " +
            drone.longitude.toFixed(5);

        document
            .getElementById("waypoints")
            .appendChild(waypoint);
    });


document
    .getElementById("send-mission")
    .addEventListener("click", function () {

        alert(
            "Missie voorbereid.\n\n" +
            "Later wordt deze missie via MAVLink " +
            "naar ArduPilot gestuurd."
        );
    });


// =====================================================
// 7. START
// =====================================================

updateDrone(drone);


// Elke seconde nieuwe gesimuleerde telemetrie

setInterval(
    simulateDrone,
    1000
);
```
