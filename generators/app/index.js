var generators = require('yeoman-generator');
var chalk = require('chalk');

module.exports = generators.Base.extend({
    // The name `constructor` is important here
    constructor: function() {
        // Calling the super constructor is important so our generator is correctly set up
        generators.Base.apply(this, arguments);

        // Next, add your custom code
        this.option('coffee'); // This method adds support for a `--coffee` flag
    },

    // 以下所有方法按顺序执行

    prompting: function() {
        var done = this.async(); //  阻塞下面方法的执行，直到done()被调用

        return this.prompt([{
            type: 'input',
            name: 'name',
            message: 'Your project name',
            default: this.appname, // Default to current folder name
            store: true
        }, {
            type: 'input',
            name: 'username',
            message: 'Your name',
            store: true
        }, {
            type: 'confirm',
            name: 'install',
            message: 'Would you like to npm install?'
        }], function(answers) {
            this.config.set('appname', answers.name);
            this.config.set('username', answers.username);
            this.config.set('install', answers.install);
            done();
        }.bind(this));
    },

    writing: function() {

        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'), {
                appname: this.config.get('appname'),
                username: this.config.get('username')
            }
        );
        this.template('_Gruntfile.js', 'Gruntfile.js');
        this.directory('example', 'example');
        this.directory('server', 'server');
    },

    _installAllPackages: function() {
        var isInstall = this.config.get('install');
        if (isInstall) {
            this.installDependencies();
        }
    },

    install: function() {
        var that = this;
        var p1 = new Promise(function(resolve, reject) {
            that._installAllPackages();
            resolve();
        });
        // p1.then(function() {
        //     that.log(
        //         '\n' +
        //         chalk.green('Completed!') +
        //         '\n' +
        //         chalk.white('Have a nice trip!')
        //     );
        // }).catch(function() {
        //     that.log(chalk.red('Something is wrong'));
        // });

    },

    end: function() {
        this.log(
            '\n' +
            chalk.green('Completed!') +
            '\n' +
            chalk.white('Have a nice trip!')
        );
    }
});