class stemming {
    constructor(word){
        this.word = word;
        this.vowels = ["a","e","i","o","u","y","â","à","ë","é","ê","è","ï","î","ô","û","ù"];
        this.standard_suffixes = [
                        "ance","iqUe","isme","able","iste","eux","ances","iqUes","ismes","ables","istes",
                        "atrice","ateur","ation","atrices","ateurs","ations",
                        "logie","logies",
                        "usion","ution","usions","utions",
                        "ence","ences",
                        "ement","ements",
                        "ité","ités",
                        "if","ive","ifs","ives",
                        "eaux",
                        "aux",
                        "euse","euses",
                        "issement","issements",
                        "amment",
                        "emment",
                        "ment","ments"  
                        ];
        this.verbs_suffixes_i = [
                        "îmes","ît","îtes","i","ie","ies","ir","ira","irai","iraIent","irais","irait","iras","irent","irez","iriez","irions","irons","iront","is","issaIent",
                        "issais","issait","issant","issante","issantes","issants","isse","issent","isses","issez","issiez","issions","issons","it"
                        ]
        
        this.others_verbs_suffixes = [
                            "ions",
                            "é","ée","ées","és","èrent","er","era","erai","eraIent","erais","erait","eras","erez","eriez","erions","erons","eront","ez","iez",
                            "âmes","ât","âtes","a","ai","aIent","ais","ait","ant","ante","antes","ants","as","asse","assent","asses","assiez","assions"
        ]
        
        this.residual_suffixes = [
                            "ion",
                            "ier","ière","Ier","Ière",
                            "e",
                            "ë"
        ]
        
        this.clean_word = "";
        this.rv = "";
        this.r1 = "";
        this.r2 = "";
        this.pos_rv;
        this.pos_r1;
        this.pos_r2;
        this.do_step_2a = true;
        this.do_step_2b = true;
        this.do_step_3 = true;
        this.do_step_4 = true;
        
        this.process()
    }
    
    get_clean_word(){
        var clean_word = this.word.toLowerCase();
        for(var i=0; i<clean_word.length; i++){
            switch(clean_word[i])
            {
              case "i":
                  if(this.clean_word[i-1] && this.vowels.indexOf(this.clean_word[i-1])>=0 && clean_word[i+1] && this.vowels.indexOf(clean_word[i+1])>=0){
                      this.clean_word += clean_word[i].toUpperCase();
                  }else {
                      this.clean_word += clean_word[i];
                  }
                  break;
                    
              case "u":
                  if((this.clean_word[i-1] && this.clean_word[i-1] == 'q') || (this.clean_word[i-1] && this.vowels.indexOf(this.clean_word[i-1])>=0 && clean_word[i+1] && this.vowels.indexOf(clean_word[i+1])>=0)){
                      this.clean_word += clean_word[i].toUpperCase();
                  } else{
                      this.clean_word += clean_word[i];
                  }
                  break;
                    
              case "y":
                  if((this.clean_word[i-1] && this.vowels.indexOf(clean_word[i-1])>=0) || (clean_word[i+1] && this.vowels.indexOf(clean_word[i+1])>=0)){
                      this.clean_word += clean_word[i].toUpperCase();
                  }else{
                      this.clean_word += clean_word[i];
                  }
                  break;
                    
              default:
                  this.clean_word += clean_word[i];
                  break;
            }
        }
        return this.clean_word
    }
    
    get_rv(){
        var start = this.clean_word.substr(0,3);
        if(start == "par" || start == "col" || start == "tap"){
            this.rv = this.clean_word.substr(3);
            return this.rv;
        }
        if(this.vowels.indexOf(this.clean_word[0])>=0 && this.vowels.indexOf(this.clean_word[1])>=0){
            this.rv = this.clean_word.substr(3);
            return this.rv;
        }
        for(var i=1; i<this.clean_word.length; i++){
            if(this.vowels.indexOf(this.clean_word[i])>=0){
                this.rv = this.clean_word.substr(i+1);
                return this.rv;
            }
        }
        this.rv = this.clean_word.substr(1);
        return this.rv
    }
    
    get_r1(){
        for(var i=1; i<this.clean_word.length; i++){
            if(this.vowels.indexOf(this.clean_word[i-1])>=0 && this.vowels.indexOf(this.clean_word[i]) == -1){
                this.r1 = this.clean_word.substr(i+1);
                return this.r1;
            }
        }
        this.r1 = this.clean_word.substr(1)
        return this.r1;
    }
    
    get_r2(){
        for(var i=1; i<this.r1.length; i++){
            if(this.vowels.indexOf(this.r1[i-1])>=0 && this.vowels.indexOf(this.r1[i]) == -1){
                this.r2 = this.r1.substr(i+1);
                return this.r2;
            }
        }
    }
    
