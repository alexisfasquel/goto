module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'src/popup.css': 'scss/popup.scss'
        }
      }
    },

    htmlConvert: {
      options: {
        base: 'templates/',
        rename: function (moduleName) {
          return moduleName.replace('.html', '');
        }
      },
      template: {
        src: ['templates/*.html'],
        dest: 'tmp/templates.js'
      },
    },

    watch: {
      grunt: { files: ['Gruntfile.js'] },

      sass: {
        files: 'scss/**/*.scss',
        tasks: ['sass']
      },

      htmlConvert: {
        files: 'templates/*.html',
        tasks: ['htmlConvert']
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-html-convert');

  grunt.registerTask('build', ['sass', 'htmlConvert']);
  grunt.registerTask('default', ['build','watch']);

}
