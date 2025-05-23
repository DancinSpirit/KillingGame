const Modifier = require("./modifier.js");

class Dice{
    constructor(){
        this.critFails = 0;
        this.critSuccesses = 0;
        this.modList = [];
        this.critModList = [];
        this.nextLine = "";
        this.rollString = "";
        this.customRollList = [];
        this.latestResult = 0;
        this.latestList = [];
        this.latestCritCount = 0;
        this.latestCritFailCount = 0;
        this.latestRollString = "";
    }

    addModifier(modifier){
        if(modifier)
            this.modList.push(new Modifier(modifier.name,modifier.value))
    }

    returnMods(){
        let modString = "";
        let modNum = 0;
        if(this.modList.length){
            for(let x=0; x<this.modList.length; x++){
                modNum = modNum + this.modList[x].value;
                if(this.modList[x].value>-1){
                    modString += " + " + this.modList[x].value + " (" + this.modList[x].name + ")";
                }else{
                    modString += " - " + this.modList[x].value*-1 + " (" + this.modList[x].name + ")";
                }
            }
        }
        if(this.critModList.length){
            for(let x=0; x<this.critModList.length; x++){
                modNum = modNum + this.critModList[x].value;
                if(this.critModList[x].value>-1){
                    modString += " + " + this.critModList[x].value;
                }else{
                    modString += " - " + this.critModList[x].value*-1;
                }
                if(this.critModList[x].name != "None"){
                    modString += " (" + this.critModList[x].name + ")";
                }
            }
            this.critModList = [];
        }
        this.nextLine += modString;
        return modNum;
    }

    natRoll(){
        let roll = Math.floor(Math.random()*9);
        this.latestList = [roll];
        return roll;
    }

    reroll(){
        if(this.customRollList.length){
            this.naturalRoll = this.customRollList.splice(0,1)[0];
        }else{
            this.naturalRoll = this.natRoll();
        }
        return this.rollCalc();
    }

    printLine(){
        console.log(this.nextLine);
        this.rollString += this.nextLine + "\n";
        this.nextLine = "";
    }

    rollCalc(){
        this.nextLine += this.naturalRoll;
        let total = this.naturalRoll;
        if(this.modList.length||this.critModList.length){
            total = this.naturalRoll + this.returnMods();
            this.nextLine += " = " + total;
        }
        this.printLine();
        if(total>7){
            this.critSuccesses++;
            this.modList = [];
            if(!((total-7)==0)){
                this.critModList.unshift(new Modifier("None",(total-8)));
            }
            this.nextLine = "Crit Success " + this.critSuccesses + ": ";
            total = this.reroll();
        }
        if(total<1){
            this.critFails++;
            this.modList = [];
            if(!(total==0)){
                this.critModList.unshift(new Modifier("None",total));
            }
            this.nextLine = "Crit Fail " + this.critFails + ": ";
            total = this.reroll();
        }
        return total;
    }

    critCalc(roll){
        let result = roll;
        for(let x=0; x<this.critSuccesses; x++){
            result = result*10;
        }
        for(let x=0; x<this.critFails; x++){
            result = result/10;
        }
        this.nextLine = ("Total: " + result);
        this.printLine();
        return result;
    }

    roll(){
        this.latestList = [];
        this.naturalRoll = this.natRoll();
        let roll = this.rollCalc();
        let finalResult = this.critCalc(roll);
        this.latestResult = finalResult;
        let returnString = this.rollString;
        this.latestRollString = this.rollString;
        this.latestCritCount = this.critSuccesses;
        this.latestCritFailCount = this.critFails;
        this.reset();
        return returnString.replace("\n","");
    }

    customRollFull(list){
        this.latestList = list;
        this.customRollList = list;
        this.naturalRoll = this.customRollList.splice(0,1)[0];
        let roll = this.rollCalc();
        let finalResult = this.critCalc(roll);
        this.latestResult = finalResult;
        let returnString = this.rollString;
        this.latestRollString = this.rollString;
        this.latestCritCount = this.critSuccesses;
        this.latestCritFailCount = this.critFails;
        this.reset();
        return returnString.replace("\n","");
    }

    customRoll(list){
        this.customRollList = list;
        this.naturalRoll = this.customRollList.splice(0,1)[0];
        let roll = this.rollCalc();
        let finalResult = this.critCalc(roll);
        this.reset();
        return finalResult;
    }

    reset(){
        this.naturalRoll = 0;
        this.critFails = 0;
        this.trueCritFails = 0;
        this.critSuccesses = 0;
        this.trueCritSuccesses = 0;
        this.rollString = "";
        this.critModList = [];    
    }

    clear(){
        this.reset();
        this.modList = [];
    }

}

module.exports = new Dice();