var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    // Removed "Spec" naming from files
    if (/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/app/scripts',

    paths: {
        angular: '../../bower_components/angular/angular',
        'angular-animate': '../../bower_components/angular-animate/angular-animate',
        'angular-cookies': '../../bower_components/angular-cookies/angular-cookies',
        'angular-messages': '../../bower_components/angular-messages/angular-messages',
        'angular-mocks': '../../bower_components/angular-mocks/angular-mocks',
        'angular-resource': '../../bower_components/angular-resource/angular-resource',
        'angular-route': '../../bower_components/angular-route/angular-route',
        'angular-sanitize': '../../bower_components/angular-sanitize/angular-sanitize',
        'angular-touch': '../../bower_components/angular-touch/angular-touch',
        'angular-translate': '../../bower_components/angular-translate/angular-translate',
        'angular-translate-loader-static-files': '../../bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files',
        'angular-translate-storage-cookie': '../../bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie',
        bootstrap: '../../bower_components/bootstrap/dist/js/bootstrap',
        pouchdb: '../../bower_components/pouchdb/dist/pouchdb',
        moment: '../../bower_components/moment/moment',
        lodash: '../../bower_components/lodash/lodash',
        'angular-growl-v2': '../../bower_components/angular-growl-v2/build/angular-growl'
    },

    shim: {
        'angular' : {'exports' : 'angular'},
        'angular-route': ['angular'],
        'angular-cookies': ['angular'],
        'angular-sanitize': ['angular'],
        'angular-resource': ['angular'],
        'angular-animate': ['angular'],
        'angular-touch': ['angular'],
        'angular-mocks': {
          deps:['angular'],
          'exports':'angular.mock'
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
