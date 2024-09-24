import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GenderDetail = () => {
    const { genderName } = useParams(); // Obtener el nombre del género desde la URL
    const [heroes, setHeroes] = useState([]); // Estado para los héroes
    const [error, setError] = useState(null); // Estado para manejar errores

    // Función para obtener y mostrar los datos de MongoDB
    const fetchHeroesByGender = async () => {
        try {
            const response = await fetch(`http://localhost:3002/heroes?gender_name=${genderName}`);
            if (!response.ok) {
                throw new Error('');
            }
            const data = await response.json();
            setHeroes(data);
        } catch (error) {
            setError(error.message);
        }
    };

    // Función para eliminar un héroe
    const deleteHero = async (heroId) => {
        try {
            const response = await fetch(`http://localhost:3002/heroes/${heroId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchHeroesByGender(); // Refrescar la lista de héroes después de eliminar
            } else {
                console.error('Error al eliminar el héroe');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para mostrar el formulario de edición
    const showEditForm = (heroId) => {
        document.getElementById(`edit-form-${heroId}`).style.display = 'block';
    };

    // Función para actualizar el héroe
    const updateHero = async (event, heroId) => {
        event.preventDefault(); // Evitar comportamiento por defecto del formulario
        const form = event.target;
        const updatedHero = {
            name: form.name.value,
            height: form.height.value,
            weight: form.weight.value,
        };

        try {
            const response = await fetch(`http://localhost:3002/heroes/${heroId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedHero),
            });

            if (response.ok) {
                fetchHeroesByGender(); // Refrescar la lista de héroes después de actualizar
            } else {
                console.error('Error al actualizar el héroe');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Ejecutar la función fetchHeroesByGender cuando el componente se monte
    useEffect(() => {
        fetchHeroesByGender();
    }, [genderName]); // Actualizar cuando el genderName cambie

    return (
        <div>
            <h1>Héroes de género: {genderName}</h1>
            {error ? <p>{error}</p> : null}
            <div className="hero-container">
                {heroes.map((hero) => (
                    <div key={hero._id} className="hero-card" id={`hero-${hero._id}`}>
                        <h2 id={`name-${hero._id}`}>{hero.name}</h2>
                        <p>Publisher: {hero.publisher_info.length > 0 ? hero.publisher_info[0].publisher_name : 'Unknown'}</p>
                        <p>Height: <span id={`height-${hero._id}`}>{hero.height}</span></p>
                        <p>Weight: <span id={`weight-${hero._id}`}>{hero.weight}</span></p>
                        <button onClick={() => showEditForm(hero._id)}>Editar</button>
                        <button onClick={() => deleteHero(hero._id)}>Eliminar</button>
                        <form id={`edit-form-${hero._id}`} style={{ display: 'none' }} onSubmit={(e) => updateHero(e, hero._id)}>
                            <input type="text" name="name" defaultValue={hero.name} />
                            <input type="number" name="height" defaultValue={hero.height} />
                            <input type="number" name="weight" defaultValue={hero.weight} />
                            <button type="submit">Guardar</button>
                        </form>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GenderDetail;
