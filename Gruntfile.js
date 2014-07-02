/*global module:false*/
module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    config: {
      root: 'blog',
      bower: '../bower_components'
    },
    shell: {
      jekyll: {
        command: 'jekyll build --drafts',
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
        files: ['<%= config.root %>/_drafts/**/*', '<%= config.root %>/_posts/**/*', '<%= config.root %>/_layouts/**/*', '<%= config.root %>/index.html', '<%= config.root %>/_assets/**'],
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
          '<%= config.root %>/_site/tmp/css/main.css' : '<%= config.root %>/_assets/css/*.less'
        }
      }
    },
    clean: {
      tmp: ['<%= config.root %>/_site/tmp']
    },
    concat: {
      css: {
        src: [
          '<%= config.root %>/_site/tmp/css/*.css',
          '<%= config.root %>/_assets/css/*.css',
          'bower_components/iliveinomaha/*.css'
        ],
        dest: '<%= config.root %>/_site/css/app.src.css'
      },
      js: {
        src: [
          'bower_components/picturefill/dist/picturefill.js',
          '<%= config.root %>/_assets/js/*.js'
        ],
        dest: '<%= config.root %>/_site/js/app.src.js'
      }
    },
    cssmin: {
      css: {
        files: {
          '<%= config.root %>/_site/css/app.css' : '<%= concat.css.dest %>'
        }
      }
    },
    uglify: {
      js: {
        files: {
          '<%= config.root %>/_site/js/app.js' : '<%= concat.js.dest %>'
        }
      }
    },
    autoprefixer: {
      generated: {
        src: '<%= config.root %>/_site/tmp/css/main.css',
        dest: '<%= config.root %>/_site/tmp/css/main.css'
      }
    },
    aws: grunt.file.readJSON('grunt-aws.json'),
    aws_s3: {
      options: {
        accessKeyId: '<%= aws.key %>',
        secretAccessKey: '<%= aws.secret %>',
        region: '<%= aws.region %>',
        bucket: '<%= aws.bucket %>'
      },
      blog: {
        options: {
          debug: false
        },
        files: [
          { dest: '/', action: 'delete' },
          {
            cwd: '<%= config.root %>/_site',
            src: ['**'],
            dest: '',
            expand: true
          }
        ]
      }
    }
  });

  // These plugins provide necessary tasks.
  // Default task.
  grunt.registerTask('default', ['content']);
  grunt.registerTask('css', ['less:assets', 'concat:css', 'autoprefixer', 'cssmin']);
  grunt.registerTask('js', ['concat:js', 'uglify']);
  grunt.registerTask('content', ['shell:jekyll', 'css', 'js', 'clean:tmp']);
  grunt.registerTask('serve', ['content', 'connect:server', 'watch']);
  grunt.registerTask('deploy', ['content', 'aws_s3']);

};
