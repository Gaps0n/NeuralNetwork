var neurone = require('./neurone.class.js')
var activationFunction = require('./activationFunction.class.js')
var fs = require('fs')

class simplePerceptron{
    constructor({
        n:n,
        p:p,
        inputs:inputs,
        weights:weights,
        activation:activation
    }) {
        this.n=n;
        this.p=p;
        this.activation=activation;
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
        return res
    }

    learn(learnValues,iter,alpha) {
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
        }
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
        })
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