    standard_suffix_removal(){
        var end = false;
        var _this = this;
        this.standard_suffixes.forEach(function(suffix){
            if(_this.stem.substr(-suffix.length) == suffix){
                switch(suffix){
                    case "ance":
                    case "iqUe":
                    case "isme":
                    case "able":
                    case "iste":
                    case "eux":
                    case "ances":
                    case "iqUes":
                    case "ismes":
                    case "ables":
                    case "istes":
                        _this.delete_if_in_r("r2", suffix);
                        end = true;
                        break;
                    case "atrice":
                    case "ateur":
                    case "ation":
                    case "atrices":
                    case "ateurs":
                    case "ations":
                        if(_this.delete_if_in_r("r2", suffix)){
                            if(_this.preceded_by(suffix, "ic")){
                                _this.delete_if_in_r_else_replace("r2", "ic", "iqU");
                            }
                        }
                        end = true;
                        break;
                    case "logie":
                        _this.replace_if_in_r("r2", suffix, "log");
                        end = true;
                        break;
                    case "usion":
                    case "ution":
                    case "usions":
                    case "utions":
                        _this.replace_if_in_r("r2", suffix, "u");
                        end = true;
                        break;
                    case "ence":
                    case "ences":
                        _this.replace_if_in_r("r2", suffix, "ent");
                        end = true;
                        break;
                    case "ement":
                    case "ements":
                        _this.delete_if_in_r("rv", suffix)
                        if(_this.preceded_by(suffix, "iv")){
                            _this.delete_if_in_r("r2", "iv");
                            if(_this.preceded_by("iv"+suffix, "at")){
                                _this.delete_if_in_r("r2", "at");
                            }
                        }else if(_this.preceded_by(suffix, "eus")){
                            _this.delete_if_in_r("r2", "eus");
                            _this.replace_if_in_r("r1", "eus", "eux");
                        }else if(_this.preceded_by(suffix, "abl")){
                            _this.delete_if_in_r("r2", "abl");
                        }else if(_this.preceded_by(suffix, "iqU")){
                            _this.delete_if_in_r("r2", "iqU");
                        }else if(_this.preceded_by(suffix, "ièr")){
                            _this.replace_if_in_r("rv", "ièr", "i");
                        }else if(_this.preceded_by(suffix, "Ièr")){
                            _this.replace_if_in_r("rv", "Ièr", "i");
                        }
                        end = true;
                        break;
                    case "ité":
                    case "ités":
                        _this.delete_if_in_r("r2", suffix);
                        if(_this.preceded_by(suffix, "abil")){
                            _this.delete_if_in_r_else_replace("r2","abil","abl");
                        }else if(_this.preceded_by(suffix,"ic")){
                            _this.delete_if_in_r_else_replace("r2","ic","iqU");
                        }else if(_this.preceded_by(suffix,"iv")){
                            _this.delete_if_in_r("r2","iv");
                        }
                        end = true;
                        break;
                    case "if":
                    case "ive":
                    case "ifs":
                    case "ives":
                        if(_this.delete_if_in_r("r2",suffix)){
                            if(_this.preceded_by(suffix,"at")){
                                _this.delete_if_in_r("r2","at");
                            }
                            if(_this.preceded_by("at"+suffix,"ic")){
                                _this.delete_if_in_r_else_replace("r2","ic",'iqU');
                            }
                        }
                        end = true;
                        break;
                    case "eaux":
                        _this.replace_suffix(suffix,"eau");
                        end = true;
                        break;
                    case "aux":
                        _this.replace_if_in_r("r1",suffix,"al");
                        end = true;
                        break; 
                    case "euse":
                    case "euses":
                        _this.delete_if_in_r("r2",suffix);
                        _this.replace_if_in_r("r1",suffix,"eux");
                        end = true;
                        break;  
                    case "issement":
                    case "issements":
                        if(!_this.vowels.indexOf(_this.clean_word.substr(_this.clean_word, -(suffix.length+1),1)>=0)){
                            _this.delete_if_in_r("r1",suffix);
                        }
                        end = true;
                        break;
                    case "amment":
                        _this.replace_if_in_r("rv",suffix,"ant");
                        _this.do_step_2a = true;
                        end = true;
                        break;
                    case "emment":
                        _this.replace_if_in_r("rv",suffix,"ent");
                        _this.do_step_2a = true;
                        end = true;
                        break;
                    case "ment":
                    case "ments":
                        if(_this.vowels.indexOf(_this.clean_word.substr(_this.clean_word, -(suffix.length+1),1)>=0)){
                            if(_this.rv.indexOf(_this.stem.substr(-(suffix.length+1)))!==false){
                                _this.delete_if_in_r("rv", suffix);
                            }
                            _this.do_step_2a = true;
                        }
                        end = true;
                        break;
                }
            }
            if(end){
                return;
            }
        });
        if(this.clean_word == this.stem){
            this.do_step_2a = true;
        }else{
            this.do_step_3 = true;
            this.do_step_4 = false;
        }
        return this.stem;
    }
    
