const pdfParser = require('./pdfParser.js');

class masterParser {
    constructor(file){
        this.filePath = file;
        this.fileExt = function(){
            var ext = this.filePath.substr(this.filePath.lastIndexOf('.') + 1);
            return ext;
        }
        this.initializeParser();
    }
    initializeParser(){
        switch(this.fileExt()){
            case 'pdf':
                var parser = new pdfParser(this.filePath);
                console.log(parser.data);
                break;
        }
    }
}
module.exports = masterParser;