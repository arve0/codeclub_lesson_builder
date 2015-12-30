/*
 * Various utility functions
 */


/**
 * Get parameter value from url, f.ex. if url is http://example.com/some/path?myparam=myval&a=123
 * then getParameterByName('myparam') will return 'myval' and getParameterByName('a') will return '123'.
 */
// Copied from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
export function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
