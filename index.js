const chalk = require("chalk");
const figlet = require('figlet');
const inquirer = require('inquirer');
const readlineSync = require('readline-sync');
const $ = require("jquery");


class Game{

    constructor()
    {
        this.map;
        this.matches;
        this.line;
        this.titleGame();
        this.promptEarlyGame();  
    }

    titleGame()
    {
        console.log(
            chalk.yellow(
              figlet.textSync('Matches Game', { horizontalLayout: 'full' })
            ));
    }

    promptEarlyGame()
    {
        const lineQuestion = [
            {
                name: "line",
                message: "Choisi un nombre de ligne : ",
                default: '10',
                filter: Number,
                validate: function( value ) 
                {
                    if (Number.isInteger(value) && value >= 1  && value <= 100) 
                    {
                        return true;
                    }
                    else 
                    {
                        return "Rentre un nombre compris entre 1 et 100";
                    }
                  }

            },];

        inquirer.prompt(lineQuestion).then(line => {
            const matchesQuestion = [            {
                name: "matches",
                message: "Choisi un nombre d'allumette compris entre 0 et 100:",
                default: '3',
                filter: Number,
                validate: function( value ) 
                {
                    if (Number.isInteger(value) && value >= 1  && value <= 100 && value < line["line"]) 
                    {
                        return true;
                    } 
                    else 
                    {
                        return "Rentre un nombre compris entre 1 et 100";
                    }
                }
            }];
            inquirer.prompt(matchesQuestion).then(matches => {
                //const line = line["line"];
                //const matche = matches["matches"];
                this.line = line["line"];
                this.matches = matches["matches"];
                this.map = this.createMap(line["line"]);
                this.displayRows();
                this.start();
            })
        });
    }

    createMap(rows)
    {
       let a = [];

        console.log("\n");

        for(let row = 1; row <= rows; row ++) {
            const matche = "|".repeat((row - 1) * 2 + 1);
            const space = " ".repeat(rows - row);
            const endString = space.substr(0) + "*";
            const earlyString = "*" + space.substr(0);
            const matches = earlyString + matche + endString;
            a[row] = matches;
        }

        return a;
    }

    displayRows()
    {
        const map = this.map;
        const rows = this.line;
        this.stars(rows);
        for(let i = 1; i < map.length; i++)
        {
            console.log(map[i] + " " + i);
        }
        this.stars(rows);
    }

    stars(rows)
    {
        let h = "";

        for(let i = 0; i <= rows; i++)
        {
            h += "* ".repeat(1);
        }
        console.log(h);
        return 0;
    }

    playerTurn()
    {
        const allLine = this.line;
        const allMatches = this.matches;

        let line = readlineSync.question("Choisi une ligne :");

        while(isNaN(parseFloat(line)) || line > allLine)
        {
            console.log("Cette ligne n'existe pas. \n");
            line = readlineSync.question("Choisi une ligne :");
        }

        while(this.checkLine(this.map, line) == 0)
        {
            console.log("Cette ligne est vide");
            line = readlineSync.question("Choisi une ligne :");
        }
    
        let matches = readlineSync.question("Choisi une nombre d'allumette:");

        while(isNaN(parseFloat(matches)) || matches > allMatches)
        {
            console.log("Tu peux retirer uniquement jusqu'a " + allMatches + " max.");
            matches = readlineSync.question("Choisi une nombre d'allumette:");
        }

        while(this.checkLine(this.map, line) < matches)
        {
            console.log("Il n'y a pas assez d'allumette sur la ligne.");
            matches = readlineSync.question("Choisi une nombre d'allumette:");
        }


        this.removeMatch(line, matches);

        // const lineQuestion = [{
        //         name: "line",
        //         message: "Choisi une ligne : ",
        //         //default: rand a faire,
        //         filter: Number,
        //         validate: function( value ) 
        //         {
        //             if (Number.isInteger(value) && value >= 1  && value <= allLine) 
        //             {
        //                 return true;
        //             }
        //             else 
        //             {
        //                 return "Rentre un nombre compris entre 1 et " + allLine;
        //             }
        //         }
        // }]

        // inquirer.prompt(lineQuestion).then(line => {
        //     const matchesQuestion = [            {
        //         name: "matches",
        //         message: "Choisi une nombre d'allumette:",
        //         default: '3',
        //         filter: Number,
        //         validate: function( value ) 
        //         {
        //             if (Number.isInteger(value) && value >= 1  && value <= 100 && value <= allMatches) 
        //             {
        //                 return true;
        //             } 
        //             else 
        //             {
        //                 return "Rentre un nombre compris entre 1 et " + allMatches;
        //             }
        //         }
        //     }];
        //     inquirer.prompt(matchesQuestion).then(matches => {
        //         this.removeMatch(line["line"], matches["matches"]);
        //     })
        // });
    }

