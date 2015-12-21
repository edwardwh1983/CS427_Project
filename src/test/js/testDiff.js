define(["src/main/webapp/js/testDiff.js"], function(testDiff){
 
  /* The following 2 variables are my mock data */
  var testJSON1;
  var testJSON2;

  beforeEach(function(){
   testJSON1 = {"failCount":0,"skipCount":0,"totalCount":9,"urlName":"testReport","childReports":[{"child":{"number":4,"url":"https://fa15-cs427-126.cs.illinois.edu:8083/job/Alpha%20Plugin%20Test/org.jenkins-ci.plugins$test-results-analyzer/4/"},"result":{"duration":3.24,"empty":false,"failCount":0,"passCount":9,"skipCount":0,"suites":[{"cases":[{"age":0,"className":"org.jvnet.hudson.test.JellyTestSuiteBuilder$JellyCheck","duration":0.314,"failedSince":0,"name":"org\\/jenkinsci\\/plugins\\/testresultsanalyzer\\/TestResultsAnalyzerExtension\\/config.jelly","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jvnet.hudson.test.JellyTestSuiteBuilder$JellyCheck","duration":0.0,"failedSince":0,"name":"org\\/jenkinsci\\/plugins\\/testresultsanalyzer\\/TestResultsAnalyzerExtension\\/index.jelly","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jvnet.hudson.test.JellyTestSuiteBuilder$JellyCheck","duration":0.035,"failedSince":0,"name":"org\\/jenkinsci\\/plugins\\/testresultsanalyzer\\/TestResultsAnalyzerAction\\/config.jelly","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jvnet.hudson.test.JellyTestSuiteBuilder$JellyCheck","duration":0.19,"failedSince":0,"name":"org\\/jenkinsci\\/plugins\\/testresultsanalyzer\\/TestResultsAnalyzerAction\\/index.jelly","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jvnet.hudson.test.JellyTestSuiteBuilder$JellyCheck","duration":0.0,"failedSince":0,"name":"index.jelly","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jvnet.hudson.test.junit.FailedTest","duration":0.0,"failedSince":0,"name":"org.jvnet.hudson.test.JellyTestSuiteBuilder$JellyTestSuite","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jvnet.hudson.test.PluginAutomaticTestBuilder$CliSanityTest","duration":2.701,"failedSince":0,"name":"testCliSanity","skipped":false,"status":"PASSED"}],"duration":3.24,"id":null,"name":"InjectedTest","timestamp":null},{"cases":[{"age":0,"className":"org.jenkinsci.plugins.testresultanalyzer.TestTestResultsAnalyzerAction","duration":0.0,"failedSince":0,"name":"myTestThing","skipped":false,"status":"PASSED"}],"duration":0.0,"id":null,"name":"org.jenkinsci.plugins.testresultanalyzer.TestTestResultsAnalyzerAction","timestamp":null},{"cases":[{"age":0,"className":"jasmine","duration":0.0,"failedSince":0,"name":"Hello world says hello","skipped":false,"status":"PASSED"}],"duration":0.0,"id":null,"name":"jasmine.specs","timestamp":"2015-11-02T02:07:27"}]}}]}
  
  testJSON2 = {"failCount":2,"skipCount":1,"totalCount":46,"urlName":"testReport","childReports":[{"child":{"number":8,"url":"https://fa15-cs427-126.cs.illinois.edu:8083/job/Alpha%20Plugin%20Test/org.jenkins-ci.plugins$test-results-analyzer/8/"},"result":{"duration":29.171,"empty":false,"failCount":2,"passCount":43,"skipCount":1,"suites":[{"cases":[{"age":0,"className":"org.jvnet.hudson.test.JellyTestSuiteBuilder$JellyCheck","duration":0.298,"failedSince":0,"name":"org\\/jenkinsci\\/plugins\\/testresultsanalyzer\\/TestResultsAnalyzerExtension\\/config.jelly","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jvnet.hudson.test.JellyTestSuiteBuilder$JellyCheck","duration":0.01,"failedSince":0,"name":"org\\/jenkinsci\\/plugins\\/testresultsanalyzer\\/TestResultsAnalyzerExtension\\/index.jelly","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jvnet.hudson.test.JellyTestSuiteBuilder$JellyCheck","duration":0.039,"failedSince":0,"name":"org\\/jenkinsci\\/plugins\\/testresultsanalyzer\\/TestResultsAnalyzerAction\\/config.jelly","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jvnet.hudson.test.JellyTestSuiteBuilder$JellyCheck","duration":0.169,"failedSince":0,"name":"org\\/jenkinsci\\/plugins\\/testresultsanalyzer\\/TestResultsAnalyzerAction\\/index.jelly","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jvnet.hudson.test.JellyTestSuiteBuilder$JellyCheck","duration":0.093,"failedSince":0,"name":"org\\/jenkinsci\\/plugins\\/testresultsanalyzer\\/TestResultsAnalyzerAction\\/home.jelly","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jvnet.hudson.test.JellyTestSuiteBuilder$JellyCheck","duration":0.108,"failedSince":0,"name":"org\\/jenkinsci\\/plugins\\/testresultsanalyzer\\/TestResultsAnalyzerAction\\/test.jelly","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jvnet.hudson.test.JellyTestSuiteBuilder$JellyCheck","duration":0.179,"failedSince":0,"name":"org\\/jenkinsci\\/plugins\\/testresultsanalyzer\\/TestResultsAnalyzerAction\\/code_diff.jelly","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jvnet.hudson.test.JellyTestSuiteBuilder$JellyCheck","duration":0.105,"failedSince":0,"name":"org\\/jenkinsci\\/plugins\\/testresultsanalyzer\\/TestResultsAnalyzerBuildExtension\\/config.jelly","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jvnet.hudson.test.JellyTestSuiteBuilder$JellyCheck","duration":0.0,"failedSince":0,"name":"org\\/jenkinsci\\/plugins\\/testresultsanalyzer\\/TestResultsAnalyzerBuildExtension\\/index.jelly","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jvnet.hudson.test.JellyTestSuiteBuilder$JellyCheck","duration":0.085,"failedSince":0,"name":"org\\/jenkinsci\\/plugins\\/testresultsanalyzer\\/TestResultsAnalyzerBuildAction\\/config.jelly","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jvnet.hudson.test.JellyTestSuiteBuilder$JellyCheck","duration":0.101,"failedSince":0,"name":"org\\/jenkinsci\\/plugins\\/testresultsanalyzer\\/TestResultsAnalyzerBuildAction\\/index.jelly","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jvnet.hudson.test.JellyTestSuiteBuilder$JellyCheck","duration":0.0,"failedSince":0,"name":"index.jelly","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jvnet.hudson.test.junit.FailedTest","duration":0.0,"failedSince":0,"name":"org.jvnet.hudson.test.JellyTestSuiteBuilder$JellyTestSuite","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jvnet.hudson.test.PluginAutomaticTestBuilder$CliSanityTest","duration":1.608,"failedSince":0,"name":"testCliSanity","skipped":false,"status":"PASSED"}],"duration":2.795,"id":null,"name":"InjectedTest","timestamp":null},{"cases":[{"age":0,"className":"org.jenkinsci.plugins.testresultanalyzer.TestFileDiff","duration":0.0,"failedSince":0,"name":"testEmpty","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jenkinsci.plugins.testresultanalyzer.TestFileDiff","duration":0.0,"failedSince":0,"name":"testConflict2","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jenkinsci.plugins.testresultanalyzer.TestFileDiff","duration":0.0,"failedSince":0,"name":"testConflict","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jenkinsci.plugins.testresultanalyzer.TestFileDiff","duration":0.0,"failedSince":0,"name":"testSimple","skipped":false,"status":"PASSED"}],"duration":0.0,"id":null,"name":"org.jenkinsci.plugins.testresultanalyzer.TestFileDiff","timestamp":null},{"cases":[{"age":0,"className":"org.jenkinsci.plugins.testresultanalyzer.TestSCMCommandsUtil","duration":0.094,"failedSince":0,"name":"testRunCommand","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jenkinsci.plugins.testresultanalyzer.TestSCMCommandsUtil","duration":0.0,"failedSince":0,"name":"testGetFileURL","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jenkinsci.plugins.testresultanalyzer.TestSCMCommandsUtil","duration":0.0,"failedSince":0,"name":"testReadFile","skipped":false,"status":"PASSED"}],"duration":0.094,"id":null,"name":"org.jenkinsci.plugins.testresultanalyzer.TestSCMCommandsUtil","timestamp":null},{"cases":[{"age":0,"className":"org.jenkinsci.plugins.testresultanalyzer.TestTestResultsAnalyzerAction","duration":3.258,"failedSince":0,"name":"testGetIconFileName","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jenkinsci.plugins.testresultanalyzer.TestTestResultsAnalyzerAction","duration":1.283,"failedSince":0,"name":"testGetFileChange_singleEmpty","skipped":false,"status":"PASSED"},{"age":2,"className":"org.jenkinsci.plugins.testresultanalyzer.TestTestResultsAnalyzerAction","duration":1.283,"failedSince":7,"name":"testGetFileChanges_old_singleEmpty","skipped":true,"status":"SKIPPED"},{"age":0,"className":"org.jenkinsci.plugins.testresultanalyzer.TestTestResultsAnalyzerAction","duration":4.186,"failedSince":0,"name":"testGetFileChanges_singleSingle","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jenkinsci.plugins.testresultanalyzer.TestTestResultsAnalyzerAction","duration":3.849,"failedSince":0,"name":"testGetDisplayName","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jenkinsci.plugins.testresultanalyzer.TestTestResultsAnalyzerAction","duration":5.106,"failedSince":0,"name":"testGetUrlName","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jenkinsci.plugins.testresultanalyzer.TestTestResultsAnalyzerAction","duration":3.385,"failedSince":0,"name":"myTestThing","skipped":false,"status":"PASSED"},{"age":0,"className":"org.jenkinsci.plugins.testresultanalyzer.TestTestResultsAnalyzerAction","duration":3.932,"failedSince":0,"name":"testGetCoverage","skipped":false,"status":"PASSED"}],"duration":26.282,"id":null,"name":"org.jenkinsci.plugins.testresultanalyzer.TestTestResultsAnalyzerAction","timestamp":null},{"cases":[{"age":0,"className":"jasmine","duration":0.0,"failedSince":0,"name":"Testing build duration should display ms","skipped":false,"status":"PASSED"},{"age":0,"className":"jasmine","duration":0.0,"failedSince":0,"name":"Testing build duration should display min","skipped":false,"status":"PASSED"},{"age":0,"className":"jasmine","duration":0.0,"failedSince":0,"name":"Testing build duration should display hr","skipped":false,"status":"PASSED"},{"age":0,"className":"jasmine","duration":0.0,"failedSince":0,"name":"Testing code coverage should display the code coverage difference correctly","skipped":false,"status":"PASSED"},{"age":0,"className":"jasmine","duration":0.0,"failedSince":0,"name":"Testing floatToPercentage should display the float in correct percentage form","skipped":false,"status":"PASSED"},{"age":0,"className":"jasmine","duration":0.0,"failedSince":0,"name":"Hello world says hello","skipped":false,"status":"PASSED"},{"age":0,"className":"jasmine","duration":0.0,"failedSince":0,"name":"diff.createDomFileChanges tests empty","skipped":false,"status":"PASSED"},{"age":1,"className":"jasmine","duration":0.0,"failedSince":8,"name":"diff.createDomFileChanges tests basic","skipped":false,"status":"REGRESSION"},{"age":1,"className":"jasmine","duration":0.0,"failedSince":8,"name":"diff.createDomFileChanges tests conflict","skipped":false,"status":"FAILED"},{"age":0,"className":"jasmine","duration":0.0,"failedSince":0,"name":"Hello world says hello","skipped":false,"status":"PASSED"},{"age":0,"className":"jasmine","duration":0.0,"failedSince":0,"name":"Testing Build Links should build the link properly","skipped":false,"status":"PASSED"},{"age":0,"className":"jasmine","duration":0.0,"failedSince":0,"name":"Parsing a build link should return the proper object","skipped":false,"status":"PASSED"},{"age":0,"className":"jasmine","duration":0.0,"failedSince":0,"name":"Testing Test URL should build a proper url","skipped":false,"status":"PASSED"},{"age":0,"className":"jasmine","duration":0.0,"failedSince":0,"name":"Testing Parsing of JSON should properly parse the JSON","skipped":false,"status":"PASSED"},{"age":0,"className":"jasmine","duration":0.0,"failedSince":0,"name":"Testing Numeric Difference should get the numeric information about a single test","skipped":false,"status":"PASSED"},{"age":0,"className":"jasmine","duration":0.0,"failedSince":0,"name":"Testing Shallow Diff should get the numeric differences","skipped":false,"status":"PASSED"},{"age":0,"className":"jasmine","duration":0.0,"failedSince":0,"name":"Testing Deep Diff should get the specific differences","skipped":false,"status":"PASSED"}],"duration":0.0,"id":null,"name":"jasmine.specs","timestamp":"2015-12-09T05:38:29"}]}}]}
 }); 


 describe("Testing Test URL", function(){
  it("should build a proper url", function(){
   var testURL = "https://fa15-cs427-126.cs.illinois.edu:8083/job/WHATEVERJOB/TEAM_ALPHA_PLUGIN/test";
   expect(testDiff.buildURL("4", testURL)).toBe("https://fa15-cs427-126.cs.illinois.edu:8083/job/WHATEVERJOB/4/testReport/api/json");
  });	
 });

 describe("Testing Parsing of JSON", function(){
  it("should handle a small number of tests JSON", function(){
   
   var parsedJSON = testDiff.parseJSON(testJSON1);
   expect(parsedJSON.length).toEqual(2);
   expect(parsedJSON).toEqual([
      { name : 'myTestThing', status : 'PASSED', duration : 0, skipped : false, java : true }, 
      { name : 'Hello world says hello', status : 'PASSED', duration : 0, skipped : false, java : false }
   ]);
  });
 });
 
 
 describe("Testing Automatic Generated Test Parsing", function(){
   it("should not care what build", function(){
    expect(testDiff.findAutomaticallyGeneratedTests(testJSON2)).toEqual(testDiff.findAutomaticallyGeneratedTests(testJSON2));
   });
 });

 describe("Testing getNumericInformation", function(){
   it("should handle basic numericDifferences", function(){
    var parsedJSON = testDiff.parseJSON(testJSON1);
    var numericInformation = testDiff.getNumericInformation(parsedJSON);
    expect(numericInformation).toEqual({ passed : 2, failed : 0, ignored : 0 });
   });

   it("should handle complex numericDifferences", function(){
    var parsedJSON = testDiff.parseJSON(testJSON2);
    var numericInformation = testDiff.getNumericInformation(parsedJSON);
    expect(numericInformation).toEqual({ passed : 29, failed : 1, ignored : 2 });
   });
 });

 describe("Testing deepDiff", function(){
   it("should handle a deep difference", function(){
    var parsedJSON = testDiff.parseJSON(testJSON1);
    var parsedJSON2 = testDiff.parseJSON(testJSON2);
    var deepDiff = testDiff.getDeepDiff(parsedJSON, parsedJSON2);
    expect(deepDiff).toEqual( [ 
     { name : 'testEmpty', status : 'Added' }, 
     { name : 'testConflict2', status : 'Added' }, 
     { name : 'testConflict', status : 'Added' }, 
     { name : 'testSimple', status : 'Added' }, 
     { name : 'testRunCommand', status : 'Added' }, 
     { name : 'testGetFileURL', status : 'Added' }, 
     { name : 'testReadFile', status : 'Added' }, 
     { name : 'testGetIconFileName', status : 'Added' }, 
     { name : 'testGetFileChange_singleEmpty', status : 'Added' }, 
     { name : 'testGetFileChanges_old_singleEmpty', status : 'Added' }, 
     { name : 'testGetFileChanges_singleSingle', status : 'Added' }, 
     { name : 'testGetDisplayName', status : 'Added' }, 
     { name : 'testGetUrlName', status : 'Added' }, 
     { name : 'testGetCoverage', status : 'Added' }, 
     { name : 'Testing build duration should display ms', status : 'Added' }, 
     { name : 'Testing build duration should display min', status : 'Added' }, 
     { name : 'Testing build duration should display hr', status : 'Added' }, 
     { name : 'Testing code coverage should display the code coverage difference correctly', status : 'Added' }, 
     { name : 'Testing floatToPercentage should display the float in correct percentage form', status : 'Added' }, 
     { name : 'diff.createDomFileChanges tests empty', status : 'Added' },
     { name : 'diff.createDomFileChanges tests basic', status : 'Added' }, 
     { name : 'diff.createDomFileChanges tests conflict', status : 'Added' }, 
     { name : 'Testing Build Links should build the link properly', status : 'Added' }, 
     { name : 'Parsing a build link should return the proper object', status : 'Added' }, 
     { name : 'Testing Test URL should build a proper url', status : 'Added' },
     { name : 'Testing Parsing of JSON should properly parse the JSON', status : 'Added' }, 
     { name : 'Testing Numeric Difference should get the numeric information about a single test', status : 'Added' }, 
     { name : 'Testing Shallow Diff should get the numeric differences', status : 'Added' }, 
     { name : 'Testing Deep Diff should get the specific differences', status : 'Added' } ]);
   });
 });

 describe("Testing findTest", function(){
  it("should find this test", function(){
   var parsedJSON = testDiff.parseJSON(testJSON1);
   var parsedJSON2 = testDiff.parseJSON(testJSON2);
   expect(testDiff.findTest("myTestThing", parsedJSON, parsedJSON2)).toEqual([ 
    { name : 'myTestThing', status : 'PASSED', duration : 0, skipped : false, java : true }, 
    { name : 'myTestThing', status : 'PASSED', duration : 3.385, skipped : false, java : true } 
   ]);
  });

  it("should not find this test", function(){
   var parsedJSON = testDiff.parseJSON(testJSON1);
   var parsedJSON2 = testDiff.parseJSON(testJSON2);
   expect(testDiff.findTest("FAILURETESTDONOTHAVE", parsedJSON, parsedJSON2)).toEqual([{}, {}]);   
  });
 });

 describe("Testing getStatistics", function(){
   it("should find the statistics for this", function(){
    var parsedJSON = testDiff.parseJSON(testJSON1);

    expect(testDiff.getStatistics(parsedJSON, 1)).toEqual(
     { buildNumber : 1, passNumber : 2, skippedTotal : 0, javaTotal : 1, durationTotal : 0, numberOfTests : 2 }
    );
   });
 });

 describe("Testing getShallowDiff", function(){
  it("should get a shallowDiff", function(){
   var parsedJSON = testDiff.parseJSON(testJSON1);
   var parsedJSON2 = testDiff.parseJSON(testJSON2);
   var deepDiff = testDiff.getDeepDiff(parsedJSON, parsedJSON2);

   expect(testDiff.getShallowDiff(deepDiff)).toEqual({ added : 29, deleted : 0, changed : 0 });
  });
 });


});
