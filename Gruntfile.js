const { readFileSync } = require('fs');

const aws = JSON.parse(readFileSync('grunt-aws.json', 'utf8'));

module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    config: {
      root: 'blog',
      site: '<%= config.root %>/_site'
    },
    copy: {
      cssIncludes: {
        files: [
          {'<%= config.root %>/_includes/css-includes.css' : '<%= config.root %>/_site/tmp/css/main.css'}
        ]
      },
      maps: {
        files: {
          '<%= config.root %>/_site/main.css.map' : '<%= config.root %>/_site/tmp/css/main.css.map'
        }
      },
      sw: {
        files: [{
          expand: true,
          cwd: 'node_modules/sw-toolbox/',
          src: ['sw-toolbox*'],
          dest: '<%= config.root %>/_site/js/'
        }],
      }
    },
    shell: {
      build: {
        command: 'bundle exec jekyll build --future',
        options: {
          stdout: true,
          execOptions: {
            cwd: '<%= config.root %>'
          }
        }
      },
      jekyll: {
        command: 'bundle exec jekyll build --drafts --future',
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
    sass: {
      options: {
        sourceMap: true,
        sourceMapContents: true,
        outputStyle: 'compressed',
        includePaths: [
          '<%= config.root %>/_site/tmp/css/',
          '<%= config.root %>/_assets/css/',
        ]
      },
      assets: {
        files: [{
          expand: true,
          cwd: '<%= config.root %>/_assets/css',
          src: '*.scss',
          dest: '<%= config.root %>/_site/tmp/css',
          ext: '.css'
        }]
      }
    },
    clean: {
      tmp: ['<%= config.root %>/_site/tmp']
    },
    cloudfront_invalidation: {
      options: {
        credentials: {
          accessKeyId: aws.key,
          secretAccessKey: aws.secret,
          distributionId: aws.cloudfrontDistributionId
        },
        onInvalidationComplete() {
          console.log('invalidated everything');
        }
      },
      build: {
        options: {
          invalidations: [ '/*' ]
        }
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
          '<%= config.root %>/_site/css/main.css' : '<%= concat.css.dest %>'
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
    s3: {
      options: {
        accessKeyId: aws.key,
        secretAccessKey: aws.secret,
        region: aws.region,
        bucket: aws.bucket,
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
    webpack: {
      app: require('./webpack.config.js')
    }
  });

  // These plugins provide necessary tasks.
  // Default task.
  grunt.registerTask('default', ['content']);
  grunt.registerTask('css', ['sass:assets', 'autoprefixer', 'copy:cssIncludes']);
  grunt.registerTask('js', ['webpack']);
  grunt.registerTask('content', ['shell:jekyll', 'css', 'js', 'copy:maps', 'copy:sw', 'clean:tmp']);
  grunt.registerTask('build', ['shell:build', 'css', 'js', 'copy:maps', 'copy:sw', 'clean:tmp']);
  grunt.registerTask('serve', ['content', 'connect:server', 'watch']);
  grunt.registerTask('deploy', ['build', 's3', 'cloudfront_invalidation']);

};