    removeMatch(line, matches)
    {
        for(let i = 0; i < matches; i++)
        {
            this.map[line] = this.map[line].replace(/\|/, " ");
        }
    }

    checkLine(map, line)
    {
        if(map[line])
        {
           return (map[line].match(/\|/g) || []).length;
        }
        else
        {
            return 1;
        }
    }

    aiTurn2(map)
    {
        let line = Math.floor(Math.random() * this.line) + 1;

        while(this.checkLine(map, line) == 0)
        {
            line = Math.floor(Math.random() * this.line) + 1;
        }

        let matches = Math.floor(Math.random() * this.matches) + 1;

        while(this.checkLine(map, line) < matches)
        {
            matches = Math.floor(Math.random() * this.matches) + 1;
        }

        map = this.removeMatch2(map ,line, matches);

        return {"line" : line, "matches" : matches, "map" : map};
        // echo "AI's turn...\n";
        // echo "AI removed ". matches ." match(es) from line ". line.".\n";
    }

    removeMatch2(map, line, matches)
    {
        for(let i = 0; i < matches; i++)
        {
            map[line] = map[line].replace(/\|/, " ");
        }
        return map;
    }
    


    aiRand()
    {
        let countWin = [];
        const initialMap = [...this.map];
        let map = [...initialMap];
        let i = 0;
        
        while(i != 1000)
        {
            let turn = 0;
            let c = this.countMatches(map);
            let firstTime = true;
            let firstMove = null;

            while(c != 0)
            {
                if(turn %2 == 0)
                {
                    turn = 1;
                    let infoAI = this.aiTurn2(map, this.matches);
                    if (firstTime) {
                        firstMove = infoAI["line"] + "/" + infoAI["matches"];
                        firstTime = false;
                    }
                    map = infoAI["map"];
                    //console.log(this.checkWin(map));
                    if(this.checkWin(map) == 0)
                    {
                        //console.log("Ai 1 win \n");
                        c = this.countMatches(map);
                        map = [...initialMap];
                        countWin[firstMove] = typeof countWin[firstMove] !== "undefined" ? countWin[firstMove] - 5 : -5;
                    }
                }
                else if(turn %2 == 1)
                {

                    turn = 0;
                    let infoAI = this.aiTurn2(map, this.matches);
                    map = infoAI["map"];
                    //var_dump(countWin);
                    //console.log(this.checkWin(map));

                    if(this.checkWin(map) == 0)
                    {
                        //console.log("Ai 2 win \n");
                        c = this.countMatches(initialMap);
                        map = [...initialMap];
                        countWin[firstMove] = typeof countWin[firstMove] !== "undefined" ? countWin[firstMove] + 5 : 5;

                    }
                }
            }
            i++;
        }
        const getMax = Object.values(countWin);
        const max = Math.max(...getMax);
        return Object.keys(countWin).find(key => countWin[key] === max);
    }

    aiPlay(comb)
    {
        const c = comb.split("/");
        const line = c[0];
        const matches = c[1];

        this.removeMatch(line, matches);
        console.log("\nAI's turn...\n");
        console.log("AI removed "+ matches +" match(es) from line "+ line + "\n");
    }


    
    start()
    {
        let c = this.countMatches(this.map);
        let turn = 0;

        while(c != 0)
        {
            if(turn %2 == 0)
            {
                turn = 1;
                this.playerTurn();
                this.displayRows();
    
                if(this.checkWin(this.map) == 0)
                {
                    console.log("You lost, too bad...");
                    return 0;
                }
            }
            else if(turn %2 == 1)
            {
                turn = 0;
                const comb = this.aiRand();
                this.aiPlay(comb);
                this.displayRows();

    
                if(this.checkWin(this.map) == 0)
                {
                    console.log("I'm lose you are very strong.");
                    return 0;
                }
            }
        }

    }

    countMatches(map)
    {
        let sum = 0;

        for(let i = 1; i < map.length; i++)
        {
            let m = map[i];
            let add = (m.match(/\|/g) || []).length;
            sum += add;
        }

        return sum;
    }

    checkWin(map)
    {
        return this.countMatches(map);
    }
}

//const game = new Game();
module.exports = Game;
