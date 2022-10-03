const Generator = require('yeoman-generator');
var fs = require('fs');



module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);
        this.log('METADATA running');
        // Next, add your custom code
        //this.log(args);
        //this.log(opts);
    }



    _method2() {
        this.log('METADATA method 2 just ran');
    }
};