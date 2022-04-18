const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

// Variables empleadas para el funcionamiento de la API
var nextSensorId = 0;
var nextMeasurementId = 0;
var sensors = new Array();

// Valores de referencia para el ejemplo de objeto sensor con sus medidas
var temperatureMax = 19;
var temperatureMin = 36;

// Ejemplo de objeto sensor
var sensorExample = {
  id: nextSensorId,
  nombre: "Sensor de Temperatura - UAO - InfoLab",
  mediciones: [
    {
      id: nextMeasurementId++,
      momento: new Date(),
      valor: (
        Math.random() * (temperatureMax - temperatureMin) +
        temperatureMin
      ).toFixed(1),
      unidad: "ºC"
    },
    {
      id: nextMeasurementId++,
      momento: new Date(),
      valor: (
        Math.random() * (temperatureMax - temperatureMin) +
        temperatureMin
      ).toFixed(1),
      unidad: "ºC"
    }
  ]
};

// Agrega el objeto sensor al arreglo de sensores en la posición 0, que coincide con su id
sensors[nextSensorId++] = sensorExample;

// Retorna todos los sensores almacenados
app.get("/sensores", (req, res) => {
  res.status(200).send(sensors);
});

// Almacena un nuevo sensor
app.post("/sensores", (req, res) => {
  let sensor = req.body;
  sensor.id = nextSensorId;
  sensors[nextSensorId++] = sensor;
  res.status(201).send(sensor);
});

// Retorna el sensor con el id pasado en el parámetro sensorId
app.get("/sensores/:sensorId", (req, res) => {
  let sensorId = req.params.sensorId;
  let sensor = sensors[sensorId];

  if (sensor !== undefined) {
    res.status(200).send(sensor);
  } else {
    res.status(404).send(`El sensor con id: ${sensorId} no existe`);
  }
});

// Almacena una nueva medición
app.post("/sensores/:sensorId/mediciones", (req, res) => {
  let sensorId = req.params.sensorId;
  let sensor = sensors[sensorId];

  if (sensor !== undefined) {
    let measurement = req.body;
    measurement.id = nextMeasurementId++;
    if (sensor.mediciones === undefined) {
      sensor.mediciones = new Array();
    }
    sensor.mediciones.push(measurement);
    res.status(201).send(measurement);
  } else {
    res.status(404).send(`El sensor con id: ${sensorId} no existe`);
  }
});

// Inicializa el servidor para que escuche en el puerto determinado
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto: ${port}`);
});