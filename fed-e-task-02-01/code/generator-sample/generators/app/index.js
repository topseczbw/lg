const Gen = require('yeoman-generator')

module.exports = class extends Gen {
    writing() {
        this.fs.write(this.destinationPath('temp.txt'), Math.random().toString())
    }
}
