module.exports = function (grunt) {

  require('jit-grunt')(grunt);
  
  var appModules = grunt.file.expand ({filter: "isFile", cwd: "root/_/app/js"}, ["*/*.js"]).map (function (s) {return 'app/' + s.replace ('.js', '')})
  appModules.unshift ('../app/handler')

  grunt.initConfig ({
    
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          relativeUrls: true,
          optimization: 2,
          plugins: [require ('less-plugin-glob')]
        },
        files: {
          "root/_/libs/tasks/tasks.css": "root/_/libs/tasks/tasks.less"
        }
      }
    },
    
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: false,
        createTag: false,
        push: false
      }
    },
    
    replace: {
      versionNumber: {
        src: ['root/index.html'],
        overwrite: true,
        replacements: [{
          from: /var ver.*/,
          to: "var ver = '<%= grunt.file.readJSON ('package.json') ['version'] %>';"
        }]
      }
    },
        
    concat: {
        options: {
            stripBanners: true,
        },
        js: {
            src: [
                'root/_/libs/jquery/jquery-3.5.1.min.js', 
                'root/_/libs/dx/dx-quill.min.js',
                'root/_/libs/dx/dx.all.js',
                'root/_/libs/dx/dx.messages.ru.js',
                'root/_/libs/blockUI/jquery.blockUI.min.js',                 
                'root/_/libs/elu/elu.js',
                'root/_/app/handler.js',
                'root/_/app/js/data/*.js',
                'root/_/app/js/view/*.js',
            ],
            dest: 'root/_/app/js/_.js',
        },
    },    
    
    compress: {
      js: {
        options: {mode: 'gzip'},
        expand: true,
        cwd: 'root/_/app/js',
        ext: '.js.gz',
        src: ['*.js'],
        dest: 'root/_/app/js'
      },
    },
    
    clean: {
      gz: ['root/_/app/**/*.gz']
    },

    watch: {

      general: {
        files: [
            'root/_/app/html/*.html',
        ],
        tasks: ['bump', 'replace'],
        options: {nospawn: true}
      },

      styles: {
        files: [
            'root/_/libs/tasks/*.less',
            'root/_/app/less/*.less',
        ],
        tasks: ['bump', 'replace', 'less'],
        options: {nospawn: true}
      },

      js: {
        files: [
            'root/_/libs/**/*.js', 
            'root/_/app/handler.js',
            'root/_/app/js/data/*.js',
            'root/_/app/js/view/*.js',
        ],
        tasks: ['bump', 'replace', 'concat:js'],
        options: {nospawn: true}
      },

    }
    
  });
  
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-compress');
  
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['replace', 'less', 'concat', 'compress']);
  
};