define(function(){
    /**
    * Returns the raw output of svn cat file@build1
    */
    function getFileContents(build, filePath, callback){
        if (typeof remoteAction == "undefined"){
            throw "No remoteAction object. Are you running from tests?";
        }
        if (typeof $j == "undefined"){
            throw "No $j object. Are you running from tests?";
        }
        remoteAction.getFileOfBuild(filePath, build, $j.proxy(function(e){
            if (callback)
                callback(e.responseJSON);
        }));
    }
    /**
    * Returns the raw output of svn diff file@build1 file@build2
    */
    function getDiffOfFileOfBuilds(filePath,build1, build2, callback){
        if (typeof remoteAction == "undefined"){
            throw "No remoteAction object. Are you running from tests?";
        }
        if (typeof $j == "undefined"){
            throw "No remoteAction object. Are you running from tests?";
        }
        remoteAction.getDiffOfFileOfBuilds(filePath, build1, build2, $j.proxy(function(e){
            if (callback)
                callback(e.responseJSON);
        }));
    }
    return {
        _getFileContents: getFileContents,
        getDiffOfFileOfBuilds: getDiffOfFileOfBuilds,
        getQueryParams: function(){
        try {
            var url = window.location.href;
            var queryParamString = url.split("?")[1];
            var queryParamPairStrings = queryParamString.split("&");
            params = {};
            queryParamPairStrings.each(function(s) {
                split_string = s.split("=");
                key = split_string[0];
                value = split_string[1];
                params[key]=value;
            }
            );
            return params;
        }
        catch(e) {
            return {};
        }
    },

    getFileContents: function(buildNo, filePath){
       if(buildNo==0) {
           return 'a\nb\nc\nd\ne\nf\nA\nh\ni\nj\nk\nL\nA\nn\no\np\nq\nr\ns\nt\nu\nv\nw\nx\ny\nz\nA\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nl\nM\nN\nO\nP\nQ\nR\nS\nT\nU\nV\nW\nX\nY\nZ';
       }
       else {
           return 'a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\nl\nm\nn\no\np\nq\nr\ns\nt\nu\nv\nw\nx\ny\nz\nA\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM\nN\nO\nP\nQ\nR\nS\nT\nU\nV\nW\nX\nY\nZ';
       }
    },

    doDiff: function(str1, str2, expanded) {
        ALL_CONTENTS = Number.MAX_SAFE_INTEGER;
        
        // Put strings into difflib data stuctures
        var file1 = difflib.stringAsLines(str1);
        var file2 = difflib.stringAsLines(str2);

        // Instantiate the difflib differ
        var sm = new difflib.SequenceMatcher(file1, file2);

        // Compute difflib metadata
        var opcodes = sm.get_opcodes();

        var contextSize = expanded ? ALL_CONTENTS : 5;
        console.log("Context size is " + contextSize);
        // build the diff view and add it to the current DOM
        var diffview_data = {
            baseTextLines: file1,
            newTextLines: file2,
            opcodes: opcodes,
            // set the display titles for each resource
            baseTextName: "Build " + build1,
            newTextName: "Build " + build2,
            contextSize: contextSize,
            viewType: 0 // Side by side diff (0), rather than inline (1)
        };

        return diffview_data;





    }


  };
}
);