    sort_suffixes(){
        this.standard_suffixes.sort(this._sort_suffixes);
        this.verbs_suffixes_i.sort(this._sort_suffixes);
        this.others_verbs_suffixes.sort(this._sort_suffixes);
        this.residual_suffixes.sort(this._sort_suffixes);
    }
    _sort_suffixes(a, b){
        if(a.length == b.length){
            return 0;
        }
        return(a.length < b.length) ? 1 : -1;
    }
    
    undouble(){
       var end = this.stem.substr(-3);
       if(end == "enn" || end == "onn" || end == "ett" || end == "ell" || this.stem.substr(-4) == "eill"){
           this.stem = this.stem.substr(0, this.stem.length-1);
       }
    }
    
    unaccent(){
        var no_vowels = false;
        for(var i=this.stem.length; i>=0; i--){
            if(this.vowels.indexOf(this.stem[i]) == -1){
                no_vowels = true;
            }else {
                if(no_vowels && this.stem[i] == "é" || this.stem[i] == "è"){
                    this.stem = this.stem.substr(0, this.stem.indexOf(this.stem[i])) + "e" + this.stem.substr(this.stem.indexOf(this.stem[i]));
                }
                return;
            }
        }
    }
    
    delete_if_in_r(r, suffix){
        var pos_r = 0;
        switch(r){
            case "rv":
                r = this.rv;
                pos_r = this.pos_rv;
                break;
            case "r1":
                r = this.r1;
                pos_r = this.pos_r1;
                break;
            case "r2":
                r = this.r2;
                pos_r = this.pos_r2;
                break;
        }
        var pos_suffix = this.stem.indexOf(suffix);
        var suffix_len = suffix.length;
        if(r && pos_suffix !== false && pos_suffix >= pos_r){
            this.stem = this.stem.substr(0, pos_suffix)+this.stem.substr(pos_suffix+suffix_len);
            return true;
        }else{
            return false;
        }
    }
    
    delete_if_in_r_else_replace(r, suffix, replace){
        var pos_r = 0;
        switch(r){
            case "rv":
                r = this.rv;
                pos_r = this.pos_rv;
                break;
            case "r1":
                r = this.r1;
                pos_r = this.pos_r1;
                break;
            case "r2":
                r = this.r2;
                pos_r = this.pos_r2;
                break;
        }
        var pos_suffix = this.stem.indexOf(suffix);
        var suffix_len = suffix.length;
        if(r && pos_suffix !== false && pos_suffix >= pos_r){
            this.stem = this.stem.substr(0, pos_suffix) + this.stem.substr(pos_suffix+suffix_len);
        }else{
            this.stem = this.stem.substr(0, pos_suffix) + replace.substr(this.stem,pos_suffix+suffix_len);
        }
    }
    
    replace_if_in_r(r, suffix, replace){
        var pos_r = 0;
        switch(r){
            case "rv":
                r = this.rv;
                pos_r = this.pos_rv;
                break;
            case "r1":
                r = this.r1;
                pos_r = this.pos_r1;
                break;
            case "r2":
                r = this.r2;
                pos_r = this.pos_r2;
                break;
        }
        var pos_suffix = this.stem.indexOf(suffix);
        var suffix_len = suffix.length;
        if(r && pos_suffix !== false && pos_suffix >= pos_r){
            this.stem = this.stem.substr(0, pos_suffix).replace.substr(this.stem, pos_suffix+suffix_len);
            return true;
        }else{
            return false;
        }
    }
    
    replace_suffix(suffix, replace){
        var pos_suffix = this.stem.indexOf(suffix);
        var suffix_len = suffix.length;
        if(this.stem.indexOf(suffix) !== false){
            this.stem = this.stem.substr(0, pos_suffix)+replace.substr(this.stem, pos_suffix+suffix_len);
            return true;
        }else{
            return false;
        }
    }
    
    verbs_suffixes_i_process(){
        var stem = this.stem;
        var _this = this;
        this.verbs_suffixes_i.forEach(function(suffix){
            if(_this.stem.substr(-(suffix.length)) == suffix && !_this.preceded_by_vowel(suffix)){
                if(_this.rv.indexOf(_this.stem.substr(-(suffix.length)+1))!==false){
                    _this.delete_if_in_r("rv",suffix);
                    return
                }
            }
        });
    }
    
