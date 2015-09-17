module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      client: {
        src: [
        'public/lib/handlebars.js',
        'public/lib/underscore.js',
        'public/lib/jquery.js',
        'public/lib/backbone.js',
        'public/client/*.js'
        ],
        dest: 'public/dist/build.js'
      },
      options: {
        separator: ';\n'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      client: {
        files: {
          'public/dist/build.min.js': 'public/dist/build.js'
        }
      }
    },

    jshint: {
      client: 'public/client/*.js',
      concat: 'public/dist/build.js',
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/*.js'
          // 'public/dist/*.js'
        ]
      }
    },

    cssmin: {
        // Add filespec list here
        target: {
          files:[{
            src:'public/*.css',
            dest:'public/dist/styles.min.css'
          }]
        }
    },

    watch: {
      scripts: {
        files: [
          'public/client/*.js',
          'public/lib/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        // ????????
      },

      deploy: {
        command: 'git push azure master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'jshint:client',
    'concat',
    'uglify',
    'jshint:concat',
    'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
      grunt.task.run('deploy');
    } else {
      grunt.task.run([ 'jshint', 'test', 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
      // add your production server task here
      'jshint',
      'test',
      'shell:deploy'
  ]);


};
