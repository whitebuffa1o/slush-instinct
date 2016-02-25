'use strict';

var gulp = require('gulp'),
  install = require('gulp-install'),
  conflict = require('gulp-conflict'),
  template = require('gulp-template'),
  rename = require('gulp-rename'),
  _ = require('underscore.string'),
  inquirer = require('inquirer'),
  path = require('path'),
  gitlab = require('node-gitlab');

function format(string) {
  var username = string.toLowerCase();
  return username.replace(/\s/g, '');
}

var defaults = (function () {
  var workingDirName = path.basename(process.cwd()),
    homeDir, osUserName, configFile, user;

  if (process.platform === 'win32') {
    homeDir = process.env.USERPROFILE;
    osUserName = process.env.USERNAME || path.basename(homeDir).toLowerCase();
  } else {
    homeDir = process.env.HOME || process.env.HOMEPATH;
    osUserName = homeDir && homeDir.split('/').pop() || 'root';
  }

  configFile = path.join(homeDir, '.gitconfig');
  user = {};

  if (require('fs').existsSync(configFile)) {
    user = require('iniparser').parseSync(configFile).user;
  }

  return {
    appName: workingDirName,
    userName: osUserName || format(user.name || ''),
    authorName: user.name || '',
    authorEmail: user.email || ''
  };
})();

gulp.task('default', function(done){
  var prompts = [{
    name: 'appName',
    message: 'What is the name of your project?',
    default: defaults.appName
  }, {
    name: 'appUrl',
    message: 'What is the url for this project?',
    default: 'www.'+defaults.appName+'.com'
  }, {
    name: 'appDescription',
    message: 'Briefly describe the project:'
  }, {
    name: 'appVersion',
    message: 'What is the version of your project?',
    default: '0.1.0'
  }, {
    name: 'authorName',
    message: 'Who is the project author?',
    default: defaults.authorName
  }, {
    name: 'authorEmail',
    message: 'What is the author email?',
    default: defaults.authorEmail
  }, {
    type: 'confirm',
    name: 'bypass',
    message: 'Do you want to bypass the CMS entirely? (This can be changed later)',
    default: false
  }, {
    type: 'confirm',
    name: 'jquery',
    message: 'Do you want to load jQuery in via Google CDN?',
    default: true
  }, {
    type: 'confirm',
    name: 'cuttlefish',
    message: 'Is this project using Cuttlefish?',
    default: false
  }, {
    type: 'password',
    name: 'gitlabToken',
    message: 'What is your gitlab private token?',
    when: function(answers){
      return answers.cuttlefish;
    }
  }, {
    type: 'list',
    name: 'cuttlefishTheme',
    message: 'Which Cuttlefish theme do you need?',
    choices: function(answers){
      var choices = ['Start from scratch', new inquirer.Separator()];
      var done = this.async();
      var client = gitlab.createPromise({
        api: 'https://gitlab.com/api/v3/groups/clearlink',
        privateToken: answers.gitlabToken
      });

      client.projects.list().then(function(projects){
        projects.map(function(obj){
          if(obj.name.startsWith('cf_')){
            choices.push(obj.name);
          }
        });
        done(choices);
      });
    },
    when: function(answers){
      return answers.gitlabToken;
    }
  }, {
    type: 'confirm',
    name: 'foundation',
    message: 'Should this project use Foundation?',
    default: false,
    when: function(answers){
      return !answers.cuttlefish;  
    }
  }];

  //Ask
  inquirer.prompt(prompts, function (answers) {
    answers.appNameSlug = _.slugify(answers.appName);

    var files = [__dirname + '/templates/**'];

    // If we're using the CMS, we need to move the php files, rather than static html
    if(answers.bypass) {
      files = files.concat(['!'+__dirname+'/templates/dot_htaccess', '!'+__dirname+'/templates/*.php', '!'+__dirname+'/**/*.php']);
    } else {
      files.push('!'+__dirname+'/templates/_src/markup/*.html');
    }

    // If Cuttlefish, we don't need utils
    if(answers.cuttlefish) {
      files.push('!'+__dirname+'/templates/_src/sass/_utils.scss');

      // Let's set answers.foundation to false, so we don't get any errors from our other template file
      answers.foundation = false;
    }

    gulp.src(files)
      .pipe(template(answers))
      .pipe(rename(function(file){
        if(file.basename.substring(0, 4) === 'dot_'){
          file.basename = '.' + file.basename.slice(4);
        }      
      }))
      .pipe(conflict('./'))
      .pipe(gulp.dest('./'))
      .pipe(install())
      .on('end', function () {
        done();
      });
  });
});
