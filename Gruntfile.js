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
        files: ['_posts/**/*', '_layouts/**/*', 'index.html', 'css/**/*.less'],
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
    },
    less: {
      assets: {
        files: {
          'css/main.css' : 'css/*.less'
        }
      }
    },
    autoprefixer: {
      generated: {
        src: 'css/main.css',
        dest: 'css/main.css'
      }
    }
  });

  // These plugins provide necessary tasks.
  // Default task.
  grunt.registerTask('default', []);
  grunt.registerTask('content', ['less:assets', 'autoprefixer', 'shell:jekyll']);
  grunt.registerTask('dev', ['connect:server', 'watch']);

};
