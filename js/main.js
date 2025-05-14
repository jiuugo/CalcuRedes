const btnCalcular = document.getElementById("btnCalcular");

const ip = document.getElementById("ip");

const idCompleta = document.getElementById("idCompleta");
const claseRed = document.getElementById("claseRed");
const mascaraRed = document.getElementById("mascaraRed");
const tipoRed = document.getElementById("tipoRed");

const tblInfo = document.getElementById("tblInfo");

let octetos = [];
let ipCompleta = "";

btnCalcular.addEventListener("click", () => {
    accionCalcular();
});

function accionCalcular() {
    ipCompleta = ip.value;

    if (!validarIP()) return;

    obtieneOctetos();

    


    muestraResultado();

    tblInfo.style.display = "table";

}

//aqui irá la función que valida el input y le da el color correspondiente
ip.addEventListener("input", (e) => {

});


function obtieneOctetos(){
    octetos = [];

    for(let i = 0; i < ip.value.length; i++){
        if(ip.value[i] == "."){
            octetos.push(ip.value.substring(0, i));
            ip.value = ip.value.substring(i + 1);
            i = 0;
        }
    }
    ip.value=ipCompleta;
}




function validarIP() {

  const regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
 
  if (regex.test(ipCompleta)) {
    return true;

  } else {
    alert("La dirección IP no es válida. Asegúrate de que cada octeto esté entre 0 y 255.");
    return false;
  }

}
 

function muestraResultado() {

    let claseIP = calculaClaseIP();
    let mascara = calculaMascara(claseIP);
    let tipo = calculaTipoRed(claseIP);

    idCompleta.innerHTML = ipCompleta;
    claseRed.innerHTML = claseIP;
    mascaraRed.innerHTML = mascara;
    tipoRed.innerHTML = tipo;
}

function calculaClaseIP() {
    if (octetos[0] < 128) {
        return "A";
    }
    if (octetos[0] < 192) {
        return "B";
    }
    if (octetos[0] < 224) {
        return "C";
    }
    if (octetos[0] < 240) {
        return "D";
    }
    if (octetos[0] < 256) {
        return "E";
    }
}

function calculaMascara(claseIP) {
    switch (claseIP) {
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
    switch (claseIP) {
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