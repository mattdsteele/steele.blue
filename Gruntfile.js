/*global module:false*/
module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    config: {
      root: 'blog'
    },
    shell: {
      jekyll: {
        command: 'jekyll build',
        options: {
          stdout: true,
          execOptions: {
            cwd: '<%= config.root %>'
          }
        }
      }
    },
    watch: {
      content: {
        files: ['<%= config.root %>/_posts/**/*', '<%= config.root %>/_layouts/**/*', '<%= config.root %>/index.html', '<%= config.root %>/css/**/*.less'],
        tasks: ['content']
      }
    },
    connect: {
      server: {
        options: {
          hostname: '*',
          port: 4000,
          base: '<%= config.root %>/_site'
        }
      }
    },
    less: {
      assets: {
        files: {
          '<%= config.root %>/css/main.css' : '<%= config.root %>/css/*.less'
        }
      }
    },
    autoprefixer: {
      generated: {
        src: '<%= config.root %>/css/main.css',
        dest: '<%= config.root %>/css/main.css'
      }
    }
  });

  // These plugins provide necessary tasks.
  // Default task.
  grunt.registerTask('default', []);
  grunt.registerTask('content', ['less:assets', 'autoprefixer', 'shell:jekyll']);
  grunt.registerTask('dev', ['connect:server', 'watch']);

};
