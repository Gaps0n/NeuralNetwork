var neurone = require('./neurone.class.js')
var activationFunction = require('./activationFunction.class.js')
var log = require('single-line-log').stdout;
var babar = require('babar');
var fs = require('fs')

class simplePerceptron{
    constructor({
        n:n,
        p:p,
        inputs:inputs,
        weights:weights,
        activation:activation,
        dataTest:dataTest
    }) {
        this.n=n;
        this.p=p;
        this.activation=activation;
        this.testValues=dataTest;
        this.cleanOutput=function(output){
            return output.indexOf(Math.max.apply(null, output));
        }
        this.stats = {
                        currentIter:[],
                        amountPrediction:[],
                        percentage:[],
                        amountValue:this.testValues.inputs.length,
        }
        if (inputs) {
            this.inputs=inputs;
        } else {
            this.inputs=this.emptyArray();
        }
        if (weights) {
            this.weights=weights;
        } else {
            this.weights=[];
        }
        this.initializeNetwork();
    }

    initializeNetwork() {
        this.neurones=[];
        for (var i=0; i<this.p; i++) {
            var params={
                            n:this.n,
                            p:this.p,
                            inputs:this.inputs,
                            activation:this.activation
            };
            if (this.weights.length) {
                params.weights=this.weights[i];
            }
            this.neurones.push(new neurone(params));
        }
    }

    setInputs(inputs) {
        this.inputs=inputs;
        for (var i=0; i<this.p; i++) {
            this.neurones[i].setInputs(inputs);
        }
    }

    setWeights(weights){
        this.weights=weigths
    }

    predict(input){
        this.setInputs(input);
        var res = this.getOutput()
        return res;
    }

    learn(learnValues,iter,alpha) {
        var graph=[];
        for (var i=0; i<iter; i++) {
            for (var j=0; j<learnValues.inputs.length; j++) {
                for (var l=0; l<this.p; l++) {
                    this.neurones[l].setInputs(learnValues.inputs[j]);
                    var s=this.neurones[l].getOutput();
                    for (var k=0; k<this.n; k++) {
                        this.neurones[l].setWeight(k,this.neurones[l].weights[k]+alpha*(learnValues.outputs[j][l]-s)*learnValues.inputs[j][k]);
                    }                  
                }
            }
            this.statsTest(i);
            graph.push([i+1, (this.stats.percentage[i])])
            log.clear();
            log("Iter:"+(i+1)+" / "+"Progress:"+(((i+1)*100)/iter).toFixed(0)+"%"+" / "+"CurrentPredict:"+this.stats.percentage[i]+"%");
        }
        console.log('\n \n'+babar(graph, {
            color: 'green',
            grid: 'grey',
            minY: 0,
            maxY: 100,
            yFractions: 0,
            xFractions: 0
        }));
    }

    statsTest(iter){
        var cpt=0;
        for(var i=0 ; i<this.testValues.inputs.length ;i++){
            var output = this.predict(this.testValues.inputs[i]);
            var prediction = this.cleanOutput(output);
            var result = this.cleanOutput(this.testValues.outputs[i]);
            if(result==prediction) cpt++;
        }
        this.stats.currentIter.push(iter);
        this.stats.amountPrediction.push(cpt);
        this.stats.percentage.push(cpt*100/this.testValues.inputs.length);
        return cpt;
    }

    getWeights() {
        return weights;
    }

    getOutput() {
        this.outputs=[];
        for (var i=0; i<this.p; i++) {
            this.outputs.push(this.neurones[i].getOutput());
        }
        return this.outputs;
    }

    emptyArray() {
        var a=[];
        for (var i=0; i<this.n; i++) {
            a.push(0);
        }
        return a;
    }

    saveNetwork(path){
        fs.writeFile(path, JSON.stringify(this.neurones), function(err){
            if(err){
                console.error('Error file');
            }
        });
    }

    loadNetwork(path){
        var jsonfile = fs.readFileSync(path, 'utf-8').toString();
        var datas = JSON.parse(jsonfile);
        this.neurones = [];
        for(var i=0 ; i<datas.length ; i++){
            datas[i].activation = this.activation;
            this.neurones.push(new neurone(datas[i]));
        }
    }
}

module.exports = simplePerceptron;