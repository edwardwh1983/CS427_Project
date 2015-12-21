define(function(){
 return {

  /**
  * This function takes in the build number and the location url and returns
  * the location for the JSON of the test information
  *
  * args: build = the build number, url = the url of the location
  * ret: the location of the JSON URL
  */
  buildURL: function(build, url){
   var baseURL = url.substring(0, url.indexOf('TEAM_ALPHA_PLUGIN'));
   return baseURL + build +  "/testReport/api/json";
  },


  /**
  * This function parses the JSON object into an array of the proper tests, removing the overhead
  *
  * args: JSONObjs = the raw JSON object as returned by Jenkins
  * ret: The parsed array of tests
  */
  parseJSON: function(JSONObj){
   var reducedJSON = [];   //Create a new JSONArray which contains information on tests
   if(typeof JSONObj["childReports"] === "undefined") return [];
   var tests = JSONObj["childReports"][0]["result"]["suites"];
   for(var i=1; i<tests.length; i++){
    for(var j=0; j < tests[i]["cases"].length; j++) {
     isJava = true;
     if(tests[i]["cases"][j].className == "jasmine") isJava = false;
     var test = {
      "name": tests[i]["cases"][j].name,
      "status": tests[i]["cases"][j].status,
      "duration": tests[i]["cases"][j].duration,
      "skipped": tests[i]["cases"][j].skipped,
      "java": isJava
     }
     reducedJSON.push(test);
     }
    }
   return reducedJSON;
  },


  /**
  * This function is designed to get the numeric information of an indiviudal test,
  * it is designed to be an accompaniment to the shallow diff method
  *
  * args: testInfo = an array of JSON information about a test
  * ret: A JSON Object displaying the numeric information about the test
  * */
  getNumericInformation: function(testInfo){
   var passed = 0;
   var failed = 0;
   var ignored = 0;

   for(var i=0; i<testInfo.length; i++){
    if(testInfo[i].status == "PASSED") passed ++;
    else if(testInfo[i].status == "FAILED") failed ++;
    else ignored ++;
   }

   return {
    "passed": passed,
    "failed": failed,
    "ignored": ignored
   }

  },


  /**
  * This function gets the numeric differences in the testing arrays, nothing to in depth
  * It is meant to be shown on the main page
  *
  * args: test1, test2 = the parsed JSON arrays
  * ret: A JSON Object detailing the changes
  */
  getShallowDiff: function(deepDiff){

   var added = 0;
   var deleted = 0;
   var changed = 0;
   for(var i=0; i<deepDiff.length; i++){
    if((deepDiff[i].status === "Newly Failing") || (deepDiff[i].status === "Newly Passing")){
     changed ++;
    } else if(deepDiff[i].status === "Added"){
     added ++;
    } else {
     deleted ++;
    }
   }

   return {
    "added": added,
    "deleted": deleted,
    "changed": changed
   }

  },

  /**
  * This function gets the detailed difference between the tests, including all relevant information
  *
  * args: test1, test2 = the parsed JSON arrays
  * ret: A JSON Object detailing the exact differences
  */
  getDeepDiff: function(test1, test2){

   var deepDiff = [];
   var isInBothArrays = false;

   for(i = 0; i < test1.length; i++) {
    isInBothArrays = false;

    for(j = 0; j < test2.length; j++) {
     if(test1[i].name == test2[j].name) {
      isInBothArrays = true; //set boolean to true, as the test is in both builds

      if(test1[i].status == "PASSED" && test2[j].status == "FAILED") { //Test passed in first build, but failed in the second build
       deepDiff.push({
        "name" : test1[i].name,
        "status" : "Newly Failing"
       });
      }

     if(test1[i].status == "FAILED" && test2[j].status == "PASSED"){ //Test failed in first build, but passed in second build
      deepDiff.push({
       "name" : test1[i].name,
       "status" : "Newly Passing"
      });
     }
    }
   }

   if(isInBothArrays == false) { //Test exists in first build but not in second / deleted test
    deepDiff.push({
     "name" : test1[i].name,
     "status" : "Deleted"
    });
   }
  }

  /**
  * This whole section is to check for tests that exist in the second array/build but
  * do not in the first array/build. All of these tests will be added to the deepDiff
  * array with the status "Added"
  */
  for(k = 0; k < test2.length; k++) {
    isInBothArrays = false;

    for(m = 0; m < test1.length; m++) {
     if(test2[k].name == test1[m].name) {
      isInBothArrays = true;
     }
    }

     if(isInBothArrays == false) {
      deepDiff.push({
       "name" : test2[k].name,
       "status" : "Added"
      });
     }
    }
  return deepDiff;
  },

  /**
  * This builds the HTML for the standard table that describes the status of each test during the build
  * args: parsedJSON - a parsed JSON array of the tests, buildNumber - an integer saying which number
  * ret: an HTML string to be appended to the DOM
  */
  buildBaseHTML: function(parsedJSON, buildNumber){
   var html = "";
   html += "<b>Build Number: " + buildNumber + "</b>";
   html += "<table class='numeric-table'>"
    html += "<tr>"
     html += "<th>Test Name</th>"
     html += "<th>Test Status</th>"
    html += "</tr>"
    for(var i=0; i<parsedJSON.length; i++){
     var element = parsedJSON[i];

     html += "<tr>"
      html += "<td class='tableName'>" + element.name + "</td>"
      html += "<td>" + element.status + "</td>";
     html += "</tr>"
    }
   html += "</table>";

   return html;
  },

  /**
  * This function builds the numeric information about a test, it is meant to be displayed on the home page
  * It shows how many tests pass, fail and are ignored during a build
  *
  * args: numericInfo1, numericInfo2 - A JS Object that displays the numeric information about the test, build1, build2 - The number of the build
  * ret: an HTML string to be displayed on the DOM
  */
  buildNumericHTML: function(numericInfo1, numericInfo2, build1, build2){
   var html = "";

   html += "<table class='summarization-table'>";
    html += "<tr>";
     html += "<th>Build</th>";
     html += "<th>Passed</th>";
     html += "<th>Failed</th>";
     html += "<th>Ignored</th>";
    html += "</tr>";
    html += "<tr>";
     html += "<td class='align-left'>" + build1 + "</td>";
     html += "<td class='align-left'>" + numericInfo1.passed + "</td>";
     html += "<td class='align-left'>" + numericInfo1.failed + "</td>";
     html += "<td class='align-left'>" + numericInfo1.ignored + "</td>";
    html += "<tr>";
    html += "<tr>";
     html += "<td class='align-right'>" + build2 + "</td>";
     html += "<td class='align-right'>" + numericInfo2.passed + "</td>";
     html += "<td class='align-right'>" + numericInfo2.failed + "</td>";
     html += "<td class='align-right'>" + numericInfo2.ignored + "</td>";
    html += "<tr>";
   html += "</table>";

   return html;
  },

 /**
 *This function builds the HTML for the shallow diff portion
 *
 * args: shallow - a JS object detailing the summarization of the tests
 * ret: an HTML string to be appended to the DOM
 */
  buildShallowHTML: function(shallow){
   var html = "";
   html += "<table class='shallow-table'>"
    html += "<tr>"
    html += "<th>Added Tests</th>"
     html += "<th class='extra-padding'>Deleted Tests</th>"
     html += "<th class='extra-padding'>Status Changed Tests</th>"
    html += "</tr>"
    html += "<tr>"
     html += "<th class='align-center extra-padding'>" + shallow.added + "</th>"
     html += "<th class='align-center extra-padding'>" + shallow.deleted + "</th>"
     html += "<th class='align-center extra-padding'>" + shallow.changed + "</th>"
    html += "</tr>"
   html += "</table>";

   return html;
  },

 /**
 * This function is a helper function that properly puts the checkboxes in the right area
 */
 addCheckBoxes: function(stat){

  checkBoxes = [];
  for(var i=0; i<4; i++){
   checkBoxes.push("<td><input type='checkbox' disabled/></td>");
  }

  var index = 0;
  if(stat == "Added"){
   index = 0;
  } else if(stat == "Deleted"){
   index = 1;
  } else if(stat == "Newly Passing"){
   index = 2;
  } else if(stat == "Newly Failing"){
   index = 3;
  }

  checkBoxes[index] = "<td><input type='checkbox' checked disabled/></td>";

  return checkBoxes.join(" ");

 },
 /**
 * This function builds the HTML for the deep diff portion
 *
 * args: shallow - a JS object detailing the deep difference of the tests
 * ret: an HTML string to be appended to the DOM
 * */
  buildDeepHTML: function(deep){
   var html = "";
   html += "<table class='deep-table'>"
    html += "<tr>"
     html += "<th>Test</th>"
     html += "<th>Added</th>"
     html += "<th>Deleted</th>"
     html += "<th>Newly Passing</th>"
     html += "<th>Newly Failing</th>"
    html += "</tr>"

    for(var i=0; i<deep.length; i++){
     html += "<tr>";
     html += "<td class='tableName'>" + deep[i].name + "</td>";
     html += this.addCheckBoxes(deep[i].status);
     html += "</tr>"
    }
   html += "</table>"

   return html;
  },

  /*
  * This function takes the raw JSON from the API and finds the information about the automatically generated tests
  *
  * args: rawJSON - the JSON object from the Jenkins API
  * ret: generatedTests - the array of Jenkins generated tests
  */
  findAutomaticallyGeneratedTests:function(rawJSON){
   var generatedTests = [];

   if(typeof rawJSON["childReports"] === "undefined") return [];

   var tests = rawJSON["childReports"][0]["result"]["suites"];
   for(var j=0; j < tests[0]["cases"].length; j++) {
    var test = {
     "name": tests[0]["cases"][j].name,
     "status": tests[0]["cases"][j].status,
     "duration": tests[0]["cases"][j].duration,
     "skipped": tests[0]["cases"][j].skipped,
     "java": true
    }
    generatedTests.push(test);
   }
   return generatedTests;
  },

  /*
  * This function finds the information for the selected test from the builds to display in depth
  *
  * args: testName - string that identifies the test. build1, build2 - the parsedJSON information about those tests
  * ret: an object that describes all of the statistice
  */
  findTest: function(testName, build1, build2){
   var retVal = [];
   for(var index=0; index<build1.length; index ++){
    if(build1[index]["name"] == testName){
     retVal.push(build1[index]);
    }
   }

   if(retVal.length == 0){
    retVal.push({});
   }

   for(var index=0; index<build2.length; index ++){
    if(build2[index]["name"] == testName){
     retVal.push(build2[index]);
    }
   }

   if(retVal.length == 1){
    retVal.push({});
   }

   return retVal;
  },

  /**
  * This function handles the advanced statistics for the number of test results built
  *
  * args: build - the parsedJSON about a build, buildNumber
  */
  getStatistics: function(build, buildNumber){
   var passNumber = 0;
   var durationTotal = 0;
   var skippedTotal = 0;
   var javaTotal = 0;

   for(var index=0; index<build.length; index++){
    var individualBuild = build[index];

    if(individualBuild.status == "PASSED") {
     passNumber ++;
    }

    if(typeof individualBuild.duration  != 'undefined') {
     durationTotal += individualBuild.duration
    }

    if(individualBuild.skipped == true) {
     skippedTotal ++;
    }
     
    if(individualBuild.java == true) {
     javaTotal ++;
    }
   }

   return {
    "buildNumber": buildNumber,
    "passNumber": passNumber,
    "skippedTotal": skippedTotal,
    "javaTotal": javaTotal,
    "durationTotal": durationTotal,
    "numberOfTests": build.length
   };
  },

  /**
  * This function generates the HTML for the statistics information
  *
  * args: A getStatistics object that holds the statistic information
  * return: an HTML string that should render all of the information
  */
  buildStatisticsHTML: function(buildInfo){
   
   var passPercentage = (Math.round((buildInfo.passNumber / buildInfo.numberOfTests), 2) * 100);
   var failPercentage = 100 - passPercentage;
   var skippedPercentage = Math.round(((buildInfo.skippedTotal / buildInfo.numberOfTests) * 100), 2);
   var javaPercentage = Math.round(((buildInfo.javaTotal / buildInfo.numberOfTests) * 100), 2)
   var durationAverage = (buildInfo.durationTotal / buildInfo.numberOfTests)

   var html = "";
   
   html += "<h5>Statistics for build " + buildInfo.buildNumber + "</h5>";
   html += "<p>Pass Percentage: " + passPercentage + "% (" + buildInfo.passNumber + "/ " + buildInfo.numberOfTests + ")</p>";
   html += "<p>Failure Percentage: " + failPercentage + "% (" + (buildInfo.numberOfTests - buildInfo.passNumber) + "/ " + buildInfo.numberOfTests + ")</p>";
   html += "<p>Skipped Test Percentage: " + skippedPercentage + "% (" + buildInfo.skippedTotal + "/ " + buildInfo.numberOfTests + ")</p>";
   html += "<p>Java Test Percentage: " + javaPercentage + "% (" + buildInfo.javaTotal + "/ " + buildInfo.numberOfTests + ")</p>";
   html += "<p>Average Test Duration: " + durationAverage + " seconds</p>";

   return html;
  },

  /**
  * This function generates the HTML needed to render a single test
  *
  * args: testInformation - a parsedJSON single object, buildNumber - int that holds the build number
  * ret: the html string that renders the items in the DOM
  */
  generateSingleTestHTML: function(testInformation, buildNumber){
   if(Object.keys(testInformation).length == 0){
    return "<h4>Test didn't exist in build " + buildNumber + "</h4>";
   }
 
   var html = "";
   html += "<h4>" + testInformation.name + " in build number " + buildNumber + "</h4>";
   html += "<ul>"
    html += "<li>Status: " + testInformation.status + "</li>"
    html += "<li>Skipped: " + testInformation.skipped + "</li>"
    html += "<li>Java Test: " + testInformation.java + "</li>"
    html += "<li>Duration: " + testInformation.duration + " seconds</li>"
   html += "</ul>"

   return html;
  },

  /**
  * This function builds the html for the filter area as apparently, jelly does not like checkboxes
  */
  buildFilterArea: function(){
   var html = "";
   html += "<ul>"
    html += "<li>Added: <input type='checkbox' id='addedFilter' checked/></li>"
    html += "<li>Deleted: <input type='checkbox' id='deletedFilter' checked/></li>"
    html += "<li>Newly Passed: <input type='checkbox' id='newPassFilter' checked/></li>" 
    html += "<li>Newly Failed: <input type='checkbox' id='newFailFilter' checked/></li>" 
   html += "</ul>"

   return html;
  },

  /**
  * This function filters the deep diff section based on the user selection
  */
  filter:function(deepList, filter){
   var newList = [];

   for(var index=0; index<deepList.length; index++){ 
    toPush = false;
    if(
     ((filter.indexOf("added") > -1) && (deepList[index].status == "Added")) ||
     ((filter.indexOf("deleted") > -1) && (deepList[index].status == "Deleted")) ||
     ((filter.indexOf("pass") > -1) && (deepList[index].status == "Newly Passing")) ||
     ((filter.indexOf("fail") > -1) && (deepList[index].status == "NewlyFailing"))   
     ){
     newList.push(deepList[index]);
    }
   }

   return newList
  }
 }; 
});
