const fs = require('fs');
const pdfText = require('pdf-text');

class pdfParser {
    constructor(path){
        this.path = path;
       var self = this;
        this.data = pdfText(this.path, function(err,chunks){
            self.data = chunks;
            
        })
        console.log(this.data)
    } 
    
    read (err,chunks){
        this.data = chunks;
    }
}
module.exports = pdfParser;