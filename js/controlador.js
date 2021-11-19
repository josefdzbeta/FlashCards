class Controlador {

    constructor() {
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

        window.onload = this.iniciar.bind(this);

    }

    iniciar() {
        this.cargar();
    
        //Tiempo de espera hasta que se carguen los datos del JSON.
        setTimeout(() => {
            //Carga la imagen principal.
            document.querySelector("div#imgEDesc > img").src = this.stringJson.Preguntas[0].img;
        }, 200);
    }
    
    /**
     * Inicia los clicks a los botones y carga el JSON y lo añade a @var stringJson
     */
    cargar() {
        fetch ('js/preguntas.json')
        .then(respuesta => respuesta.json())
        .then(preguntas => this.stringJson = preguntas)
    
        //CAMBIAR LOS CLICKS.
        document.getElementById("desc").onclick = clicks;
        document.getElementById("phonetics").onclick = clicks;
        document.getElementById("btnCorrect").onclick = clicks;
        document.getElementById("btnIncorrect").onclick = clicks;
        document.getElementById("btnNodes").onclick = clicks;
        document.getElementById("team1").onclick = clicks;
        document.getElementById("team2").onclick = clicks;
    
        //Click en el botón de NAV de Teams
        document.querySelectorAll("nav a")[2].onclick = clicks;
        document.querySelector(".close-Button").onclick = clicks;
    
    
    }
    
    /**
     * Función que recoge los clicks a los botones.
     * @param {*} event 
    */
    clicks(event) {
        console.log("Has hecho click en "+event.target.innerText);
    
        //Click en botón de ciclos
        if(event.target.id == "btnNodes") {
            ciclosWeb();
        }
    
        //Click a botón del NAV de teams
        if(event.target.innerText == "Teams") {
    
            popup();
    
            //Carga de puntos
            document.getElementById("sTeam1").textContent = puntuacionT1;
            document.getElementById("sTeam2").textContent = puntuacionT2;
        }
        
        if(event.target.classList == "close-Button") {
            document.getElementsByClassName("popup")[0].style.display = "none";
        }
    
        //Click en botón de descripción
        if(event.target.id == "desc") {
    
            if(!desc) {
                console.log("Click en descripción.");
                //Activamos la variable
                desc = true;
                
                //Ocultamos la imagen
                document.querySelector("div#imgEDesc > img").style.display = "none";
    
                //crear un p que contenga el dato del JSON.
                pDescripcion = document.createElement("p");
                pDescripcion.id = "pDescripcion";
    
                
                pDescripcion.appendChild(document.createTextNode(stringJson.Preguntas[idPregunta].desc));
    
                //obtener el div y metemos el parrafo dentro.
                document.getElementById("imgEDesc").appendChild(pDescripcion);
            } else {
                console.log("Click en descripcion.");
                //Reset variable
                desc = false;
    
                //Eliminamos el texto de la descripción
                document.getElementById("imgEDesc").removeChild(pDescripcion);
    
                //Volvemos a mostrar la imagen anterior.
                document.querySelector("div#imgEDesc > img").style.display = "inline";
            }
        }
        
        //Click en botón de fonetica
        if(event.target.id == "phonetics") {
            if(!fonetica) {
                console.log("Click en fonética");
                //Activamos la variable
                fonetica = true;
    
                //crear un p que contenga el dato del JSON.
                pFonetica = document.createElement("p");
                pFonetica.id = "pFonetica";
    
                
                pFonetica.appendChild(document.createTextNode("e"));
    
                document.getElementById("imgEDesc").appendChild(pFonetica);
    
    
                //pDescripcion.appendChild(document.createTextNode(stringJson.Fonetica[0]));
    
                //Ocultamos la imagen
                document.querySelector("div#imgEDesc > img").style.display = "none";
            }
            else {
                console.log("Click en fonetica");
                //Reset variable
                fonetica = false;
    
                document.getElementById("imgEDesc").removeChild(pFonetica);
    
    
                //Volvemos a mostrar la imagen anterior.
                document.querySelector("div#imgEDesc > img").style.display = "inline";
            }
        }
    
        //Clicks en botones de correcto e incorrecto y equipos.
        if(event.target.id == "btnCorrect" || event.target.id == "btnIncorrect") 
            botonesCheck(event);
    
        //Clicks a equipos 1-2
        if(event.target.id == "team1") {
            //Establece que estás jugando como principal en el equipo 1
            team1Selected = true;
            team1.classList.add('active');
            team2.classList.remove('active');
    
            totalScore.textContent = `Puntos: ${puntuacionT1}`;
    
    
        }
    
        if(event.target.id == "team2") {
            //Establece que estás jugando como principal en el equipo 2
            team1Selected = false;
            team1.classList.remove('active');
            team2.classList.add('active');
    
            totalScore.textContent = `Puntos: ${puntuacionT2}`;
            
        }
    }
    
    /**
     * Función que controla los clicks en los botones de correcto/incorrecto
     * @param {*} event 
     */
    botonesCheck(event) {
    
        //Si no has seleccionado ningún equipo...
        if(team1Selected == null) {
            alert("[ERROR] Selecciona un equipo primero");
        } else 
        {
            //Click en botón de correcto
            if(event.target.id == "btnCorrect" ) {
                console.log("Click en Correcto");
    
                if(stringJson.Preguntas[idPregunta] == undefined) return;
    
                //Pasamos a la siguiente pregunta
                idPregunta++;
    
                sumarPuntos(true);
    
                //Actualizamos los puntos totales
                totalScore.textContent = `Puntos: ${sumarPuntos()}`;
    
                //console.log("Puntos:"+puntuacionT1 + " " + puntuacionT2);
    
                //Mostramos la siguiente imagen                
                document.querySelector("div#imgEDesc > img").src = stringJson.Preguntas[idPregunta].img;
            }
    
            //Click en botón de incorrecto
            if(event.target.id == "btnIncorrect") {
                console.log("Click en Incorrecto");
                
                if(stringJson.Preguntas[idPregunta] == undefined) return;
    
                //Pasamos a la siguiente pregunta
                idPregunta++;
    
                
                sumarPuntos(false);
    
                //Actualizamos los puntos totales
                totalScore.textContent = `Puntos: ${sumarPuntos()}`;
    
                //Ocultamos la imagen
                document.querySelector("div#imgEDesc > img").src = stringJson.Preguntas[idPregunta].img;
            }
        }
    }
}

var app = new Controlador();