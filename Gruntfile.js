module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				browser: true,
				loopfunc: true,
                validthis: true
			},
			build: {
				src: [
                    'src/core/*.js',
                    'test/core/*.js'
                ]
			}
		}
	});

	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Register tasks
	grunt.registerTask('validate', ['jshint']);
	grunt.registerTask('default', ['jshint']);
};