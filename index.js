const express = require("express");
const { open } = require("sqlite");
const bcrypt = require("bcrypt");
const path = require("path");
const db_path = path.join(__dirname, "sql.db");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const jwt = require("jsonwebtoken");
const { request } = require("http");
const { error } = require("console");

let db;

const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: db_path,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running on port:3000");
    });
  } catch (error) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};

initializeDBandServer();

app.post("/signup", async (request, response) => {
  const { username, password } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const getQuery = `SELECT * FROM user WHERE username = '${username}' `;
  const dbData = await db.get(getQuery);
  if (dbData === undefined) {
    const insertDb = `
    insert into user(username,password)
    values(
    '${username}',
    '${hashedPassword}'
    );
    `;
    await db.run(insertDb);
    response.send("User Add Successufully");
  } else {
    response.status = 400;
    response.send("User exits");
  }
});

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const getQuery = `
  select * from user where username = '${username}'
  `;
  const checkName = await db.get(getQuery);
  if (checkName === undefined) {
    response.status = 400;
    response, send("Invalid user");
  } else {
    const passwordMatch = await bcrypt.compare(password, checkName.password);
    if (passwordMatch === true) {
      const payload = { username: username };
      const jwtToken = jwt.sign(payload, "secret_key");
      response.send({ jwtToken });
    }
  }
});

app.post("/addMedication", async (request, response) => {
  const { username, name, dosage, frequency } = request.body;

  const insertQuery = `
    INSERT INTO medication(username, name, dosage, frequency, taken_dates)
    VALUES('${username}', '${name}', '${dosage}', '${frequency}', '');
  `;
  await db.run(insertQuery);
  response.send("Medication added successfully");
});

app.get("/medications/:username", async (request, response) => {
  const { username } = request.params;

  const getQuery = `
    SELECT * FROM medication WHERE username = '${username}';
  `;
  const meds = await db.all(getQuery);
  response.send(meds);
});

app.post("/markTaken", async (request, response) => {
  const { id } = request.body;
  const today = new Date().toISOString().slice(0, 10);

  const getQuery = `SELECT taken_dates FROM medication WHERE id = ${id}`;
  const data = await db.get(getQuery);

  let taken = data.taken_dates ? data.taken_dates.split(",") : [];

  if (!taken.includes(today)) {
    taken.push(today);
  }

  const updateQuery = `
    UPDATE medication
    SET taken_dates = '${taken.join(",")}'
    WHERE id = ${id};
  `;

  await db.run(updateQuery);
  response.send("Marked as taken");
});

app.get("/adherence/:username", async (request, response) => {
  const { username } = request.params;

  const query = `
    SELECT id, name, taken_dates FROM medication WHERE username = '${username}';
  `;
  const meds = await db.all(query);

  const result = meds.map((med) => {
    const dates = med.taken_dates ? med.taken_dates.split(",") : [];
    return {
      id: med.id,
      name: med.name,
      takenCount: dates.length,
    };
  });

  response.send(result);
});
