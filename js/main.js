const btnCalcular = document.getElementById("btnCalcular");

const ip = document.getElementById("ip");

const idCompleta = document.getElementById("idCompleta");
const claseRed = document.getElementById("claseRed");
const mascaraRed = document.getElementById("mascaraRed");
const tipoRed = document.getElementById("tipoRed");
const wildcard = document.getElementById("wildcard");
const dirRed = document.getElementById("dirRed");
const dirBroadcast = document.getElementById("dirBroadcast");

const idBinario = document.getElementById("idBinario");
const binarioSubred = document.getElementById("binarioSubred");
const binarioWild = document.getElementById("binarioWild");
const binarioDirRed = document.getElementById("binarioDirRed");
const binarioDirBroadcast = document.getElementById("binarioDirBroadcast");


const tblInfo = document.getElementById("tblInfo");
const tblInfo2 = document.getElementById("tblInfo2");

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
    tblInfo2.style.display = "table";

}

//aqui irá la función que valida el input y le da el color correspondiente
ip.addEventListener("input", (e) => {

});


function obtieneOctetos(direccion) {
    let octetos = [];

    for (let i = 0; i < direccion.length; i++) {
        if (direccion[i] == ".") {
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
    let wildcardValor = calculaWildcard();



    let mascaraEnBinario = direccionABinario(mascara);
    let ipABinario = direccionABinario(ipCompleta);
    let wildcardABinario = direccionABinario(wildcardValor);


    let direccionRedBinario = calculaDireccionRed(ipABinario, mascaraEnBinario);
    let direccionDecimal = direccionADecimal(direccionRedBinario);

    let broadcastBinario = calculaBroadcast(direccionRedBinario, mascaraEnBinario);
    let broadcastDecimal = direccionADecimal(broadcastBinario);


    idCompleta.innerHTML = ipCompleta;
    claseRed.innerHTML = claseIP;
    mascaraRed.innerHTML = mascara;
    tipoRed.innerHTML = tipo;
    wildcard.innerHTML = wildcardValor;
    dirRed.innerHTML = direccionDecimal;
    dirBroadcast.innerHTML = broadcastDecimal;

    idBinario.innerHTML = ipABinario;
    binarioSubred.innerHTML = mascaraEnBinario;
    binarioWild.innerHTML = wildcardABinario;
    binarioDirRed.innerHTML = direccionRedBinario;
    binarioDirBroadcast.innerHTML = broadcastBinario;

}

function calculaBroadcast(direccionRedBinario, mascaraEnBinario) {
    let dirBroadcast = direccionRedBinario;

    for (let i = 0; i < mascaraEnBinario.length; i++) {
        if (mascaraEnBinario[i] != 1) {
            dirBroadcast[i] = "1";
            continue;
        }

    }


    return dirBroadcast;
}

function calculaDireccionRed(ipABinario, mascaraEnBinario) {
    let direccionRed = "";

    for (let i = 0; i < ipABinario.length; i++) {
        if (ipABinario[i] === ".") {
            direccionRed += ".";
            continue;
        }

        if (ipABinario[i] & mascaraEnBinario[i]) {
            direccionRed += "1";
        } else {
            direccionRed += "0";
        }
    }
    return direccionRed;
}

function direccionABinario(direccion) {
    let octetosDireccion = obtieneOctetos(direccion);
    let octetosBinario = [];

    for (octeto of octetosDireccion) {
        let binario = decimalABinario(parseInt(octeto, 10));
        let binarioNuevo = "";

        if (binario.length < 8) {
            for (let i = 0; i < 8 - binario.length; i++) {
                binarioNuevo += "0";
            }
            binarioNuevo += binario;
            binario = binarioNuevo;
        }


        octetosBinario.push(binario);
    }
    return convierteArrayADireccion(octetosBinario);
}

function direccionADecimal(direccion) {
    let octetosDireccion = obtieneOctetos(direccion);
    let octetosDecimal = [];

    for (octeto of octetosDireccion) {
        let decimal = binarioADecimal(parseInt(octeto, 2));

        octetosDecimal.push(decimal);
    }
    return convierteArrayADireccion(octetosDecimal);
}

function calculaWildcard() {
    let octetosMascara = obtieneOctetos(mascara);
    let wildcard = [];

    for (octeto of octetosMascara) {
        wildcard.push(255 - octeto);
    }
    return convierteArrayADireccion(wildcard);
}

function convierteArrayADireccion(array) {
    let direccion = "";
    for (cadena of array) {
        direccion += cadena;
        direccion += "."
    }
    direccion = direccion.substring(0, direccion.length - 1);
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

function calculaCidr() {
    let octetosMascara = obtieneOctetos(mascara);

    let mascaraBinaria = "";
    let cidr = 0;

    for (octeto of octetosMascara) {
        mascaraBinaria += decimalABinario(parseInt(octeto, 10));
    }

    for (let i = 0; i < mascaraBinaria.length; i++) {
        if (mascaraBinaria[i] == 1) {
            cidr++;
        }
    }

    return cidr;
}

function decimalABinario(decimal) {
    return decimal.toString(2);
}
function binarioADecimal(binario) {
    return binario.toString(10);
}