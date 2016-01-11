# Change Log
All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org).

## [Unreleased]

## [0.2.0] - 2016-01-11
### Added
- Adds source paths to the configuration file so we can modify them per project, if necessary

## [0.1.5] - 2015-12-16
### Added
- Includes json loader in the webpack configuration

## [0.1.4] - 2015-12-02
### Added
- Only includes Foundation stuff if Cuttlefish is not selected, since Cuttlefish already includes Foundation.
- No longer bypasses the CMS by default
- Adds in the htaccess and index files that CMS requires

## [0.1.3] - 2015-10-06
### Added
- Fixes issue with dotfiles. They now transfer over correctly, but need to be underscore files in the /templates directory
