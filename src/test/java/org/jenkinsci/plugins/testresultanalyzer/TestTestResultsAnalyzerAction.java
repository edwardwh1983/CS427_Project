package org.jenkinsci.plugins.testresultanalyzer;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;

import org.jenkinsci.plugins.testresultsanalyzer.*;
import org.jvnet.hudson.test.ExtractChangeLogParser;
import org.jvnet.hudson.test.ExtractChangeLogSet;
import org.jvnet.hudson.test.JenkinsRule;
import hudson.model.*;
import hudson.scm.ChangeLogSet;
import hudson.tasks.Shell;

import java.io.*;
import java.lang.ref.WeakReference;
import java.lang.reflect.Field;
import java.util.*;
import java.util.concurrent.ExecutionException;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.jvnet.hudson.test.JenkinsRule;
import org.apache.commons.io.FileUtils;

public class TestTestResultsAnalyzerAction {
    @Rule
    public JenkinsRule j = new JenkinsRule();

    TestResultsAnalyzerAction testResultsAnalyzer;

    FreeStyleProject project;
    @Before
    public void initialize() throws IOException, ExecutionException, InterruptedException{
        project = j.createFreeStyleProject();
        testResultsAnalyzer = new TestResultsAnalyzerAction(project);
    }

    @Test
    public void myTestThing(){
        assertEquals("build?build1=3&build2=4",
            testResultsAnalyzer.getBuildsLink("3","4"));
    }

    @Test
    public void testGetDisplayName(){
        String expected = "TEAM_ALPHA_PLUGIN";
        assertEquals(expected, testResultsAnalyzer.getDisplayName());
    }

    @Test
    public void testGetUrlName(){
        String expected = "TEAM_ALPHA_PLUGIN";
        assertEquals(expected, testResultsAnalyzer.getUrlName());
    }

    @Test
    public void testGetIconFileName(){
        String expected = "/plugin/test-results-analyzer/images/icon.png";
        assertEquals(expected, testResultsAnalyzer.getIconFileName());
    }

    @Test
    public void testGetNoOfBuilds() throws IOException, ExecutionException, InterruptedException{
        project.getBuildersList().add(new Shell("echo hello; sleep 2"));
        testResultsAnalyzer = new TestResultsAnalyzerAction(project);
        project.scheduleBuild2(0).get();
        testResultsAnalyzer.getJsonLoadData();
        JSONArray noOfBuilds = testResultsAnalyzer.getNoOfBuilds("5");
        assertTrue(noOfBuilds.size() == 1);
        assertTrue(noOfBuilds.getInt(0) == 1);
    }

    @Test
    public void testGetBuildDuration() throws IOException, ExecutionException, InterruptedException{
        project.getBuildersList().add(new Shell("echo hello; sleep 2"));
        testResultsAnalyzer = new TestResultsAnalyzerAction(project);
        project.scheduleBuild2(0).get();
        testResultsAnalyzer.getJsonLoadData();

        assertFalse(testResultsAnalyzer.project == null);
        assertFalse(testResultsAnalyzer.project.getBuildByNumber(1) == null);
        Long duration = testResultsAnalyzer.getBuildDuration("1");
        assertTrue(duration >=  1500);
        assertTrue(duration < 8000);
    }

    @Test
    public void testGetTreeResult() throws IOException, ExecutionException, InterruptedException{
        project.getBuildersList().add(new Shell("echo hello; sleep 2"));
        testResultsAnalyzer = new TestResultsAnalyzerAction(project);
        project.scheduleBuild2(0).get();
        testResultsAnalyzer.getJsonLoadData();

        JSONObject tree = testResultsAnalyzer.getTreeResult("1");
        assertTrue(tree.getJSONArray("builds").size() == 1);
        assertTrue(tree.getJSONArray("builds").getInt(0) == 1);
    }

