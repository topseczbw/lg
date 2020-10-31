const Gen = require('yeoman-generator');

module.exports = class extends Gen {
    // Writing() {
    //     this.fs.write(this.destinationPath('temp.txt'), Math.random().toString())
    // }

    writing() {
        const tmpl = this.templatePath('foo.txt');

        const output = this.destinationPath('foo.txt');

        const context = { title: 'hello world' };

        this.fs.copyTpl(tmpl, output, context);
    }
};
