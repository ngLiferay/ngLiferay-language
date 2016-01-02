# ngLiferay-language
The plugin used to call Liferay Language Service and bind the required language translations to dom node.
This plugin exposes a directive `ng-liferay-lang`.

 Two ways of using this plugin directive:
 *  Binding translation to dom html.
```html
<div class="container">
		Hello <span ng-liferay-lang="liferay"></span>
  </div>
```
Outputs to:
```html
Hello Liferay
```

*  Binding translation to dom attribute.
```html
<input class="form-control" name="email" ng-liferay-lang="{key: 'email-address', attr: 'placeholder'}" ng-model="user.login" placeholder="" required type="email">
```
Here input's placeholder attribute will have translation of `email-address` as per current locale.
