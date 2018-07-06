var startTime = new Date().getTime();
var endTime = 0;

var parser = require('./parser.class.js');
var ia = require('./ia.class.js');
var activationFunction = require('./activationFunction.class.js');

//POKER
var parser = new parser('dataset/poker/poker-hand-training-true.data', 'dataset/poker/poker-hand-testing2.data');
//[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0] -> [1, 0, 0, 0, 0, 0, 0, 0, 0, 0] -> POKER3

//TICTAC
//var parser = new parser('dataset/tic-tac/tic-tac-toe.data', 'dataset/tic-tac/tic-tac-test.data');
//[ 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0 ] -> [ 0, 1 ] -> TICTAC

var params = {
                datatrain: parser.poker3(parser.dataTrain),
                datatest: parser.poker3(parser.dataTest),                
                n: parser.n,
                p: parser.p,
                iter: 100,
                q:[52, 10], //layers --> TICTAC:[27,2] | POKER:[52,10] | SP:[]
                alpha: 0.07, //learning rate
                activation: activation.sigmoid,
}
var ia = new ia(params);
//ia.network.loadNetwork('saves/mlp_tictac_95.json');

ia.training();
ia.testing();


//var test = ia.network.predict([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]);
//console.log(test);

endTime = new Date().getTime() - startTime;
console.log('_________________________\n'+'Time of exec: '+ endTime/1000 + 's');