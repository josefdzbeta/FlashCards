import { Vista } from "./vista.js";
import { Modelo } from "./modelo.js";

/**
 * @file Controlador principal de FlashCards
 * @author Angel Manuel Fernandez, Juan Diego Carretero, Sergio Matamoros   Delgado, Jose Angel Fernandez
 * @license GPL v3 2021
 * @description Proyecto Flash Cards.
 * 
 * Clase controladora principal del juego.
*/
export class Controlador {

    constructor() {

        this.vista = new Vista();
        this.modelo = new Modelo();

        this.darkMode = true;
        this.desc = false;
        this.fonetica = false;
        this.stringJson = null;
        this.pDescripcion = "";
        this.pFonetica = "";
        this.idPregunta = 0;

        this.team1Selected = null;

        this.totalScore = document.getElementById("totalScore");
        this.puntuacionT1 = 0;
        this.puntuacionT2 = 0;

        this.modoJuegoIndividual = null;

        window.onload = this.iniciar.bind(this);

    }

    /**
     * Método de inicio.
    */
    iniciar() {

        //Te cambia automaticamente al modo de juego en el que el jugador esté.
        if(document.getElementById("score")) {
            //Establecemos que jugamos en teams
            this.modoJuegoIndividual = false;

            //Ocultamos temporalmente...
            document.querySelector("#panelesTeam").style.display = "none";
            document.querySelector(".chooseTeam1").style.display = "none";
            document.querySelector(".chooseTeam2").style.display = "none";
        } 
        else this.modoJuegoIndividual = true;

        //Establezco en el modelo el modo de juego en el que estamos.
        this.modelo.modoJuegoIndividual = this.modoJuegoIndividual;

        //Cargamos los datos.
        this.cargar();
    }

    /**
        * Animación de expansión para las letras de las canciones 
    */
    lyrics() {
        if (document.getElementsByClassName("auto")) {
            let autos = document.getElementsByClassName("auto");

            for (let i=0; i<autos.length; i++) {
                autos[i].addEventListener("mouseover", autoOver);
                autos[i].addEventListener("mouseout", autoOut);
            }
        }
    }

    /* Método que comprueba que el ratón esté dentro*/
    autoOver() {
        this.style.height = this.scrollHeight + "px";
    }
    /** Método que comprueba que el ratón se haya salido */
    autoOut() {
        this.style.height = "20px";
    }
    
    /**
     * Inicia los clicks a los botones y carga el JSON y lo añade a @var stringJson
     */
    cargar() {
        let promesa = new Promise(function(correcto,incorrecto) { 


            fetch ('./js/preguntas.json')
            .then(respuesta => respuesta.json())
            .then(preguntas => correcto(preguntas))
            .catch(r => incorrecto("Error en: "+r));
        });

        promesa.then(r => this.stringJson = r)
        .catch(r => console.log("Se produjo una excepción: "+r));

        //console.log(this.stringJson);

        //Carga la primera imagen
        document.querySelector("div#imgEDesc > img").src = this.stringJson.Preguntas[0].img;


        console.log(promesa);

        //CAMBIAR LOS CLICKS.
        window.onclick = this.clicks.bind(this);
    }
    