    other_verbs_suffixes_process(){
        var stem = this.stem;
        var _this = this;
        this.others_verbs_suffixes.forEach(function(suffix){
            if(_this.stem.substr(-suffix.length) == suffix && stem == _this.stem){
                switch(suffix){
                    case "ions" :
                        _this.delete_if_in_r("r2",suffix);
                        break;
                    case "é":
                    case "ée":
                    case "ées":
                    case "és":
                    case "èrent":
                    case "er":
                    case "era":
                    case "erai":
                    case "eraIent":
                    case "erais":
                    case "erait":
                    case "eras":
                    case "erez":
                    case "eriez":
                    case "erions":
                    case "erons":
                    case "eront":
                    case "ez":
                    case "iez":
                        _this.delete_if_in_r("rv",suffix);
                        break;
                    case "âmes":
                    case "ât":
                    case "âtes":
                    case "a":
                    case "ai":
                    case "aIent":
                    case "ais":
                    case "ait":
                    case "ant":
                    case "ante":
                    case "antes":
                    case "ants":
                    case "as":
                    case "asse":
                    case "assent":
                    case "asses":
                    case "assiez":
                    case "assions":
                        _this.delete_if_in_r("rv",suffix);
                        if(_this.preceded_by(suffix, "e")){
                            if(_this.rv.indexOf(_this.clean_word.substr(-(suffix.length)+1))!==false){
                                _this.delete_if_in_r("rv", "e");
                            }
                        }
                        break;
                }
            }
        });
        if(this.stem != stem){
            this.do_step_3 = true;
            this.do_step_4 = false;
        }   
    }
    
    residual_suffixes_process(){
        if(this.stem.substr(-1, 1) == "s" && this.stem.substr(-2, 1).indexOf(["a","i","o","u","è","s"]) == -1){
            this.stem = this.stem.substr(0, this.stem.length-1);
        }
        var end = false;
        var _this = this;
        this.residual_suffixes.forEach(function(suffix){
            if(_this.stem.substr(-(suffix.length)) == suffix){
                switch(suffix){
                    case "ion":
                        if(_this.preceded_by(suffix,"s") || _this.preceded_by(suffix,"t")){
                            if(_this.rv.indexOf(_this.clean_word.substr(-(suffix.length)+1))!==false){
                                _this.delete_if_in_r("r2", suffix);
                            }
                        }
                        end = true;
                        break;
                    case "ier":
                    case "ière":
                    case "Ier":
                    case "Ière":
                        _this.replace_if_in_r("rv", suffix, "i");
                        end = true;
                        break;
                    case "e":
                        _this.delete_if_in_r("rv", suffix);
                        end = true;
                        break;
                    case "ë" :
                        if(_this.preceded_by(suffix,"gu")){
                            _this.delete_if_in_r("rv",suffix);
                        }
                        end = true;
                        break;    
                }
            }
            if(end) return;
        });
    }
    
    preceded_by(suffix, by){
        return (this.clean_word.substr(-(suffix.length+by.length)), by.length == by);
    }
    
    preceded_by_vowel(suffix){
        return (this.vowels.indexOf(this.clean_word.substr(-(suffix.length+1),1)) >= 0);
    }
    
    replace_array(str, search, replace){
        for(var i=0; i<str.length; i++){
            for(var j=0; j<search.length; j++){
                if(str[i] == search[j]){
                    str[i] = replace[j]
                }
            }
        }
        return str;
    }
    
    process(){
        this.sort_suffixes()
        this.get_clean_word();
        this.get_rv();
        this.get_r1();
        this.get_r2();
        this.stem = this.clean_word;
        this.pos_rv = this.stem.indexOf(this.rv);
        this.pos_r1 = this.stem.indexOf(this.r1);
        this.pos_r2 = this.stem.indexOf(this.r2);
        var step1, step2a, step2b, step3, step4 = "";
        
        //STEP1
        this.standard_suffix_removal();
        step1 = this.stem;
        //STEP2
        if(this.do_step_2a){
            this.verbs_suffixes_i_process();
            step2a = this.stem;
        }
        
        if(this.do_step_2b){
            this.other_verbs_suffixes_process();
            step2b = this.stem;
        }
        //STEP3
        if(this.do_step_3){
            var stem = this.stem;
            this.stem = this.stem.substr(0, this.stem.length-1)+this.replace_array(this.stem.substr(-1, 1), ["Y","ç"], ["i","c"]);
            if(stem != this.stem){
                this.do_step_4 = false;
            }
        }
        
        //STEP4
        if(this.do_step_4){
            this.residual_suffixes_process()
        }
        console.log(this.stem);
        
        //STEP5
        this.undouble();
        
        //STEP6
        this.unaccent();
        
        //STEP6
        this.stem = this.stem.toLowerCase
        
    }
}

//ALGO -> http://snowball.tartarus.org/algorithms/french/stemmer.html
