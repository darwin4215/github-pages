import React,{useState,useEffect} from 'react';
import PublisherLink from '../Components/Publisherlink';
import { Link } from 'react-router-dom';
 import './index.css';

const HeroComponent = () => {
    const [publishers, setPublishers] = useState([]);
    const [genders, setGenders] = useState([]);
    const [alignments, setAlignments] = useState([]);
    const [hero, setHero] = useState({
        name: '',
        eye_color: '',
        hair_color: '',
        height: '',
        weight: '',
        race: '',
        publisher_id: '',
        gender_id: '',
        alignment_id: ''
    });
    const getGerders =()=>{
        fetch('http://localhost:3004/api/genders')
        .then(response => response.json())
        .then(data => {
            if(genders.length > 1 ){
                // console.log("data",data)
            }else{
                if(!data?.message){
                    getAligments();
                    setGenders(data)
                }
            }

        })
        .catch(error => console.error('Error al cargar genders:', error));
    }

    const getAligments=()=>{
        fetch('http://localhost:3004/api/alignments')
            .then(response => response.json())
            .then(data => {
                if(alignments.length > 1 ){
                    // console.log("data",data)
                }else{
                    if(!data?.message){
                        setAlignments(data)                    }
                }
            })
            .catch(error => console.error('Error al cargar alignments:', error));
    }
    // Obtener publishers, genders y alignments al montar el componente
    useEffect(() => {
        fetch('http://localhost:3004/api/publishers')
            .then(response => response.json())
            .then(data => {
                if(publishers.length > 1 ){
                    // console.log("data",data)
                }else{
                    // console.log(data,"data")
                    if(!data?.message){
                        getGerders();
                        console.log(data)
                        setPublishers(data)

                    }

                }
            })
            .catch(error => console.error('Error al cargar publishers:', error));




    }, []);
  

       // Manejar cambios en los campos del formulario
       const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name)
        let valaux = value;
        if(name =="publisher_id" ){
            valaux= parseInt(valaux);
        }
        if(name =="gender_id" ){
            valaux= parseInt(valaux);
        }
        if(name =="alignment_id" ){
            valaux= parseInt(valaux);
        }
        setHero({
            ...hero,
            [name]: valaux
        });
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3004/heroes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(hero)
            });

            if (response.ok) {
                alert('Héroe agregado exitosamente');
                // Opcionalmente puedes limpiar el formulario
                setHero({
                    name: '',
                    eye_color: '',
                    hair_color: '',
                    height: '',
                    weight: '',
                    race: '',
                    publisher_id: '',
                    gender_id: '',
                    alignment_id: ''
                });
            } else {
                alert('Error al agregar héroe');
            }
        } catch (error) {
            console.error('Error al agregar héroe:', error);
            alert('Error al agregar héroe');
        }
    };

    return (
        <div>
            <header>
                <div className="navbar">
                    <img src="logo-link-here" alt="Marvel Logo" className="logo" />
                    <nav>
                        <ul>
                            <li><a href="#casaspu">Por casas</a></li>
                            <li><a href="#gender">Por género</a></li>
                            <li><a href="#alignment">Por bando</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
            <section className="banner">
                <img src="banner-image-link-here" alt="Banner Image" />
                <div className="banner-content">
                    <h1 className="heroacademy">My Hero Academy</h1>
                    <p>Streaming Now On Disney+</p>
                    <button className="read-more">Read More</button>
                    <button className="stream-now">Stream Now on Disney+</button>
                </div>
            </section>
            <section id="casaspu" className="casaspu">
                <h1>Casas publicadoras existentes</h1>
                <PublisherLink houseName="Marvel Comics" />
                <PublisherLink houseName="Microsoft" />
                <PublisherLink houseName="ABC Studios" />
                <PublisherLink houseName="DC Comics" />
                <PublisherLink houseName="SyFy" />
                <PublisherLink houseName="Universal Studios" />
                <PublisherLink houseName="HarperCollins" />
                <PublisherLink houseName="Image Comics" />
                <PublisherLink houseName="N/A" />
                <PublisherLink houseName="Dark Horse Comics" />
                <PublisherLink houseName="Sony Pictures" />
                <PublisherLink houseName="Star Trek" />
                <PublisherLink houseName="IDW Publishing" />
                <PublisherLink houseName="Shueisha" />
                <PublisherLink houseName="NBC - Heroes" />
                <PublisherLink houseName="South Park" />
                <PublisherLink houseName="Rebellion" />
                <PublisherLink houseName="George Lucas" />
                <PublisherLink houseName="Team Epic TV" />
                <PublisherLink houseName="Titan Books" />
                <PublisherLink houseName="Icon Comics" />
                <PublisherLink houseName="J. K. Rowling" />
                <PublisherLink houseName="Hanna-Barbera" />
                <PublisherLink houseName="Wildstorm" />
                <PublisherLink houseName="J. R. R. Tolkien" />
             
                <div id="publisherContent"></div>
            </section>
            <section id="gender" className="gender">
                <h1>Géneros existentes</h1>
                <Link to="/gender/Male">Hombre</Link>
                <Link to="/gender/Female">Mujer</Link>
                {/* <a href="male.html">Hombre</a>
                <a href="Female.html">Mujer</a> */}
            </section>
            <section id="alignment" className="alignment">
                <h1>Bandos existentes</h1>
                <Link to="/alignment/good">Buenos</Link>
            <Link to="/alignment/bad">Malos</Link>
            <Link to="/alignment/neutral">Neutros</Link>
                {/* <a href="bueno.html">Buenos</a>
                <a href="malo.html">Malos</a>
                <a href="neutro.html">Neutros</a> */}
            </section>
            <h1 className="h1body">Agregar Nuevo Héroe</h1>
            <form id="heroForm" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="heroName">Nombre del Héroe:</label>
                    <input type="text" id="heroName" name="name" value={hero.name} onChange={handleInputChange} required />
                </div>
                <div>
                    <label htmlFor="publisher">Casa Publicadora:</label>
                    <select id="publisher" name="publisher_id" value={hero.publisher_id} onChange={handleInputChange} required>
                        <option value="">Seleccionar</option>
                        {publishers?.map(publisher => (
                            
                            <option key={publisher.publisher_id} value={publisher.publisher_id}>{publisher.publisher_name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="gender">Género:</label>
                    <select id="gender" name="gender_id" value={hero.gender_id} onChange={handleInputChange} required>
                        <option value="">Seleccionar</option>
                        {genders.map(gender => (
                            <option key={gender.gender_id} value={gender.gender_id}>{gender.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="alignment">Bando:</label>
                    <select id="alignment" name="alignment_id" value={hero.alignment_id} onChange={handleInputChange} required>
                        <option value="">Seleccionar</option>
                        {alignments.map(alignment => (
                            <option key={alignment.alignment_id} value={alignment.alignment_id}>{alignment.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="eyeColor">Color de Ojos:</label>
                    <input type="text" id="eyeColor" name="eye_color" value={hero.eye_color} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="hairColor">Color de Cabello:</label>
                    <input type="text" id="hairColor" name="hair_color" value={hero.hair_color} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="height">Altura:</label>
                    <input type="text" id="height" name="height" value={hero.height} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="weight">Peso:</label>
                    <input type="text" id="weight" name="weight" value={hero.weight} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="race">Raza:</label>
                    <input type="text" id="race" name="race" value={hero.race} onChange={handleInputChange} />
                </div>
                <button type="submit">Agregar Héroe</button>
            </form>
        </div>
    );
};

export default HeroComponent;
