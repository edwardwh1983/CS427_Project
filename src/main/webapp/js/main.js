/*
console.log("in main");
requirejs(["hello"], function(hello) {
    console.log("Hello:",hello.hello());
    console.log("yo yo yo");
});*/


requirejs(['buildSelect'], function(buildSelect){
    console.log(buildSelect);
    remoteAction.getTreeResult('all', $j.proxy(function(t){
        var numberOfBuilds = t.responseObject().builds[0];
        var date; // JSONObject of form { 1:date1, 2:date2, ...} where key is build number and value is date of that build number
        remoteAction.getBuildDates(numberOfBuilds, $j.proxy(function(a){
            date = a.responseObject()
            for(var i=1; i<= numberOfBuilds; i++){
                $j('#show').append($j('<option></option>').attr('value', i).text('#' + i + ", " + date[i.toString()])); 
            }

            var startFrom = 1; // starting build for the dropdown menu
            $j('#start').click(function(f){
                startFrom =parseInt($j('#show').val(),10); // parseInt() is necessary since the jQuery is a String
                $j('#build1').empty(); // clear build 1 dropdown so it can be repopulated with elements beginning with startFrom
                $j('#build2').empty();
                buildSelect.populateDropdownMenu(startFrom, numberOfBuilds, date, 0);
            });

            buildSelect.populateDropdownMenu(startFrom, numberOfBuilds, date, 0); // initialize dropdown menus of build1 and build2 to display all the builds
        })); 

        $j('#selectBuild').click(function(e){
            var build1 = $j('#build1').val();
            var build2 = $j('#build2').val();
            url = buildSelect.generateLink(build1, build2)
            document.location.href = url;
        });
    }, this));
});


requirejs(['coverageDiff', 'buildSelect'], function(coverage, buildSelect){
    var builds = buildSelect.getBuilds(window.location.href);
    var build1 = builds.build1;
    var build2 = builds.build2;

     remoteAction.getCoverage(build1, build2, $j.proxy(function(t) {
         //get the coverage result as a JSON object from the java method
         var itemsResponse = t.responseObject();
         console.log(itemsResponse);

         //get the line coverage, branch coverage and class coverage from the JSON file
         var lineCov1 = coverage.floatToPercentage(itemsResponse.lineRate1);
        var lineCov2 = coverage.floatToPercentage(itemsResponse.lineRate2);

        var branchCov1 = coverage.floatToPercentage(itemsResponse.branchRate1);
        var branchCov2 = coverage.floatToPercentage(itemsResponse.branchRate2);

        var classCov1 = coverage.floatToPercentage(itemsResponse.classRate1);
        var classCov2 = coverage.floatToPercentage(itemsResponse.classRate2);

        //calculte the test coverage difference between two builds
        var line_change = coverage.covDiff(itemsResponse.lineRate1, itemsResponse.lineRate2);
        var branch_change = coverage.covDiff(itemsResponse.branchRate1, itemsResponse.branchRate2);
        var class_change = coverage.covDiff(itemsResponse.classRate1, itemsResponse.classRate2);

        //display the test coverage result and coverage difference on the home page
        if(itemsResponse.hasOwnProperty('lineRate1') && itemsResponse.hasOwnProperty('lineRate2')){
            coverage.displayChange(lineCov1, branchCov1, classCov1, lineCov2, branchCov2, classCov2, line_change, branch_change, class_change, build1, build2);
        } else if(itemsResponse.hasOwnProperty('lineRate1')){
            coverage.displayChange(lineCov1, branchCov1, classCov1, "not available", "not available", "not available", "change is not available", "change is not available", "change is not available", build1, build2);
        } else if(itemsResponse.hasOwnProperty('lineRate2')){
            coverage.displayChange("not available", "not available", "not available", lineCov2, branchCov2, classCov2, "change is not available", "change is not available", "change is not available", build1, build2);
        } else {
            coverage.displayChange("not available", "not available", "not available", "not available", "not available", "not available", "change is not available", "change is not available", "change is not available", build1, build2);
        }
     }));
});

requirejs(['testDiff', 'buildSelect'], function(testDiff, buildSelect){
 var builds = buildSelect.getBuilds(window.location.href);
 var build1 = builds.build1;
 var build2 = builds.build2;
 var url1 = testDiff.buildURL(build1, window.location.href);
 var url2 = testDiff.buildURL(build2, window.location.href);
 var fail1 = false;
 var fail2 = false;


 if(window.location.href.indexOf("home") == -1){
  return;
 }
 var testURL = window.location.href.replace("home?", "test?");

 function displayInformation(testInfo1, testInfo2){
  $j('#testContent').append(testDiff.buildNumericHTML(testDiff.getNumericInformation(testInfo1), testDiff.getNumericInformation(testInfo2), build1, build2));

  var moreInformation = "";
  if(fail1){
   moreInformation = "Apologies, Jenkins does not have test information for build number " + build1 + " please select another build";
  } else if (fail2){
   moreInformation = "Apologies, Jenkins does not have test information for build number " + build2 + " please select another build";
  } else {
   moreInformation = "For More Information, Click <a class='homeLink' href='" + testURL +  "'> Here </a>";
  }
  $j('#testContent').append("<br>" + moreInformation);
 }

 function getInfo2(testInfo1){
  $j.get(url2, function(data2){
   displayInformation(testInfo1, testDiff.parseJSON(data2));
  }).fail(function(){
   fail2 = true;
   displayInformation(testInfo1, []);
  });
 }

 $j.get(url1, function(data){
  var testInfo1 = testDiff.parseJSON(data);
  getInfo2(testInfo1);
 }).fail(function(){
  fail1 = true;
  getInfo2([]);
 });

});