    /**
     * Función que recoge los clicks a los botones.
     * @param {*} event 
    */
    clicks(event) {
        //console.log("Has hecho click en "+event.target.innerText);
    
        //Click en botón de ciclos
        if(event.target.id == "btnNodes") {
            this.vista.ciclosWeb();
        }

        if(event.target.classList == "chooseTeam1" || event.target.classList == "chooseTeam2") {

            //Ocultamos la flashcard y los botones de atrás.
            document.querySelector("#panelesTeam").style.display = "none";
            document.querySelector(".chooseTeam1").style.display = "none";
            document.querySelector(".chooseTeam2").style.display = "none";
    
            //Mostramos la elección de equipo
            document.getElementsByClassName("main_container")[0].style.display = "flex";
        }
    
        //Click a botón del NAV de teams
        /*if(event.target.innerText == "Teams") {
    
            //popup(); ¿¿ REUTILIZABLE ??
    
            //Carga de puntos
            document.getElementById("sTeam1").textContent = puntuacionT1;
            document.getElementById("sTeam2").textContent = puntuacionT2;
        }
        
        if(event.target.classList == "close-Button") {
            document.getElementsByClassName("popup")[0].style.display = "none";
        }*/
    
        //Click en botón de descripción
        if(event.target.id == "desc") {
    
            if(!this.desc) {
                console.log("Click en descripción.");
                //Activamos la variable
                this.desc = true;
                
                //Ocultamos la imagen
                document.querySelector("div#imgEDesc > img").style.display = "none";
    
                //crear un p que contenga el dato del JSON.
                this.pDescripcion = document.createElement("p");
                this.pDescripcion.id = "pDescripcion";
    
                
                this.pDescripcion.appendChild(document.createTextNode(this.stringJson.Preguntas[this.idPregunta].desc));
    
                //obtener el div y metemos el parrafo dentro.
                document.getElementById("imgEDesc").appendChild(this.pDescripcion);
            } else {
                console.log("Click en descripcion.");
                //Reset variable
                this.desc = false;
    
                //Eliminamos el texto de la descripción
                document.getElementById("imgEDesc").removeChild(this.pDescripcion);
    
                //Volvemos a mostrar la imagen anterior.
                document.querySelector("div#imgEDesc > img").style.display = "inline";
            }
        }
        
        //Click en botón de fonetica
        if(event.target.id == "phonetics") {
            if(!this.fonetica) {
                console.log("Click en fonética");
                //Activamos la variable
                this.fonetica = true;
    
                //crear un p que contenga el dato del JSON.
                this.pFonetica = document.createElement("p");
                this.pFonetica.id = "pFonetica";
    
                
                this.pFonetica.appendChild(document.createTextNode("e"));
    
                document.getElementById("imgEDesc").appendChild(this.pFonetica);
    
    
                //pDescripcion.appendChild(document.createTextNode(stringJson.Fonetica[0]));
    
                //Ocultamos la imagen
                document.querySelector("div#imgEDesc > img").style.display = "none";
            }
            else {
                console.log("Click en fonetica");
                //Reset variable
                this.fonetica = false;
    
                document.getElementById("imgEDesc").removeChild(this.pFonetica);
    
    
                //Volvemos a mostrar la imagen anterior.
                document.querySelector("div#imgEDesc > img").style.display = "inline";
            }
        }
    
        //Clicks en botones de correcto e incorrecto y equipos.
        if(event.target.id == "btnCorrect" || event.target.id == "btnIncorrect") 
            this.botonesCheck(event);
    
        //Clicks a equipos 1-2
        if(event.target.id == "team1") {
           //Establece que estás jugando como principal en el equipo 1
            this.team1Selected = true;
            this.modelo.team1Selected = true;

            //Ocultamos los equipos.
            document.getElementsByClassName("main_container")[0].style.display = "none";

            //Mostramos la flashcard
            document.querySelector("#panelesTeam").style.display = "block";

            //Mostramos la elección de equipo
            document.querySelector(".chooseTeam1").style.display = "block";
            document.querySelector(".chooseTeam2").style.display = "block";

        }
    
        if(event.target.id == "team2") {
            //Establece que estás jugando como principal en el equipo 2
            this.team1Selected = false;
            this.modelo.team1Selected = false;

            //Ocultamos los equipos.
            document.getElementsByClassName("main_container")[0].style.display = "none";

            //Mostramos la flashcard
            document.querySelector("#panelesTeam").style.display = "block";

            //Mostramos la elección de equipo
            document.querySelector(".chooseTeam1").style.display = "block";
            document.querySelector(".chooseTeam2").style.display = "block";

            //totalScore.textContent = `Puntos: ${puntuacionT2}`;
            
        }
    }
    
    /**
     * Función que controla los clicks en los botones de correcto/incorrecto
     * @param {*} event 
     */
    botonesCheck(event) {
    
        //Si no has seleccionado ningún equipo...
        if(this.team1Selected == null && !this.modoJuegoIndividual) {
            alert("[ERROR] Selecciona un equipo primero");
        } else 
        {
            //Click en botón de correcto
            if(event.target.id == "btnCorrect" ) {
                console.log("Click en Correcto");
    
                if(this.stringJson.Preguntas[this.idPregunta] == undefined) return;

                //Pasamos a la siguiente pregunta
                this.idPregunta++;

                this.modelo.sumarPuntos(true);

                //Actualizamos los puntos totales
                //totalScore.textContent = `Puntos: ${sumarPuntos()}`;

                //console.log("Puntos:"+puntuacionT1 + " " + puntuacionT2);

                //Mostramos la siguiente imagen                
                document.querySelector("div#imgEDesc > img").src = this.stringJson.Preguntas[this.idPregunta].img;
            }
    
            //Click en botón de incorrecto
            if(event.target.id == "btnIncorrect") {
                console.log("Click en Incorrecto");
            
                if(this.stringJson.Preguntas[this.idPregunta] == undefined) return;
    
                //Pasamos a la siguiente pregunta
                this.idPregunta++;
    
                
                this.modelo.sumarPuntos(false);
    
                //Actualizamos los puntos totales
                //totalScore.textContent = `Puntos: ${sumarPuntos()}`;
    
                //Ocultamos la imagen
                document.querySelector("div#imgEDesc > img").src = this.stringJson.Preguntas[this.idPregunta].img;
            }
        }
    }
}

var app = new Controlador();