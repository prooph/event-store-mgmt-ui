# Autoloading

ES-Mgmt-UI backend uses PSR-4 autoloader (composer) to load classes for example value objects or
infrastructure and library classes.

The domain model is implemented using pure functions. [prooph/micro](https://github.com/prooph/micro) is
used to tie domain model and prooph infrastructure together.
Function autoloading cannot be achieved in PHP. You can only require all files that contain functions.
To simplify that process the backend uses a directory scan + file naming convention.

The naming convention for files including namespaced functions is: `<filename>.func.php`.

The mechanism can be found in `autoload.func.php` located in the project root next to `composer.json`.

Note: Currently only a development mode is used. It is planed to merge all functions into a single file
for production and only require that file.