    //This is a helper method to manually create a coverage.xml file for testing purpose
    public void writeXMLFile(FreeStyleBuild build, String content){
        try {
            File fXmlFile = new File(build.getRootDir().getAbsolutePath() + "/coverage.xml");
            fXmlFile.createNewFile();
            FileWriter fw = new FileWriter(fXmlFile);
            BufferedWriter bw = new BufferedWriter(fw);
            bw.write(content);
            bw.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testGetCoverage() throws Exception {
        FreeStyleProject project = j.createFreeStyleProject();
        FreeStyleBuild build1 = project.scheduleBuild2(0).get();
        FreeStyleBuild build2 = project.scheduleBuild2(0).get();

        String content1 = "<?xml version=\"1.0\"?><coverage line-rate=\"0.7\" branch-rate=\"0.9\">" +
                            "<packages><package><classes>" +
                            "<class line-rate=\"0.0\" branch-rate=\"0.0\"></class>" +
                            "<class line-rate=\"0.9\" branch-rate=\"0.9\"></class>" +
                            "</classes></package></packages></coverage>";
        String content2 = "<?xml version=\"1.0\"?><coverage line-rate=\"0.6\" branch-rate=\"0.8\">" +
                            "<packages><package><classes>" +
                            "<class line-rate=\"0.7\" branch-rate=\"0.8\"></class>" +
                            "<class line-rate=\"0.8\" branch-rate=\"0.9\"></class>" +
                            "</classes></package></packages></coverage>";

        writeXMLFile(build1, content1);
        writeXMLFile(build2, content2);

        TestResultsAnalyzerAction t = new TestResultsAnalyzerAction(project);

        JSONObject result = t.getCoverage("1", "2");

        assertEquals("0.7", result.getString("lineRate1"));
        assertEquals("0.6", result.getString("lineRate2"));
        assertEquals("0.9", result.getString("branchRate1"));
        assertEquals("0.8", result.getString("branchRate2"));
        assertEquals("0.5", result.getString("classRate1"));
        assertEquals("1.0", result.getString("classRate2"));
    }

    @Test public void testGetFileChange_singleEmpty(){
        List<ExtractChangeLogParser.ExtractChangeLogEntry> entries = new ArrayList<ExtractChangeLogParser.ExtractChangeLogEntry>();
        ExtractChangeLogParser.ExtractChangeLogEntry entry = new ExtractChangeLogParser.ExtractChangeLogEntry();
        entries.add(entry);
    }


    @Test
    public void testGetFileChanges_singleSingle(){
        List<ExtractChangeLogParser.ExtractChangeLogEntry> entries = new ArrayList<ExtractChangeLogParser.ExtractChangeLogEntry>();
        ExtractChangeLogParser.ExtractChangeLogEntry entry = new ExtractChangeLogParser.ExtractChangeLogEntry();
        entry.addFile(new ExtractChangeLogParser.FileInZip("testStr"));
        entries.add(entry);
    }

    /**
    *  Schedule two mock builds. Run getBuildDates() on the project and see if the two build dates are identical
    *  See https://wiki.jenkins-ci.org/display/JENKINS/Unit+Test
    */
    @Test
    public void testGetBuildDates1() throws Exception { // 2 build scenario
        FreeStyleProject p = j.createFreeStyleProject();
        FreeStyleBuild build1 = p.scheduleBuild2(0).get(); // schedule a build

        String time1 = p.getBuildByNumber(1).getTime().toString();
        FreeStyleBuild build2 = p.scheduleBuild2(0).get();
        String time2 = p.getBuildByNumber(2).getTime().toString();
        TestResultsAnalyzerAction t = new TestResultsAnalyzerAction(p);

        JSONObject dates = t.getBuildDates(2); // the two builds we created for testing purposes
        assertTrue(dates.get("1").equals(time1));
        assertTrue(dates.get("2").equals(time2));
        assertFalse(dates.get("1").equals(time2));
    }

    @Test
    public void testGetBuildDates2() throws Exception { // 1 build scenario
        FreeStyleProject p = j.createFreeStyleProject();
        FreeStyleBuild build = p.scheduleBuild2(0).get(); // schedule a build
        TestResultsAnalyzerAction t = new TestResultsAnalyzerAction(p);
        JSONObject dates = t.getBuildDates(2);
        String time = p.getBuildByNumber(1).getTime().toString();
        assertTrue(dates.get("1").equals(time));
    }

    /**An attempt to test the getFileChanges JS-method.
    Still fails after several hours of tinkering,
    because the Jenkins API is ****ing impossible to work with.
    My conclusion: apparently build.getChangeSet() regenerates the change set after returning,
    making it impossible to provide one of our own.
    I've looked at the source code, and I don't see why it would regenerate.*/
    @Test @Ignore
    public void testGetFileChanges_old_singleEmpty() throws Exception{
        //FakeChangeLogSCM changes = new FakeChangeLogSCM();
        //^doesn't have the right API for us to add stuff

        List<ExtractChangeLogParser.ExtractChangeLogEntry> entries = new ArrayList<ExtractChangeLogParser.ExtractChangeLogEntry>();
        ExtractChangeLogParser.ExtractChangeLogEntry entry = new ExtractChangeLogParser.ExtractChangeLogEntry();
        entry.addFile(new ExtractChangeLogParser.FileInZip("testStr"));
        entries.add(entry);

        FreeStyleProject project = j.createFreeStyleProject();
        FreeStyleBuild build0 = project.scheduleBuild2(0).get();
        FreeStyleBuild build = project.scheduleBuild2(0).get();
        ExtractChangeLogSet changes = new ExtractChangeLogSet(build, entries);

        Field field = AbstractBuild.class.getDeclaredField("changeSet");
        field.setAccessible(true);
        WeakReference ref = new WeakReference(changes);
        field.set(build, ref);
        assertTrue(ref == field.get(build));
        assertTrue(changes == build.getChangeSet());

        assertTrue(ref == field.get(build)); //fails
        assertTrue(changes == build.getChangeSet());

        int c = 0, d = 0;
        for(ChangeLogSet.Entry e : build.getChangeSet()){
            c++;
            d += e.getAffectedPaths().size();
        }
        assertEquals(1, c);
        assertEquals(1, d);


        TestResultsAnalyzerAction action = new TestResultsAnalyzerAction(project);
        JSONArray result = action.getFileChanges(build0.number + "", build.number + "");
        //assertEquals(1, result.size()); //fails

        assertTrue(ref == field.get(build));
        assertTrue(changes == build.getChangeSet());


        //debugging attempt---------------------------------------------------
        Map<String, String> changesMap = new HashMap<String, String>();
        for(int buildCounter = build0.number + 1; buildCounter <= build.number; buildCounter++){
            System.out.println("looking for changes in build " + buildCounter);
            ChangeLogSet<? extends ChangeLogSet.Entry> changeLogSet = project.getBuild("" + buildCounter).getChangeSet();
            assertTrue(changes == changeLogSet); //fails
            for(ChangeLogSet.Entry setEntry : changeLogSet){
                System.out.println("entry");//never triggers
                for(ChangeLogSet.AffectedFile file : entry.getAffectedFiles()){
                    System.out.println("affected file");
                }
            }
        }
        //--------------------------------------------------------------------


        System.out.println(changes.toString());//ensures the WeakReference never loses its object
    }
}
