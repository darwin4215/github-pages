const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); 
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Para procesar solicitudes con cuerpo JSON

const uri = "mongodb+srv://ubiquo:55O85Wh%40b6%401GTQO%24%24XbO9@atlascluster.1jpotvm.mongodb.net/heroes"; // Reemplaza con tu URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Obtener todos los héroes o filtrar por publisher
app.get('/heroes', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('heroes');
    const heroCollection = database.collection('hero_information');
    const publisherCollection = database.collection('publisher');
    const genderCollection = database.collection('gender');

    // Obtener el parámetro 'publisher_name' de la solicitud (opcional)
    const { publisher_name } = req.query;

    const filter = {};
    if (publisher_name) {
      const publisher = await publisherCollection.findOne({ publisher_name });
      if (publisher) {
        filter.publisher_id = publisher.publisher_id;
      } else {
        return res.status(404).json({ message: "Publisher not found" });
      }
    }

    // Join heroes with publisher and gender information
    const heroes = await heroCollection.aggregate([
      { $match: filter },  // Aplicar el filtro dinámico
      {
        $lookup: {
          from: 'publisher',
          localField: 'publisher_id',
          foreignField: 'publisher_id',
          as: 'publisher_info'
        }
      },
      {
        $lookup: {
          from: 'gender',
          localField: 'gender_id',
          foreignField: 'gender_id',
          as: 'gender_info'
        }
      },
      {
        $project: {
          name: 1,
          'publisher_info.publisher_name': 1,
          'gender_info.name': 1,
          height: 1,
          weight: 1
        }
      }
    ]).toArray();

    res.status(200).json(heroes);
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
  } finally {
    await client.close();
  }
});

// Editar un héroe
app.put('/heroes/:id', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('heroes');
    const heroCollection = database.collection('hero_information');

    const heroId = req.params.id;
    const { name, height, weight } = req.body;

    // Actualizar el héroe con los nuevos datos
    const result = await heroCollection.updateOne(
      { _id: new ObjectId(heroId) }, 
      {
        $set: {
          name: name,
          height: height,
          weight: weight
        }
      }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Hero not found" });
    }

    res.status(200).json({ message: "Hero updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
  } finally {
    await client.close();
  }
});

// Ruta para eliminar un héroe por su ID
app.delete('/heroes/:id', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('heroes');
    const heroCollection = database.collection('hero_information');
    
    const heroId = req.params.id;

    // Eliminar el héroe con el ID proporcionado
    const result = await heroCollection.deleteOne({ _id: new ObjectId(heroId) });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Héroe eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Héroe no encontrado' });
    }
  } catch (error) {
    console.error("Error al eliminar el héroe:", error);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    await client.close();
  }
});

// Iniciar el servidor
app.listen(3005, () => {
  console.log('Server is running on port 3005');
});