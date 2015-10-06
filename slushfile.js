'use strict';

var gulp = require('gulp'),
  install = require('gulp-install'),
  conflict = require('gulp-conflict'),
  template = require('gulp-template'),
  rename = require('gulp-rename'),
  _ = require('underscore.string'),
  inquirer = require('inquirer'),
  exec = require('gulp-exec'),
  path = require('path');

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
    name: 'appRepo',
    message: 'What is the git repository name?',
    default: defaults.appName
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
    default: true
  }, {
    type: 'confirm',
    name: 'jquery',
    message: 'Do you want to load jQuery in via Google CDN?',
    default: true
  }, {
    type: 'confirm',
    name: 'foundation',
    message: 'Should this project use Foundation?',
    default: false
  }, {
    type: 'confirm',
    name: 'cuttlefish',
    message: 'Is this project using Cuttlefish?',
    default: false
  }];

  //Ask
  inquirer.prompt(prompts, function (answers) {
    answers.appNameSlug = _.slugify(answers.appName);

    var files = [__dirname + '/templates/**'];

    if(answers.bypass) {
      files.push('!'+__dirname+'/templates/_src/markup/*.php');
    } else {
      files.push('!'+__dirname+'/templates/_src/markup/*.html');
    }

    gulp.src('./')
      .pipe(exec('git init && git remote add origin git@gitlab.com:clearlink/'+answers.appRepo+'.git'));

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
