const fs = require('fs');
const readline = require('readline-sync');

class JSONLangInterpreter {
    constructor() {
        this.variables = {};
        this.functions = {};
        this.executedIf = false;
    }

    evaluateExpression(expression) {
        if (typeof expression === "number") return expression;

        let evaluated = expression.replace(/\((.*?)\)/g, (_, variable) => {
            let trimmedVar = variable.trim();

            let listMatch = trimmedVar.match(/(\w+)\[(\d+)\]/);
            if (listMatch) {
                let listName = listMatch[1];
                let index = parseInt(listMatch[2], 10);
                if (this.variables[listName] && Array.isArray(this.variables[listName])) {
                    return this.variables[listName][index] ?? `(${trimmedVar})`;
                }
            }

            if (this.variables.hasOwnProperty(trimmedVar)) {
                return this.variables[trimmedVar];
            }

            return trimmedVar;
        });

        evaluated = evaluated.replace(/\((.*?)\)\s*(\|\|)\s*\((.*?)\)/g, (match, p1, operator, p2) => {
            if (operator === '||') {
                return (this.evaluateExpression(p1) || this.evaluateExpression(p2)).toString();
            }
            return match;
        }).replace(/\((.*?)\)\s*(&&)\s*\((.*?)\)/g, (match, p1, operator, p2) => {
            if (operator === '&&') {
                return (this.evaluateExpression(p1) && this.evaluateExpression(p2)).toString();
            }
            return match;
        });

        let comparisonMatch = evaluated.match(/(.+?)\s*([=><!]+)\s*(.+)/);
        if (comparisonMatch) {
            let left = this.evaluateExpression(comparisonMatch[1].trim());
            let operator = comparisonMatch[2];
            let right = this.evaluateExpression(comparisonMatch[3].trim());

            switch (operator) {
                case "=": return Number(left) === Number(right);
                case "!=": return Number(left) !== Number(right);
                case ">": return Number(left) > Number(right);
                case "<": return Number(left) < Number(right);
                case ">=": return Number(left) >= Number(right);
                case "<=": return Number(left) <= Number(right);
            }
        }

        if (this.variables.hasOwnProperty(evaluated)) {
            return this.variables[evaluated];
        }

        try {
            return Function(`"use strict"; return (${evaluated});`)();
        } catch (e) {
            return evaluated;
        }
    }

    executeCommand(command) {
        for (let key in command) {
            if (key === "set") {
                for (let varName in command[key]) {
                    this.variables[varName] = this.evaluateExpression(command[key][varName]);
                }
            } else if (key === "show") {
                console.log(...command[key].map(msg =>
                    typeof msg === "string" ? msg.replace(/\((.*?)\)/g, (_, varName) => this.variables[varName] ?? varName) : msg
                ));
            } else if (key === "if") {
                this.executedIf = this.evaluateExpression(command[key].condition);
                if (this.executedIf) {
                    this.executeCommand(command[key].do);
                }
            } else if (key === "else if") {
                if (!this.executedIf && this.evaluateExpression(command[key].condition)) {
                    this.executeCommand(command[key].do);
                    this.executedIf = true;
                }
            } else if (key === "else") {
                if (!this.executedIf) {
                    this.executeCommand(command[key].do);
                }
            } else if (key === "for") {
                let [start, end] = command[key].i.map(i => this.evaluateExpression(i));
                for (let i = start; i <= end; i++) {
                    this.variables["i"] = i;
                    this.executeCommand(command[key].do);
                }
            } else if (key === "while") {
                while (this.evaluateExpression(command[key].condition)) {
                    this.executeCommand(command[key].do);
                }
            } else if (key === "fct") {
                this.functions[command[key].name] = command[key];
            } else if (key === "call") {
                let functionName = command[key].name;
                let fct = this.functions[functionName];

                if (fct) {
                    let args = command[key].args.map(arg => this.evaluateExpression(arg));
                    let localVars = {};

                    fct.args.forEach((arg, index) => {
                        localVars[arg] = args[index];
                    });

                    let interpreter = new JSONLangInterpreter();
                    interpreter.variables = { ...this.variables, ...localVars };
                    interpreter.executeCommand(fct.do);

                    if (fct.return) {
                        let returnVars = fct.return;
                        if (Array.isArray(returnVars)) {
                            this.variables[command[key].name] = returnVars.map(v => interpreter.variables[v] ?? null);
                        } else {
                            this.variables[command[key].name] = interpreter.variables[returnVars] ?? null;
                        }
                    } else {
                        this.variables["result"] = interpreter.variables["result"];
                    }

                    for (let arg of fct.args) {
                        delete this.variables[arg];
                    }
                }
            } else if (key === "ask") {
                let response = readline.question(command[key].q + " ");

                let numericResponse = parseFloat(response);
                if (!isNaN(numericResponse)) {
                    this.variables[command[key].q] = numericResponse;
                } else {
                    this.variables[command[key].q] = response;
                }
            } else if (key === "try") {
                try {
                    this.executeCommand(command[key].do);
                } catch (error) {
                    this.variables["lang_error"] = error.message;
                    if (command[key].catch) {
                        this.executeCommand(command[key].catch.do);
                    }
                }
            } else if (key === "return") {
                this.variables["result"] = this.evaluateExpression(command[key]);
            } else {
                console.log(`Commande inconnue: ${key}`);
            }
        }
    }

    run(jsonCode) {
        this.executedIf = false;
        this.executeCommand(jsonCode);
    }
}

async function jsonscript(path) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur de lecture du fichier:", err);
            return;
        }

        try {
            const jsonScript = JSON.parse(data);
            const interpreter = new JSONLangInterpreter();
            interpreter.run(jsonScript);
        } catch (parseErr) {
            console.error("Erreur de parsing JSON:", parseErr);
        }
    });
}

module.exports = jsonscript;
