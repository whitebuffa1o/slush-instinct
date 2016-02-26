# Change Log
All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org).

## [Unreleased]

## [1.0.2] - 2016-02-26
- Is smarter with Cuttlefish. Asks you CF specific set up questions when necessary
- Includes more complete Cuttlefish file structure to work with CF 1.0.0
- General cleanup and bugfixes

## [1.0.1] - 2016-02-24
- Killed off exec task, as we are no longer auto setting the git remote
- No longer asks about Foundation if Cuttlefish is selected

## [1.0.0] - 2016-01-27
### Added
- Support for 2.0.0 Instinct
- Now works with Node 5.X.X

## [0.2.0] - 2016-01-11
### Added
- Adds source paths to the configuration file so we can modify them per project, if necessary

## [0.1.5] - 2015-12-16
### Added
- Includes json loader in the webpack configuration

## [0.1.4] - 2015-12-02
### Added
- Only includes Foundation stuff if Cuttlefish is not selected, since Cuttlefish already includes Foundation
- No longer bypasses the CMS by default
- Adds in the htaccess and index files that CMS requires

## [0.1.3] - 2015-10-06
### Added
- Fixes issue with dotfiles. They now transfer over correctly, but need to be underscore files in the /templates directory
