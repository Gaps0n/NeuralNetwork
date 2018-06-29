var startTime = new Date().getTime();
var endTime = 0;
var parser = require('./parser.class.js');
var ia = require('./ia.class.js');
var activationFunction = require('./activationFunction.class.js');

var parser = new parser('dataset/poker/poker-hand-training-true.data', 'dataset/poker/poker-hand-testing.data');
//var parser = new parser('dataset/tic-tac/tic-tac-toe.data', 'dataset/tic-tac/tic-tac-test.data');

var params = {
                datatrain: parser.poker3(parser.dataTrain),
                datatest: parser.poker3(parser.dataTest),                
                n: parser.n, //Nb of inputs for input layer
                p: parser.p,
                q: [52,10], //Nb of layer
                iter: 600,
                alpha: 0.0001,
                activation: activation.sigmoid,
                cleanOutput: function(output){
                    return output.indexOf(Math.max.apply(null, output));
                }
             }

var ia = new ia(params);

ia.learning();

for(i=0; i<ia.network.stats.percentage.length; i++){
    console.log(i, ia.network.stats.percentage[i]);
}

//console.log(ia.dataTest.inputs)

//console.log(ia.network.stats.iter)
//console.log(ia.network.layers[2])
//ia.network.loadNetwork('saves/network.json');
//var test = ia.network.predict([ 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
//console.log(test);
endTime = new Date().getTime() - startTime;
console.log('_________________________\n'+'Time of exec: '+ endTime/1000 + 's');