var neurone = require('./neurone.class.js')
var activationFunction = require('./activationFunction.class.js')
var log = require('single-line-log').stdout;
var babar = require('babar');
var fs = require('fs')

class multipleLayersPerceptron {
    constructor({
        n:n,
        q:q,
        inputs:inputs,
        weights:weights,
        activation:activation,
        dataTest:dataTest,
    }) {
        this.n=n;
        this.layers=[];
        this.q=q;
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
        for(var i=0; i<this.q.length ;i++){
            this.layers[i]=[];
            for(var j=0; j<this.q[i] ;j++){
                if(i==0){
                    var params={
                                    n:this.n,
                                    inputs:this.inputs,
                                    activation:this.activation
                    }
                }else {
                    var params={
                                    n:this.q[i-1],
                                    inputs:this.inputs,
                                    activation:this.activation
                    }
                }
                this.layers[i].push(new neurone(params));
            }
        }
    }

    setInputs(inputs) {
        var s=[];
        for(var i=0; i<this.q.length; i++){
            s[i]=[];
            for(var j=0; j<this.q[i]; j++){
                if(i==0){
                    this.layers[i][j].setInputs(inputs)
                    s[i].push(this.layers[i][j].getOutput());
                }else{
                    this.layers[i][j].setInputs(s[i-1]);
                    s[i].push(this.layers[i][j].getOutput());
                }
            }
        }
    }

    predict(input){
        this.setInputs(input);
        return this.getOutput();
    }

    learn(learnValues,iter,alpha){
        var graph=[];
        this.learnValues = learnValues;
        for(var i=0; i<iter; i++){ /* for each iteration of learning */
            for(var j=0; j<learnValues.inputs.length; j++){ /* for each input dataset of learning */
                var s=[];
                var d=[];
                for(var k=0; k<this.q.length; k++){ /* for each layer of network */
                    s[k]=[];
                    var ssum = 0;
                    for(var l=0; l<this.q[k]; l++){ /* for each node of current layer */
                        if(k==0){ /* If current layer is the first layer */
                            this.layers[k][l].setInputs(learnValues.inputs[j])
                            s[k].push(this.layers[k][l].getOutput());
                        }else if(k==this.q.length-1){
                            this.layers[k][l].setInputs(s[k-1]);
                            s[k].push(this.layers[k][l].getOutputLast());
                            ssum+=Math.exp(this.layers[k][l].getOutputLast());
                        }else {
                            this.layers[k][l].setInputs(s[k-1]);
                            s[k].push(this.layers[k][l].getOutput());
                        }
                    }
                }

                for(var l=0; l<this.q[this.q.length-1]; l++){
                    s[this.q.length-1][l] = Math.exp(s[this.q.length-1][l]) / ssum;
                }

                d[0]=[];
                for(var a=0; a<this.q[this.q.length-1]; a++){ /* for each node of layer-out */
                    d[0][a]=(s[this.q.length-1][a]*(1-s[this.q.length-1][a])*(learnValues.outputs[j][a]-s[this.q.length-1][a]));
                }
                d[1]=[];
                for(var b=this.q.length-2; b>=0; b--){ /* for each hidden layer : q-1 -> 1 */
                    d[1][b]=[];
                    for(var c=0; c<this.q[b]; c++){ /* for each node of current layer */
                        var sum=0;
                        if(b==this.q.length-2){ /* If layer is the output layer */ 
                            for(var e=0; e<this.q[b+1]; e++){ /* for each node of output layer */
                                sum+=d[0][e]*this.layers[b+1][e].weights[c];
                            }
                        }else{
                            for(var e=0; e<this.q[b+1]; e++){ /* for each node of hidden layer */
                                sum+=d[1][b+1][e]*this.layers[b+1][e].weights[c];
                            }
                        }
                        d[1][b].push(this.layers[b][c].getOutput()*(1-this.layers[b][c].getOutput())*sum);
                    }
                }
                for(var c=this.q.length-1; c>=0; c--){ /* for each hidden layer : q-1 -> 1 */
                    for(var e=0; e<this.q[c]; e++){ /* for each node of current layer */
                        for(var f=0; f<this.layers[c][e].weights.length; f++){ /* for each weigths of current node */
                            if(c==this.q.length-1){ /* If layer is the last hidden layer */ 
                                this.layers[c][e].setWeight(f, this.layers[c][e].weights[f]+alpha*d[0][e]*this.layers[c][e].inputs[f]);
                            }else{
                                this.layers[c][e].setWeight(f, this.layers[c][e].weights[f]+alpha*d[1][c][e]*this.layers[c][e].inputs[f]);
                            }
                        }
                    }
                }
            }

            this.statsTest(i);
            graph.push([i+1, (this.stats.percentage[i])])
            log.clear();
            log("Iter:"+(i+1)+" / "+"Progress:"+(((i+1)*100)/iter).toFixed(0)+"%"+" / "+"CurrentPredict:"+this.stats.percentage[i]+"%");
        }
        console.log('\n \n'+babar(graph, {
            color: 'red',
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
        for (var i=0; i<this.q[this.q.length-1]; i++){
            this.outputs.push(this.layers[this.q.length-1][i].getOutput());
        }
        return this.outputs;

    }

    emptyArray(){
        var a=[];
        for (var i=0; i<this.n; i++) {
            a.push(0);
        }
        return a;
    }

    saveNetwork(path){
        fs.writeFile(path, JSON.stringify(this.layers), function(err){
            if(err){
                console.error('Error file');
            }
        })
    }

    loadNetwork(path){
        var jsonfile = fs.readFileSync(path, 'utf-8').toString();
        var datas = JSON.parse(jsonfile);
        this.layers = [];
        for(var i=0 ; i<datas.length ; i++){
            this.layers[i] = [];
            for(var j=0; j<datas[i].length ;j++){
                datas[i][j].activation = this.activation;
                this.layers[i].push(new neurone(datas[i][j]));        
            }
        }
    }
}

module.exports = multipleLayersPerceptron;