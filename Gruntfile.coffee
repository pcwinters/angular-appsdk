matchdep = require('matchdep')

module.exports = (grunt) ->
	#Load all grunt tasks (except grunt-cli) from NPM
	matchdep.filterDev('grunt-*').filter((dep) -> dep != 'grunt-cli').forEach(grunt.loadNpmTasks)

	grunt.initConfig
		src: 'src'
		test: 'test'
		dist: 'dist' # The final distribution that will be mounted by our app
		build: 'build' # Represents the temporary build directory

		copy:
			build:
				cwd: '<%= src %>/'
				src: ['scripts/**/*.js', 'scripts/**/*.coffee', 'views/**/*']
				dest: '<%= build %>/'
				expand: true
		
		# Concat all built JS scripts into a single app distribution
		concat:
			dist:
				files:
					'<%= dist %>/rally.js': [
						'<%= build %>/scripts/**/*.js'
					]

		clean:
			dist: '<%= dist %>'
			build: '<%= build %>'

		coffee:
			compile:
				options:
					bare: true
				expand: true
				flatten: false
				cwd: '<%= build %>/scripts'
				src: '**/*.coffee'
				dest: '<%= build %>/scripts/'
				ext: '.js'

		# Compile all Jade templates
		jade:
			views:
				files: [{
					expand: true
					cwd: '<%= build %>/views'
					dest: '<%= build %>/views/'
					ext: '.html'
					src: ["**/*.jade"]
				}]

		karma:
			unit:
				configFile: 'karma.conf.js'

	grunt.registerTask('build', ['clean', 'copy:build', 'coffee', 'jade:views'])
	grunt.registerTask('dist', ['build', 'concat:dist'])
	grunt.registerTask('test', ['build', 'karma:unit'])
	grunt.registerTask('default', ['build', 'test'])
