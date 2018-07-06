var mlp = require('./multipleLayersPerceptron.class.js');
var sp = require('./simplePerceptron.class.js');
var log = require('single-line-log').stdout;
var fs = require('fs');

class ia {
    constructor(params){
        this.n = params.n;
        this.p = params.p;
        this.q = params.q;
        this.dataTrain = params.datatrain;
        this.dataTest = params.datatest;
        this.iter = params.iter;
        this.alpha = params.alpha;
        this.activation = params.activation;
        this.cleanOutput=function(output){
            return output.indexOf(Math.max.apply(null, output));
        }
        if(this.q.length == 0 || !this.q){
            this.network=new sp({
                n:this.n,
                p:this.p,
                activation: this.activation,
                dataTest:this.dataTest,
            });
        }else{
            this.network=new mlp({
                n:this.n,
                q:this.q,
                activation: this.activation,
                dataTest:this.dataTest,
            });
        }
    }

    training(){
        console.log("Training...")
        var now = new Date();
        this.network.learn(this.dataTrain, this.iter, this.alpha);
        this.network.saveNetwork('saves/'+now.getDate()+"-"+(now.getMonth() + 1)+"|"+now.getHours()+":"+now.getMinutes()+'.json');
    }

    testing(){
        console.log("Testing...")
        var cpt=0;
        for(var i=0; i<this.dataTest.inputs.length ;i++){
            var output = this.network.predict(this.dataTest.inputs[i]);
            var prediction = this.cleanOutput(output);
            var result = this.cleanOutput(this.dataTest.outputs[i]);
            if(result==prediction) cpt++;
        }
        console.log("Predict "+ cpt +"/"+ this.dataTest.inputs.length + ' | ' + (cpt*100/this.dataTest.inputs.length)+'%');
    }
}
module.exports = ia;