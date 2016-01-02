'use strict';

var app = angular.module("ngLiferay-language", []);

// app.config(function() {
//   console.log("$stateProvider");
// });

app.directive('ngLiferayLang', function(LanguageService) {
  return {
    restrict: 'A',
    scope: {
      ngLiferayLang: '&'
    },
    link: function(scope, elem, attr) {
      var attrValue = attr.ngLiferayLang;
      scope.$watch(attrValue, function(opts) {
        if (opts) {
          LanguageService.get(opts.key).then(function(s) {
            elem.prop(opts.attr, s);
          });
        } else {
          LanguageService.get(attrValue).then(function(s) {
            elem.text(s);
          });
        }
      });
    }
  };
});
