class AutomataT {
    constructor(transiciones, alfabeto, qs, qf, qi) {
        this.transiciones = transiciones;
        this.alfabeto = alfabeto;
        this.qs = qs;
        this.qf = qf;
        this.qi = qi;
    }

    print() {
        console.log("_______________Automata______________");
        console.log("Alfabeto", this.alfabeto);
        console.log("Q", this.qs);
        console.log("QF", this.qf);
        console.log("QE", this.qi);
        console.log("Transiciones: ");

        for (const t of this.transiciones) {
            console.log(t.toString());
        }


    }
}


class TransicionT {
    constructor(qe, entrada, qs) {
        this.qe = qe;
        this.entrada = entrada;
        this.qs = qs;
    }

    toString() {
        return `(${this.qe} | ${this.entrada}) = ${this.qs}`;
    }
}

