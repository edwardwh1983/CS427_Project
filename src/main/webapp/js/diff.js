define(function(){
    return {

        /**Gets a JSON array representing the file changes between 2 builds.
        Passes the array to the provided callback.
        Since this does nothing except request data from Jenkins, it is not unit testable.*/
        loadFileChanges: function(build1, build2, callback){
        	remoteAction.getFileChanges(build1, build2, $j.proxy(function(response){
				callback(response.responseObject());
			}));
        },


        /**Turns an array of changes into an HTML string.
        A change is an object with a name and status (A/D/M).
        Requires both builds so this function can create links
        to the individual file-diff pages.*/
        createDomFileChanges: function(changes, build1, build2){
            if(changes.length === 0){
                return '<p><emph>No files were changed.</emph></p>';
            }

            var out = '';

            for(var c = 0; c < changes.length; c++){
                var cur = changes[c];
				var status = '', cls = '';
				if(cur.status === 'A'){status = '+'; cls = 'alphaAdded';}
				else if(cur.status === 'M'){status = 'M'; cls = 'alphaModified';}
				else if(cur.status === 'D'){status = '--'; cls = 'alphaDeleted';}
				else {throw "unexpected: " + cur.status;}

                var href = 'code_diff?build1=' + build1 + '&build2=' + build2 +
                        '&file=' + encodeURIComponent(cur.name);
				out += ('<li><a class="homeLink" href="' + href + '"><span class="' + cls + '">' + status + '</span> ' + cur.name + '</a></li>\n');
            }

            return out;
        }
    }

});
