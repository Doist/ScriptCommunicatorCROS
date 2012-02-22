ScriptCommunicator = {

    /*
     * on_error is only supported on modern browsers:
     *      IE 8+, Chrome, Firefox, Safari
     */
    sourceJavaScript: function(uri, on_success, on_error) {
        var xhr = ScriptCommunicator.request = ScriptCommunicator.createCORSRequest('GET', uri);

        if(xhr) {
            xhr.onload = function() {
                eval(xhr.responseText);
                on_success();
            };

            xhr.onerror = function() {
                if(on_error)
                    on_error();
            }

            xhr.send();
        }
        else {
            var script_channel = document.createElement('script');
            script_channel.async = false;
            script_channel.src = uri;
            script_channel.type = "text/javascript";
            script_channel.className = 'temp_script';

            var agent = navigator.userAgent.toLowerCase();
            if(agent.indexOf("msie") != -1) { //IE
                script_channel.onreadystatechange = function() {;
                    if(!this.readyState || this.readyState === "loaded" || this.readyState === "complete") { 
                        return on_success();
                    }
                }
            }
            else {
                script_channel.onload = function() {
                    on_success();
                }
            }

            var body = document.getElementsByTagName('body')[0];
            body.appendChild(script_channel);
        }
    },

    createCORSRequest: function (method, url){
        var xhr = new XMLHttpRequest();

        if("withCredentials" in xhr) {
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            xhr = new XDomainRequest();
            xhr.onprogress = function() { }
            xhr.timeout = 120000;
            xhr.open(method, url);
        } else {
            xhr = null;
        }

        return xhr;
    }
    
}
