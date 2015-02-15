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
      options: {
        sourceMap: true,
        sourceMapURL: 'main.css.map',
        sourceMapBasepath: '<%= config.root %>/_site/tmp/css',
        sourceMapFilename: '<%= config.root %>/_site/tmp/css/main.css.map',
        outputSourceFiles: true
      },
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
      options: {
        sourceMap: true
      },
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
      options: {
        sourceMap: true
      },
      css: {
        files: {
          '<%= config.root %>/_site/css/app.css' : '<%= concat.css.dest %>'
        }
      }
    },
    uglify: {
      options: {
        sourceMap: true,
        sourceMapIn: '<%= concat.js.dest %>.map',
        sourceMapIncludeSources: true
      },
      js: {
        files: {
          '<%= config.root %>/_site/js/app.js' : '<%= concat.js.dest %>'
        }
      }
    },
    autoprefixer: {
      options: {
        map: true
      },
      generated: {
        src: '<%= config.root %>/_site/tmp/css/main.css',
        dest: '<%= config.root %>/_site/tmp/css/main.css'
      }
    },
    aws: grunt.file.readJSON('grunt-aws.json'),
    s3: {
      options: {
        key: '<%= aws.key %>',
        secret: '<%= aws.secret %>',
        region: '<%= aws.region %>',
        bucket: '<%= aws.bucket %>',
        access: 'public-read',
        headers: {
          'X-i-live-in' : 'Omaha',
          'Cache-Control': 'max-age=604800000, public',
          'Expires': new Date(Date.now() + 604800000).toUTCString()
        },
        gzip: true,
        gzipExclude: ['.jpg', '.png', '.gif', '.jpeg']
      },
      blog: {
        sync: [
          {
            src: '<%= config.root %>/_site/**/*',
            rel: '<%= config.root %>/_site',
            dest: '/',
            options: { verify: true }
          }
        ]
      }
    },
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
  grunt.registerTask('deploy', ['content', 's3:blog']);

};
