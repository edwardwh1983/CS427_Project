$j(document).ready(function(){
	/**
	 * Parse the two build number from the url
	 * and get the links for each builds
	 */

	var url = $j(location).attr('href');
	var build1Index = url.indexOf("build1");
	var build2Index = url.indexOf("build2");

	var build1 = url.substring(build1Index + "build1".length + 1, build2Index - 1);
	var build2 = url.substring(build2Index + "build2".length + 1);

	var link1 = buildLink(build1, window.location.href);
	var link2 = buildLink(build2, window.location.href);

	$j('.cov_build1').html('<a class="homeLink" style="text-decoration: none" href =' + link1 + '>' + build1 + '</a>');
	$j('.cov_build2').html('<a class="homeLink" style="text-decoration: none" href =' + link2 + '>' + build2 + '</a>');

	requirejs(['diff'], function(diff){
		diff.loadFileChanges(build1, build2, function(changes){
		    $j('#alpha_file_changes').append(diff.createDomFileChanges(changes, build1, build2));
            $j("#fileContent").append("<a href='"+location.href.replace("home","aggregate")+"'><button> View all code changes</button></a>");
        });
	});
    remoteAction.getBuildDuration(build1,function(dur1){
        remoteAction.getBuildDuration(build2,function(dur2){
            dur1 = dur1.responseJSON;
            dur2 = dur2.responseJSON;
            $j('#alphaHeader').append("<div>Build Duration Diff:" + ((dur2 - dur1)/1000) + " seconds</div>");
        });
    });
	/**
	 * Animate the mouse hover effect on different sections on home page:
	 * When mouse is hover on any section, that section will become grey
	 */
	$j(".innerDiv").hover(function(){
		$j(this).css("background-color", "#eeeeee");
	}, function(){
		$j(this).css("background-color", "white");
	});
});

/**
 * This function build the links of each build we are comparing
 *
 * @param build = build number, url = the url address of current page
 * @return The link url of the corrosponding build
 */
function buildLink(build, url){
   var linkURL = url.substring(0, url.indexOf('TEAM_ALPHA_PLUGIN'));
   return linkURL + build;
}
