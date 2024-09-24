const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // Asegúrate de que sea la URL correcta donde corre tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permitir estos métodos HTTP
  allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}));
// app.use(cors({
//   origin: '*', // Permite solicitudes desde cualquier origen
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
//   allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
// }));

app.use(express.json()); // Para procesar solicitudes con cuerpo JSON


const uri = "mongodb+srv://ubiquo:55O85Wh%40b6%401GTQO%24%24XbO9@atlascluster.1jpotvm.mongodb.net/heroes"; // Reemplaza con tu URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/heroes', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('heroes');
    const heroCollection = database.collection('hero_information');

    // Extraer los campos del cuerpo de la solicitud
    const { name, eye_color, hair_color, skin_color, height, weight, race, publisher_id, gender_id, alignment_id } = req.body;

    // Crear el nuevo héroe con los datos proporcionados
    const newHero = {
      name: name || null,
      eye_color: eye_color || null,
      hair_color: hair_color || null,
      skin_color: skin_color || null,
      height: height || null,
      weight: weight || null,
      race: race || null,
      publisher_id: publisher_id || null,
      gender_id: gender_id || null,
      alignment_id: alignment_id || null
    };

    // Insertar el nuevo héroe en la base de datos
    const result = await heroCollection.insertOne(newHero);

    res.status(201).json({ message: "Héroe agregado exitosamente", heroId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al agregar héroe", error: err.message });
  } finally {
    await client.close();
  }
});

// Rutas para obtener publishers, genders y alignments
app.get('/api/publishers', async (req, res) => {
  let connection;

  try {

    connection = await client.connect();
    const database = client.db('heroes');
    const publishers = await database.collection('publisher').find({}).toArray();
    res.json(publishers);
  } catch (error) {
    res.status(500).json({ message: 'Error al cargar publishers' });
  } finally {
    
      await client.close();

    
  }
});

app.get('/api/genders', async (req, res) => {
  let connection;

  try {
    connection =await client.connect();
    const database = client.db('heroes');
    const genders = await database.collection('gender').find({}).toArray();
    res.json(genders);
  } catch (error) {
    res.status(500).json({ message: 'Error al cargar genders' });
  } finally {
    if (connection) {
      await client.close();
    }
  }
});

app.get('/api/alignments', async (req, res) => {
  let connection;

  try {
    connection = await client.connect();
    const database = client.db('heroes');
    const alignments = await database.collection('alignment').find({}).toArray();
    res.json(alignments);
  } catch (error) {
    res.status(500).json({ message: 'Error al cargar alignments' });
  } finally {
    if (connection) {
      await client.close();
    }
  }
});

// Iniciar el servidor
app.listen(3004, () => {
  console.log('Servidor corriendo en el puerto 3004');
});
