/*global module:false*/
module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    config: {
      root: 'blog',
      site: '<%= config.root %>/_site',
      bower: '../bower_components'
    },
    babel: {
      options: {
        sourceMap: true
      },
      exampleJs: {
        files: {
          '<%= config.site %>/tmp/js/page.js' : '<%= config.root %>/_assets/js/page.es6'
        }
      }
    },
    copy: {
      cssIncludes: {
        files: {
          '<%= config.root %>/_includes/css-includes.css' : '<%= config.root %>/_site/css/app.css' 
        }
      }
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
          base: '<%= config.site %>'
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
          'node_modules/fontfaceobserver/fontfaceobserver.standalone.js',
          'bower_components/picturefill/dist/picturefill.js',
          '<%= config.site %>/tmp/js/*.js',
          '<%= config.root %>/_assets/js/*.js'
        ],
        dest: '<%= config.root %>/_site/js/app.src.js'
      }
    },
    cssmin: {
      options: {
        sourceMap: true
        // Doesn't work yet, see https://github.com/jakubpawlowicz/clean-css/issues/397
        // sourceMap: '<%= concat.css.dest %>.map'
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
        accessKeyId: '<%= aws.key %>',
        secretAccessKey: '<%= aws.secret %>',
        region: '<%= aws.region %>',
        bucket: '<%= aws.bucket %>',
        access: 'public-read',
        cache: true,
        cacheTTL: 60*60*1000,
        meta: {
          'X-i-live-in' : 'Omaha',
        },
      },
      build: {
        cwd: '<%= config.root %>/_site',
        src: '**'
      }
    },
  });

  // These plugins provide necessary tasks.
  // Default task.
  grunt.registerTask('default', ['content']);
  grunt.registerTask('css', ['less:assets', 'concat:css', 'autoprefixer', 'cssmin', 'copy:cssIncludes']);
  grunt.registerTask('js', ['babel', 'concat:js', 'uglify']);
  grunt.registerTask('content', ['css', 'shell:jekyll', 'js', 'clean:tmp']);
  grunt.registerTask('serve', ['content', 'connect:server', 'watch']);
  grunt.registerTask('deploy', ['content', 's3']);

};
