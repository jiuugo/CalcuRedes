const btnCalcular = document.getElementById("btnCalcular");

const ip = document.getElementById("ip");

const idCompleta = document.getElementById("idCompleta");
const claseRed = document.getElementById("claseRed");
const mascaraRed = document.getElementById("mascaraRed");
const tipoRed = document.getElementById("tipoRed");
const wildcard = document.getElementById("wildcard");

const tblInfo = document.getElementById("tblInfo");

let octetosIp = [];
let ipCompleta = "";
let cidr = 24;
let mascara = "";

btnCalcular.addEventListener("click", () => {
    accionCalcular();
});

function accionCalcular() {
    ipCompleta = ip.value;

    if (!validarIP()) return;

    octetosIp = obtieneOctetos(ipCompleta);

    


    muestraResultado();

    tblInfo.style.display = "table";

}

//aqui irá la función que valida el input y le da el color correspondiente
ip.addEventListener("input", (e) => {

});


function obtieneOctetos(direccion){
    let octetos = [];

    for(let i = 0; i < direccion.length; i++){
        if(direccion[i] == "."){
            octetos.push(direccion.substring(0, i));
            direccion = direccion.substring(i + 1);
            i = 0;
        }
    }
    octetos.push(direccion);
    return octetos;
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
    mascara = calculaMascara(claseIP);
    let tipo = calculaTipoRed(claseIP);
    cidr = calculaCidr();
    let wildcardValor = calculaWildcard(cidr);

    let mascaraEnBinario = direccionABinario(mascara);
    let ipABinario = direccionABinario(ipCompleta);
    let wildcardABinario = direccionABinario(wildcardValor);

    alert(mascaraEnBinario);

    idCompleta.innerHTML = ipCompleta;
    claseRed.innerHTML = claseIP;
    mascaraRed.innerHTML = mascara;
    tipoRed.innerHTML = tipo;
    wildcard.innerHTML = wildcardValor;
}

function direccionABinario(direccion){
    let octetosDireccion = obtieneOctetos(direccion);
    let octetosBinario = [];

    for(octeto of octetosDireccion){
        octetosBinario.push(decimalABinario(parseInt(octeto,10)));
    }
    return convierteArrayADireccion(octetosBinario);
}

function calculaWildcard(){
    let octetosMascara = obtieneOctetos(mascara);
    let wildcard = [];

    for(octeto of octetosMascara){
        wildcard.push(255-octeto);
    }
    return convierteArrayADireccion(wildcard);
}

function convierteArrayADireccion(array){
    let direccion = "";
    for(cadena of array){
        direccion += cadena;
        direccion += "."
    }
    direccion = direccion.substring(0,direccion.length-1);
    return direccion;
}

function calculaClaseIP() {
    if (octetosIp[0] < 128) {
        return "A";
    }
    if (octetosIp[0] < 192) {
        return "B";
    }
    if (octetosIp[0] < 224) {
        return "C";
    }
    if (octetosIp[0] < 240) {
        return "D";
    }
    if (octetosIp[0] < 256) {
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

function calculaCidr(){
    let octetosMascara = obtieneOctetos(mascara);

    let mascaraBinaria = "";
    let cidr = 0;

    for(octeto of octetosMascara){
        mascaraBinaria += decimalABinario(parseInt(octeto,10));
    }

    for(let i=0; i<mascaraBinaria.length;i++){
        if(mascaraBinaria[i]==1){
            cidr++;
        }
    }

    return cidr;
}

function decimalABinario(decimal) {
    return decimal.toString(2);
}