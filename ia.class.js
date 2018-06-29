var mlp = require('./multipleLayersPerceptron.class.js');
var sp = require('./simplePerceptron.class.js');
var fs = require('fs');

class ia {
    constructor(params){
        this.n = params.n;
        this.p = params.p;
        this.q = params.q;
        this.qn = params.qn;
        this.dataTrain = params.datatrain;
        this.dataTest = params.datatest;
        this.iter = params.iter;
        this.alpha = params.alpha;
        this.activation = params.activation;
        this.cleanOutput = params.cleanOutput;
        if(this.q.length == 0){
            this.network=new sp({
                n:this.n,
                p:this.p,
                activation: this.activation,
            });
        }else{
            this.network=new mlp({
                n:this.n,
                q:this.q,
                activation: this.activation,
                dataTest:this.dataTest,
                cleanOutput:this.cleanOutput,
            });
        }
    }

    learning(){
        this.training();
        this.testing();
    }
    
    training(){
        this.network.learn(this.dataTrain, this.iter, this.alpha);
        this.network.saveNetwork('saves/network.json');
    }

    testing(){
        var cpt = 0
        for(var i=0 ; i<this.dataTest.inputs.length ;i++){
            var output = this.network.predict(this.dataTest.inputs[i]);
            var prediction = this.cleanOutput(output);
            var result = this.cleanOutput(this.dataTest.outputs[i]);
            if(result==prediction){
                cpt++
            }
        }
        console.log(cpt +"/"+ this.dataTest.inputs.length);
        console.log(cpt*100/this.dataTest.inputs.length + "%");
    }
}
module.exports = ia;