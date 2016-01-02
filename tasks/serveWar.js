'use strict';

var cheerio = require('cheerio'), urlM = require("url");

module.exports = function (grunt) {
  var lrProps = grunt.config('lr'),
    props = grunt.config('createWar').props, connect = grunt.config('yeoman').connect,
    url = connect.protocol + "://" + connect.host + ":" + connect.port,
    app = grunt.config('yeoman').app;

  function makeSrcRelative(source, check) {
    var $ = cheerio.load(source, {
    	decodeEntities: false
    }),
    warName = props.warName;

    /**
     * avoids duplicating of host
     */
    var checkPath = function (path) {
      if (!check) {
        return true;
      }
      else {
        var u = urlM.parse(path);
        return !(u.hostname === connect.host && u.port === connect.port);
      }
    };

    $('link').each(function () {
      var $t = $(this), href = $t.attr("href");
      if (href) {
        checkPath(href) && $t.attr("href", url + "/" + href);
      }
    });

    $('script').each(function () {
      var $t = $(this), src = $t.attr("src");
      if (src) {
        checkPath(src) && $t.attr("src", url + "/" + src);
      }
    });
    
    $('img').each(function () {
	    var $t = $(this);
//	    , src = $t.attr("src");
//	    if (src) {
//	      checkPath(src) && $t.attr("src", url + "/" + src);
//	    }
	    
	    //add fallback directive
	    $t.attr("fallback") && $t.attr("fallback", "true");
	  });

    return $.html();
  }


  grunt.registerTask('serveWar', 'Task to serve war for dev', function () {
    var warName = props.warName,
      vmFile = lrProps.portalDir + '/tomcat-7.0.42/webapps/' + warName + '/templates/portal_normal.vm';

    function modifyFile(filePath) {
      grunt.log.writeln("Modified file: " + filePath + " : " + grunt.file.isFile(vmFile));
      grunt.log.writeln((app + "\\index.html") + (filePath === app + "\\index.html"));
     
      //check for index.html
      if ((filePath === app + "/index.html") || (filePath === app + "\\index.html")) {
        if (grunt.file.isFile(vmFile)) {
          grunt.file.write(vmFile, makeSrcRelative(grunt.file.read(filePath), true));
          grunt.log.ok(warName + " is deployed.");
        }
        else {
          grunt.log.error("Portal normal vm is incorrect.");
        }
      }
      else {
        // check for other html files
        filePath.indexOf(".html") > -1 &&
        grunt.file.write(filePath, makeSrcRelative(grunt.file.read(filePath), true));
      }
    }

    grunt.file.recurse(app, function callback(abspath, rootdir, subdir, filename) {
      console.log(abspath)
      console.log(rootdir)
      console.log(subdir)
      console.log(filename)
      console.log("-----------------------------------------------")
      modifyFile(abspath);
    });

    grunt.event.on('watch', function (action, filepath, target) {
      grunt.log.writeln(target + ': ' + filepath + ' changed:----- ' + action);
      modifyFile(filepath);
    });

  });
};