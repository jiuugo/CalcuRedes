const btnCalcular = document.getElementById("btnCalcular");

const octetos = document.getElementsByClassName("octeto");
const octeto1 = document.getElementById("octeto1");
const octeto2 = document.getElementById("octeto2");
const octeto3 = document.getElementById("octeto3");
const octeto4 = document.getElementById("octeto4");

const idCompleta = document.getElementById("idCompleta");
const claseRed = document.getElementById("claseRed");
const mascaraRed = document.getElementById("mascaraRed");
const tipoRed = document.getElementById("tipoRed");


btnCalcular.addEventListener("click", () => {
    accionCalcular();
});

function accionCalcular() {
    if(!validaOctetos()) return;

    muestraResultado();


}

for (let octeto of octetos) {
    octeto.addEventListener("input", (e) => {
        const value = e.target.value;
        if (value >= 0 && value <= 255) {
            e.target.style.boxShadow = "0 0 5px 2px green";
            e.target.style.border = "green 2px solid";
            e.target.style.color = "green";
        } else {
            e.target.style.boxShadow = "0 0 5px 2px red";
            e.target.style.border = "red 2px solid";
            e.target.style.color = "red";
        }
    });
}


function validaOcteto(octeto){
    if(octeto.value < 0 || octeto.value > 255 || octeto.value == ""){
        return false;
    }
    return true;
}


function validaOctetos() {
    for(octeto of octetos) {
        if(!validaOcteto(octeto)) {
            alert("El valor de los octetos debe estar entre 0 y 255.");
            return false;
        }
    }
    return true;
}

function muestraResultado() {

    let ip = octeto1.value + "." + octeto2.value + "." + octeto3.value + "." + octeto4.value;
    let claseIP = calculaClaseIP();
    let mascara = calculaMascara(claseIP);
    let tipo = calculaTipoRed(claseIP);

    idCompleta.innerHTML = ip;
    claseRed.innerHTML = claseIP;
    mascaraRed.innerHTML = mascara;
    tipoRed.innerHTML = tipo;
}

function calculaClaseIP() {
    if(octeto1.value < 128) {
        return "A";
    }
    if(octeto1.value < 192) {
        return "B";
    }
    if(octeto1.value < 224) {
        return "C";
    }
    if(octeto1.value < 240) {
        return "D";
    }
    if(octeto1.value < 256) {
        return "E";
    }
}

function calculaMascara(claseIP) {
    switch(claseIP) {
        case "A":
            return "255.0.0.0";
        case "B":
            return "255.255.0.0";
        case "C":
            return "255.255.255.0";
        default:
            return "No aplica";
    }
}
function calculaTipoRed(claseIP) {
    switch(claseIP) {
        case "A":
            return "Red pública";
        case "B":
            return "Red privada";
        case "C":
            return "Red pública";
        default:
            return "No aplica";
    }
}