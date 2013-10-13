/*global module:false*/
module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    config: {
      root: ''
    },
    shell: {
      jekyll: {
        command: 'jekyll build',
        options: {
          stdout: true,
          execOptions: {
          }
        }
      }
    },
    watch: {
      content: {
        files: ['_posts/**/*'],
        tasks: ['content']
      }
    },
    connect: {
      server: {
        options: {
          port: 4000,
          base: '_site'
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  // Default task.
  grunt.registerTask('default', []);
  grunt.registerTask('content', ['shell:jekyll']);
  grunt.registerTask('dev', ['connect:server', 'watch']);

};
