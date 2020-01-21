
var operadores = ["*", ".", "|", "(", ")"];
var opr2var = ["|", "."];

function toPostfix(infija) {
    let prec = {};
    prec["*"] = 2;
    prec["."] = 1;
    prec["|"] = 0;

    let opStack = [];
    let postfixList = [];

    let postfija = "";

    for (const caracter of infija) {
        if (!operadores.includes(caracter)) {
            postfixList.push(caracter);
        }
        else if (caracter === '(') {
            opStack.push(caracter);
        }
        else if (caracter === ')') {
            let topToken = opStack.pop();
            while (topToken != "(") {
                postfixList.push(topToken);
                topToken = opStack.pop();
            }
        } else {
            while (opStack.length != 0 && (prec[opStack[opStack.length - 1]] >= prec[caracter])) {
                postfixList.push(opStack.pop())

            }
            opStack.push(caracter)
        }
    }
    while (opStack.length > 0) {
        postfixList.push(opStack.pop())
    }
    postfija = "";
    postfija = postfixList.join("");
    return postfija;
}


function evaluar(expresion) {
    let pila = [];
    for (let i = 0; i < expresion.length; i++) {
        let c = expresion[i];
        if (operadores.includes(c)) {
            // Evaluar
            let a = parseInt(pila.pop());
            let resultado;
            if (opr2var.includes(c)) {
                let b = parseInt(pila.pop());
                switch (c) {
                    case "|":
                        resultado = or(b, a);
                        break;
                    case ".":
                        resultado = and(b, a);
                        break;
                }
            }
            if (c === "*") {
                resultado = not(a);
            }

            pila.push(resultado);
            iAux += 1;
        } else {
            pila.push(c);
        }
    }

    return pila.pop();
}

function unirAlfabeto(a, b) {
    let alfabeto = [];

    for (const car of a.alfabeto) {
        if (!alfabeto.includes(car)) {
            alfabeto.push(car);
        }
    }

    for (const car of b.alfabeto) {
        if (!alfabeto.includes(car)) {
            alfabeto.push(car);
        }
    }
    return alfabeto.sort();
}

function unirEstados(a, b) {
    let estados = [];
    for (const q of a.qs) {
        if (!estados.includes(q)) {
            estados.push(q);
        }
    }
    for (const q of b.qs) {
        if (!estados.includes(q)) {
            estados.push(q);
        }
    }
    return estados.sort();
}

function unirTransiciones(a, b) {
    return a.transiciones.concat(b.transiciones);
}



function or(a, b) {
    let e0 = nextQ();
    let e01 = a.qi;
    let e02 = b.qi;
    let ef1 = a.qf;
    let ef2 = b.qf;
    let ef0 = nextQ();

    let transiciones = unirTransiciones(a, b);
    let alfabeto = unirAlfabeto(a, b);
    let estados = unirEstados(a, b);

    estados.push(e0);
    estados.push(ef0);
    estados = estados.sort();


    //https://upload.wikimedia.org/wikipedia/commons/2/20/Suma_ER_AFND-e.png
    transiciones.push(new TransicionT(e0, "", e01));
    transiciones.push(new TransicionT(e0, "", e02));
    transiciones.push(new TransicionT(ef1, "", ef0));
    transiciones.push(new TransicionT(ef2, "", ef0));
    return new AutomataT(transiciones, alfabeto, estados, ef0, e0)
}

function and(a, b) {
    let e01 = a.qi;
    let e02 = b.qi;
    let ef1 = a.qf;
    let ef2 = b.qf;

    let transiciones = unirTransiciones(a, b);
    let alfabeto = unirAlfabeto(a, b);
    let estados = unirEstados(a, b);
    // https://upload.wikimedia.org/wikipedia/commons/5/5c/Concat_ER_AFND-e.jpg
    transiciones.push(new TransicionT(ef1, "", e02));
    return new AutomataT(transiciones, alfabeto, estados, ef2, e01);
}

function kleen(a) {
    let e01 = a.qi;
    let ef1 = a.qf;
    let e0 = nextQ();
    let ef0 = nextQ();
    let estados = a.qs;
    estados.push(e0);
    estados.push(ef0);

    // https://upload.wikimedia.org/wikipedia/commons/f/f8/Clausura_ER_AFND-e.jpg
    let transiciones = a.transiciones;
    transiciones.push(new TransicionT(e0, "", e01));
    transiciones.push(new TransicionT(e0, "", ef0));
    transiciones.push(new TransicionT(ef1, "", e01));
    transiciones.push(new TransicionT(ef1, "", ef0));

    return new AutomataT(transiciones, a.alfabeto, estados, ef0, e0);
}

function nextQ() {
    contadorAutomatas += 1;
    return contadorAutomatas;
}



let automatasIniciales = {};
let infija = "(a|b)*";
let postfija = toPostfix(infija);
let alfabeto = [];
let contadorAutomatas = -1;
//Identificar el alfabeto
for (const c of postfija) {
    if (!alfabeto.includes(c) && !operadores.includes(c)) {
        alfabeto.push(c);
    }
}


alfabeto = alfabeto.sort();

//Alfabeto
console.log(alfabeto);
//Expresion posfija
console.log(postfija);




//Constrir automatas iniciales, para las futuras referencias
for (const car of alfabeto) {

    let a = nextQ();
    let b = nextQ();

    let transiciones = [
        new TransicionT(a, car, b)
    ];
    automatasIniciales[car] = new AutomataT(transiciones, [car], [a, b], b, a);
    automatasIniciales[car].print();
}

/* let aResultante = and(automatasIniciales['a'], automatasIniciales['b']);
aResultante.print(); */




aKleen = kleen(automatasIniciales['a']);
bKleen = kleen(automatasIniciales['b']);

kleen(or(automatasIniciales['a'], automatasIniciales['b'])).print();




