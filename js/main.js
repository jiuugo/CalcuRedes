const btnCalcular = document.getElementById("btnCalcular");

const octetos = document.getElementsByClassName("octeto");
const octeto1 = document.getElementById("octeto1");
const octeto2 = document.getElementById("octeto2");
const octeto3 = document.getElementById("octeto3");
const octeto4 = document.getElementById("octeto4");


btnCalcular.addEventListener("click", accionCalcular());

function accionCalcular() {
    if(!validaOctetos()) return;

    muestraResultado();


}


function validaOctetos() {
    for(octeto of octetos) {
        if( octeto.value < 0 || octeto.value > 255) {
            alert("El valor de los octetos debe estar entre 0 y 255");
            return false;
        }
    }
    return true;
}

function muestraResultado() {

    let claseIP = calculaClaseIP();
    let mascara = calculaMascara(claseIP);
    let tipoRed = calculaTipoRed(claseIP);

    
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