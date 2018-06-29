var fs = require('fs');

class parser {
    constructor(pathDataTrain, pathDataTest){
        this.n = 0;
        this.p = 0;
        this.dataTrain = fs.readFileSync(pathDataTrain, { encoding : 'utf8'}).split(/\s+/);
        this.dataTest = fs.readFileSync(pathDataTest, { encoding : 'utf8'}).split(/\s+/);
    }

    poker(data){
        this.n = 10;
        this.p = 10;
        this.learnValues = {
                        inputs:[],
                        outputs:[]
        }
        for(var i=0; i<data.length ;i++){
            var tmp = data[i].split(",");
            for(var l=0 ; l<tmp.length ; l++){
                tmp[l] = tmp[l]*1;
            }
            var out = tmp.pop()*1;
            this.learnValues.outputs[i] = [];
            for(var a=0 ; a<this.p ; a++){
                var output = 0;
                if(a == out) output = 1;
                this.learnValues.outputs[i][a] = output;
            }
            for(var z=0 ; z<tmp.length ; z++){
                tmp[z] = (tmp[z]*1);
            }
            this.learnValues.inputs[i] = tmp;      
        }
        return this.learnValues
    }
    
    poker2(data){
    	this.n = 5;
    	this.p = 10;
        this.learnValues = {
                inputs:[],
                outputs:[]
    	}
        for(var i=0; i<data.length; i++){
        	var tmp = data[i].split(",");
        	var input = [];
            for(var l=0 ; l<tmp.length ; l++){
                tmp[l] = tmp[l]*1;
            }
            
            var out = tmp.pop()*1;
            this.learnValues.outputs[i] = [];
            for(var a=0 ; a<this.p ; a++){
                var output = 0;
                if(a == out) output = 1;
                this.learnValues.outputs[i][a] = output;
            }
            
        	for(var j=0; j<tmp.length-1; j=j+2){
        			input.push((((tmp[j]*13)-13)+tmp[j+1]));
        	}
        	this.learnValues.inputs[i] = input; 
        }
        return this.learnValues
    }
    
    poker3(data){
    	this.n = 52;
    	this.p = 10;
        this.learnValues = {
                inputs:[],
                outputs:[]
    	}
        for(var i=0; i<data.length; i++){
        	var tmp = data[i].split(",");
            for(var l=0 ; l<tmp.length ; l++){
                tmp[l] = tmp[l]*1;
            }
            
            var out = tmp.pop()*1;
            this.learnValues.outputs[i] = [];
            for(var a=0 ; a<this.p ; a++){
                var output = 0;
                if(a == out) output = 1;
                this.learnValues.outputs[i][a] = output;
            }
            
            this.learnValues.inputs[i] = [];
            var inp=[];
        	for(var j=0; j<tmp.length; j=j+2){
    			inp.push((((tmp[j]*13)-13)+tmp[j+1]));
        	}
            
            for(var b=0; b<this.n; b++){
            	for(var e=0; e<inp.length; e++){
                    var input = 0;
                    if(b == inp[e]-1){
                    	input = 1;
                    	break;
                    }
                }
            	this.learnValues.inputs[i][b] = input;
            }
        }
        return this.learnValues
    }

    tictac(data){
        this.n = 27;
        this.p = 2;
        this.learnValues = {
                        inputs:[],
                        outputs:[]
        }
        for(var i=0; i<data.length ;i++){
            var tmp = data[i].split(",");
            var input = new Array();
            var output = new Array();
            for(var l=0 ; l<tmp.length ; l++){
                switch(tmp[l]) {
                case 'x':
                    input = input.concat([1,0,0]);
                    break;
                case 'o':
                    input = input.concat([0,1,0]);
                    break;
                case 'negative':
                    output = [0,1];
                    break;
                case 'positive':
                    output = [1,0];
                    break;
                case 'b':
                    input = input.concat([0,0,1]);
                    break;
                }
            }
            this.learnValues.outputs[i] = output;
            this.learnValues.inputs[i] = input;      
        }
        return this.learnValues
    }
}

module.exports = parser;