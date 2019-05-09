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
          optimization: 2
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
                'root/_/libs/SlickGrid/lib/jquery-2.2.4.js',
                'root/_/libs/SlickGrid/lib/jquery-migrate-1.2.1.min.js',
                'root/_/libs/SlickGrid/lib/jquery.event.drag-2.3.0.js',
                'root/_/libs/SlickGrid/lib/jquery-ui-1.11.3.min.js',
                'root/_/libs/w2ui/w2ui-1.5.rc1.min.js',
                'root/_/libs/blockUI/jquery.blockUI.min.js',                 
                'root/_/libs/SlickGrid/slick.core.js',
                'root/_/libs/SlickGrid/slick.grid.js',
                'root/_/libs/elu/elu.js',
                'root/_/libs/elu_slick/elu_slick.js',
                'root/_/libs/elu_w2ui/elu_w2ui.js',
                'root/_/app/handler.js',
                'root/_/app/js/data/*.js',
                'root/_/app/js/view/*.js',
            ],
            dest: 'root/_/app/js/_.js',
        },
    },    
    
    shell: {
        reboot: {command: '/etc/init.d/tasks restart'}
    },

    compress: {
      xslt: {
        options: {mode: 'gzip'},
        expand: true,
        cwd: 'root/_/app/xslt',
        ext: '.xsl.gz',
        src: ['*.xsl'],
        dest: 'root/_/app/xslt'
      },
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
        files: ['root/**/*.*'],
        tasks: ['bump', 'replace'],
        options: {nospawn: true}
      },

      styles: {
        files: ['root/_/libs/tasks/*.less'],
        tasks: ['less'],
        options: {nospawn: true}
      },

      js: {
        files: [
            'root/_/libs/**/*.js', 
            'root/_/app/handler.js',
            'root/_/app/js/data/*.js',
            'root/_/app/js/view/*.js',
        ],
        tasks: ['concat:js'],
        options: {nospawn: true}
      },
/*
      model: {
        files: ['../back/lib/Model/*.pm', '../back/lib/Config.pm'],
        tasks: ['shell:reboot'],
        options: {nospawn: true}
      },
*/
    }
    
  });
  
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-compress');
  
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['replace', 'less', 'concat', 'compress']);
  
};