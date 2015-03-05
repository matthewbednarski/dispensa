'use strict';

require.config({
	paths: {
		// +AMD
		jquery: 'libs/jquery/dist/jquery',
		lodash: 'libs/lodash/lodash',
		moment: 'libs/moment/moment',
		i18next: 'libs/i18next/i18next.amd.withJQuery.js',
		offline: 'libs/offline/offline.min.js',

		// -AMD
		angular: 'libs/angular/angular',
		bootstrap: 'libs/bootstrap/dist/js/bootstrap',

	},
	shim: {
		angular : {
			deps: ['jquery'],
			exports: 'angular'
		},
		bootstrap : {
			deps: ['jquery']
		},
		app : {
			deps: ['angular', 'bootstrap'],
			exports: 'app'
		}
	}
});




require(['jquery', 'bootstrap'], function($){
    // DOM ready
    $(function(){

        // Twitter Bootstrap 3 carousel plugin
        $("#element").carousel();
    });
});
