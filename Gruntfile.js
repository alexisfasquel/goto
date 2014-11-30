module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'chrome/popup.css': 'src/popup.scss'
        }
      }
    },

    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'font/',
            src: '*.ttf',
            dest: 'chrome/res',
            ext: '.ttf'
          },
          {
            expand: true,
            cwd: 'design/resources',
            src: '*',
            dest: 'chrome/res'
          },
          {
            expand: true,
            cwd: 'src',
            src: ['*.html', '*.json'],
            dest: 'chrome'
          }
        ]
      }
    },

    htmlConvert: {
      options: {
        base: 'src/templates/',
        rename: function (moduleName) {
          return moduleName.replace('.html', '');
        }
      },
      template: {
        src: ['src/templates/*.html'],
        dest: 'tmp/templates.js'
      },
    },

    import: {
      options: {},
      dist: {
        expand: true,
        cwd: 'src/',
        src: '*.js',
        dest: 'chrome/',
        ext: '.js'
      }
    },

    compress: {
      main: {
        options: {
          archive: function() {
            var version = grunt.file.readJSON('src/manifest.json')['version'];
            return 'goto-' + version + '.zip';
          }
        },
        expand: true,
        cwd: 'chrome/',
        src: ['**/*'],
        dest: ''
      }
    },

    watch: {
      grunt: { files: ['Gruntfile.js'] },

      sass: {
        files: 'src/*.scss',
        tasks: ['sass']
      },

      htmlConvert: {
        files: 'src/templates/*.html',
        tasks: ['htmlConvert', 'import']
      },

      copy: {
        files: ['src/*.html', 'src/*.json'],
        tasks: ['copy']
      },

      import: {
        files:  ['src/*.js', 'tmp/*.js'],
        tasks: ['import']
      }
    }

  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-html-convert');
  grunt.loadNpmTasks('grunt-import');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('build', ['sass', 'htmlConvert', 'import', 'copy', 'compress']);
  grunt.registerTask('default', ['build', 'watch']);

}
