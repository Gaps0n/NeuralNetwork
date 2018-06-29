class neurone{
    constructor(params){
        this.n=params.n;
        this.activation=params.activation;
        this.affectRandomValue("ceil",params);
        this.affectRandomArrayValue("weights",params);
        this.emptyArray("inputs",params);
    }

    affectRandomValue(prop,params){
        if (params[prop]) {
            this[prop]=params[prop];
        } else {
            this[prop]=Math.random();
        }
    }

    affectRandomArrayValue(prop,params){
        if (params[prop]) {
            this[prop]=params[prop];
        } else {
            this[prop]=[];
            for (var i=0; i<this.n; i++) {
                this[prop].push(Math.random());
            }
        }
    }

    emptyArray(prop,params){
        if (params[prop]) {
            this[prop]=params[prop];
        } else {
            this[prop]=[];
            for (var i=0; i<this.n; i++) {
                this[prop].push(0);
            }
        }
    }

    setWeight(i,weight){
        this.weights[i]=weight;
    }

    setInput(i,input){
        this.inputs[i]=input;
    }

    setWeights(weights){
        this.weights=weights;
    }

    setInputs(inputs){
        this.inputs=inputs;
    }

    setCeil(ceil){
        this.ceil=ceil;
    }
    integrate(){
        this.output=0;
        for (var i=0; i<this.n; i++) {
            this.output+=this.weights[i]*this.inputs[i];
        }
        this.output-=this.ceil;
    }

    getOutput(){
        this.integrate();
        return this.activation(this.output);
    }
    
    getOutputLast(){
        this.integrate();
        return this.output;
    }
    getWeights(){
        return this.weights
    }

}

module.exports = neurone;