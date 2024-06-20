class Sensor {
    constructor(id, name, type, value, unit, updated_at) {
        if (!['temperature', 'humidity', 'pressure'].includes(type)) {
            throw new Error(`Invalid sensor type: ${type}`);
        }
        this.id = id;
        this.name = name;
        this.type = type;
        this.value = value;
        this.unit = unit;
        this.updated_at = new Date(updated_at);
    }

    set updateValue(newValue) {
        this.value = newValue;
        this.updated_at = new Date();
    }

    get updateValue() {
        return this.value;
    }
}

class SensorManager {
    constructor() {
        this.sensors = [];
    }

    addSensor(sensor) {
        this.sensors.push(sensor);
    }

    updateSensor(id) {
        const sensor = this.sensors.find((sensor) => sensor.id === id);
        if (sensor) {
            let newValue;
            switch (sensor.type) {
                case "temperature":
                    newValue = (Math.random() * 80 - 30).toFixed(2);
                    break;
                case "humidity":
                    newValue = (Math.random() * 100).toFixed(2);
                    break;
                case "pressure":
                    newValue = (Math.random() * 80 + 960).toFixed(2);
                    break;
                default:
                    newValue = (Math.random() * 100).toFixed(2);
            }
            sensor.updateValue = newValue;
            this.render();
        } else {
            console.error(`Sensor ID ${id} no encontrado`);
        }
    }

    async loadSensors(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const sensorsData = await response.json();
            sensorsData.forEach(sensorData => {
                const sensor = new Sensor(
                    sensorData.id,
                    sensorData.name,
                    sensorData.type,
                    sensorData.value,
                    sensorData.unit,
                    sensorData.updated_at
                );
                this.addSensor(sensor);
            });
            this.render();
        } catch (error) {
            console.error("Error loading sensors:", error);
        }
    }

    render() {
        const container = document.getElementById("sensor-container");
        container.innerHTML = "";
        this.sensors.forEach((sensor) => {
            const sensorCard = document.createElement("div");
            sensorCard.className = "column is-one-third";
            sensorCard.innerHTML = `
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Sensor ID: ${sensor.id}
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                <strong>Tipo:</strong> ${sensor.type}
                            </p>
                            <p>
                               <strong>Valor:</strong> 
                               ${sensor.value} ${sensor.unit}
                            </p>
                        </div>
                        <time datetime="${sensor.updated_at.toISOString()}">
                            Última actualización: ${sensor.updated_at.toLocaleString()}
                        </time>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item update-button" data-id="${sensor.id}">Actualizar</a>
                    </footer>
                </div>
            `;
            container.appendChild(sensorCard);
        });

        const updateButtons = document.querySelectorAll(".update-button");
        updateButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const sensorId = parseInt(button.getAttribute("data-id"));
                this.updateSensor(sensorId);
            });
        });
    }
}

const monitor = new SensorManager();

monitor.loadSensors("sensors.json");
