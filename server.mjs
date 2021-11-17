import express from "express";

const port = 1337;

const ships = [
  { id: 1, registry: "NCC-1701", name: "USS Enterprise", commissioned: 2245, decommissioned: 2285, destroyed: true },
  { id: 2, registry: "NCC-1701-A", name: "USS Enterprise", commissioned: 2286, decommissioned: 2293, destroyed: false },
  { id: 3, registry: "NCC-1701-B", name: "USS Enterprise", commissioned: 2293, decommissioned: null, destroyed: false },
  { id: 4, registry: "NCC-1701-C", name: "USS Enterprise", commissioned: null, decommissioned: 2344, destroyed: true },
  { id: 5, registry: "NCC-1701-D", name: "USS Enterprise", commissioned: 2363, decommissioned: 2371, destroyed: true },
  { id: 6, registry: "NCC-1701-E", name: "USS Enterprise", commissioned: 2372, decommissioned: null, destroyed: false },
  { id: 7, registry: "NCC-74656", name: "USS Voyager", commissioned: 2371, decommissioned: null, destroyed: false }
];

function delay(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getShipErrors(ship) {
  const errors = [];
  if (!ship.registry?.trim()) {
    errors.push("Missing registry");
  } else if (ships.find(s => s.id !== ship.id && s.registry === ship.registry.trim())) {
    errors.push("Duplicate registry");
  }
  if (!ship.name?.trim()) {
    errors.push("Missing name");
  }
  if (ship.commissioned != null && ship.decommissioned != null && ship.decommissioned < ship.commissioned) {
    errors.push("Decommission year cannot be earlier than commission year");
  }
  return errors;
}

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.get("/ships", async (req, res) => {
  await delay(1000);
  res.json(ships);
});

app.post("/ships", async (req, res) => {
  await delay(1000);
  const id = Math.max(...ships.map(ship => ship.id)) + 1;
  const ship = { ...req.body, id };
  const errors = getShipErrors(ship);
  if (errors.length) {
    res.status(400).json({ errors });
  } else {
    ships.push(ship);
    res.status(201).json(ship);
  }
});

app.put("/ships/:id", async (req, res) => {
  await delay(1000);
  const id = +req.params.id;
  const index = ships.findIndex(s => s.id === id);
  if (~index) {
    const ship = { ...req.body, id };
    const errors = getShipErrors(ship);
    if (errors.length) {
      res.status(400).json({ errors });
    } else {
      ships[index] = ship;
      res.json(ship);
    }
  } else {
    res.status(404).send();
  }
});

app.delete("/ships/:id", (req, res) => {
  const id = +req.params.id;
  const index = ships.findIndex(s => s.id === id);
  if (~index) {
    ships.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send();
  }
});

app.listen(port);
console.log(`Server started on port ${port}`);
