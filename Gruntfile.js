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
        files: ['<%= config.root %>/_drafts/**/*', '<%= config.root %>/_posts/**/*', '<%= config.root %>/_layouts/**/*', '<%= config.root %>/index.html', '<%= config.root %>/css/**/*.less'],
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
  grunt.registerTask('content', ['less:assets', 'autoprefixer', 'shell:jekyll']);
  grunt.registerTask('dev', ['connect:server', 'watch']);
  grunt.registerTask('deploy', ['content', 'aws_s3']);

};
