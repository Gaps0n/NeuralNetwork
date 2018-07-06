const fs = require('fs');
var ver = require('./ver');

class textMining {
    constructor(data){
        this.data = data;
        this.stopWords = fs.readFileSync("../resources/stopwords_fr.json", 'utf-8').toString();
        this.stopWords = JSON.parse(this.stopWords);
        
    }
    cleanText(){
        this.data = this.data.replace(/[^a-zA-Z0-9\u00C0-\u00FF]+/g, ' ').split(' ');
        this.data = this.data.filter(word => word.length > 3);
        for(var i=0; i<this.stopWords.length; i++){
            for(var j=0; j<this.data.length; j++){
                this.data[j] = this.data[j].toLowerCase();
                if(this.stopWords[i] == this.data[j]){
                    this.data.splice(j, 1);
                }
            }
        }
        
        for(var i=0; i<ver.lexi.length; i++){
            for(var j=0; j<this.data.length; j++){
                if(ver.lexi[i].word == this.data[j]){
                    this.data[j] = ver.lexi[i].lemma;
                }
            }
        }
    }
    
    extractParams(){
        var hyperParams = [];
        for(var i=0; i<this.data.length; i++){
            hyperParams.push({
                word: this.data[i],
                occurences: 0,
                frequency: 0
            });
            for(var j=0; j<this.data.length; j++){
                if(this.data[i] == this.data[j]){
                    hyperParams[i].occurences+=1
                }
            }
        }
        
        for(var i=0; i<hyperParams.length; i++){
            for(var j=0; j<hyperParams.length; j++){
                if(hyperParams[i] == hyperParams[j]){
                    hyperParams.splice(j, 1);
                }
            }
        }
        
        for(var i=0; i<hyperParams.length; i++){
            hyperParams[i].frequency = hyperParams[i].occurences / hyperParams.length;
        }
        this.hyperParams = hyperParams;
        return this.hyperParams;
    }
}


var data = fs.readFileSync('../resources/cours_neurone.txt', 'utf8');
var text = new textMining(data);
text.cleanText();
console.log(text.extractParams());

