package org.jenkinsci.plugins.testresultsanalyzer;

import java.util.*;

import hudson.util.ListBoxModel;
import hudson.scm.EditType;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.jenkinsci.plugins.testresultsanalyzer.result.info.ResultInfo;
import org.kohsuke.stapler.bind.JavaScriptMethod;

import jenkins.model.Jenkins;
import hudson.model.Action;
import hudson.model.Item;
import hudson.model.AbstractProject;
import hudson.model.AbstractBuild;
import hudson.model.Actionable;
import hudson.model.Run;
import hudson.scm.ChangeLogSet;
import hudson.security.Permission;
import hudson.tasks.junit.PackageResult;
import hudson.tasks.junit.TestResult;
import hudson.tasks.test.AbstractTestResultAction;
import hudson.util.RunList;
import hudson.scm.SCM;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import org.w3c.dom.Element;
import java.io.*;

public class TestResultsAnalyzerAction extends Actionable implements Action{
    @SuppressWarnings("rawtypes") public AbstractProject project;

    private List<Integer> builds = new ArrayList<Integer>() ;

    ResultInfo resultInfo;

    public TestResultsAnalyzerAction(@SuppressWarnings("rawtypes") AbstractProject project){
        this.project = project;
    }

    /**
     * The display name for the action.
     *
     * @return the name as String
     */
    public final String getDisplayName() {
        return this.hasPermission() ? Constants.NAME  : null;
    }

    /**
     * The icon for this action.
     *
     * @return the icon file as String
     */
    public final String getIconFileName() {
        return this.hasPermission() ? Constants.ICONFILENAME : null;
    }

    /**
     * The url for this action.
     *
     * @return the url as String
     */
    public String getUrlName() {
        return this.hasPermission() ? Constants.URL : null;
    }

    /**
     * Search url for this action.
     *
     * @return the url as String
     */
    public String getSearchUrl() {
        return this.hasPermission() ? Constants.URL : null;
    }

    /**
     * Checks if the user has CONFIGURE permission.
     *
     * @return true - user has permission, false - no permission.
     */
    private boolean hasPermission() {
        return project.hasPermission(Item.READ);
    }

    @SuppressWarnings("rawtypes")
    public AbstractProject getProject(){
        return this.project;
    }

	/**
       * Story 11
    */
    @JavaScriptMethod
    public Long getBuildDuration(String build){
        return this.project.getBuildByNumber(Integer.parseInt(build)).getDuration();
    }
    /**
     * Getting information out of SVN
     */
    private String getUrlOfBuildFile(String build, String fileName){
        return SCMCommandsUtil.getFileURL(fileName, this.project.getBuildByNumber(Integer.parseInt(build)).getWorkspace() + "/../builds/" + Integer.parseInt(build) + "/revision.txt");
    }
    private boolean isSVN(){
        return "hudson.scm.SubversionSCM".equals(this.project.getScm().getType());
    }

    @JavaScriptMethod
    public String getDiffOfFileOfBuilds( String fileName, String build1, String build2){
        if (isSVN()){
            return SCMCommandsUtil.runCommand("svn diff " + getUrlOfBuildFile(build1, fileName) + " " + getUrlOfBuildFile(build2,fileName));
        }
        return "Unknown SCM";
    }
    @JavaScriptMethod
    public String getFileOfBuild(String fileName, String build){
         if (isSVN()){
            return SCMCommandsUtil.runCommand("svn cat " + getUrlOfBuildFile(build, fileName));
        }
        return "Unknown SCM";

    }

    @JavaScriptMethod
    public JSONArray getNoOfBuilds(String noOfbuildsNeeded) {
        JSONArray jsonArray;
        int noOfBuilds = getNoOfBuildRequired(noOfbuildsNeeded);

        jsonArray = getBuildsArray(getBuildList(noOfBuilds));

        return jsonArray;
    }

    @JavaScriptMethod
    public String getBuildsLink(String build1, String build2){
        return ("build?build1=" + build1 + "&build2=" + build2);
    }

    @JavaScriptMethod
    public JSONObject getBuildDates(int numBuilds) { 
        JSONObject dates = new JSONObject();
        for (int i = 1; i <= numBuilds; i++) {    
            if (project.getBuildByNumber(i) != null) { // Code will fail if we get a null
                Run build = this.project.getBuildByNumber(i); 
                dates.put(Integer.toString(i), build.getTime().toString()); // getTime() returns when the build was initiated
            }
            else { // No build data available
                dates.put(Integer.toString(i), "Date and time not available");
                continue;
            }
        }
        return dates;
    }

    private JSONArray getBuildsArray(List<Integer> buildList) {
        JSONArray jsonArray = new JSONArray();
        for (Integer build : buildList) {
            jsonArray.add(build);
        }
        return jsonArray;
    }

    private List<Integer> getBuildList(int noOfBuilds) {
        if ((noOfBuilds <= 0) || (noOfBuilds >= builds.size())) {
            return builds;
        }
        List<Integer> buildList = new ArrayList<Integer>();
        for (int i = (noOfBuilds - 1); i >= 0; i--) {
            buildList.add(builds.get(i));
        }
        return buildList;
    }

    private int getNoOfBuildRequired(String noOfbuildsNeeded){
        int noOfBuilds;
        try {
            noOfBuilds = Integer.parseInt(noOfbuildsNeeded);
        } catch (NumberFormatException e) {
            noOfBuilds = -1;
        }
        return noOfBuilds;
    }

    public boolean isUpdated(){
        int latestBuildNumber = project.getLastBuild().getNumber();
        return !(builds.contains(latestBuildNumber));
    }


    @SuppressWarnings({ "rawtypes", "unchecked" })
    public void getJsonLoadData() {
        if (isUpdated()) {
            resultInfo = new ResultInfo();
            builds = new ArrayList<Integer>();
            RunList<Run> runs = project.getBuilds();
            Iterator<Run> runIterator = runs.iterator();
            while (runIterator.hasNext()) {
                Run run = runIterator.next();
                int buildNumber = run.getNumber();
                builds.add(run.getNumber());
                List<AbstractTestResultAction> testActions = run.getActions(hudson.tasks.test.AbstractTestResultAction.class);
                for (hudson.tasks.test.AbstractTestResultAction testAction : testActions) {
                    TestResult testResult = (TestResult) testAction.getResult();
                    Collection<PackageResult> packageResults = testResult.getChildren();
                    for (PackageResult packageResult : packageResults) { // packageresult
                        resultInfo.addPackage(buildNumber, packageResult);
                    }
                }
            }
        }
    }
    @JavaScriptMethod
    public JSONObject getTreeResult(String noOfBuildsNeeded) {
        int noOfBuilds = getNoOfBuildRequired(noOfBuildsNeeded);
        List<Integer> buildList = getBuildList(noOfBuilds);

        JsTreeUtil jsTreeUtils = new JsTreeUtil();
        return jsTreeUtils.getJsTree(buildList, resultInfo);
    }
    /**Spike solution.*/
    @JavaScriptMethod
    public String hello(){return "string from Java";}


    /**Turns an EditType into the string A, M, or D.*/
    private static String editTypeToChar(EditType type) {
        if(type == EditType.ADD)
            return "A";
        if(type == EditType.DELETE)
            return "D";
        if(type == EditType.EDIT)
            return "M";
        throw new RuntimeException();
    }

    /**Returns an array representing all the file changes
    that have occurred between 2 builds.*/
    @JavaScriptMethod
    public JSONArray getFileChanges(String build1Str, String build2Str){
        int build1 = Integer.parseInt(build1Str), build2 = Integer.parseInt(build2Str);
        List<ChangeLogSet<ChangeLogSet.Entry>> sets = new ArrayList();

        for(int build = build1 + 1; build <= build2; build++)
            sets.add(project.getBuild("" + build).getChangeSet());
        return processFileChangeSets(sets);
    }


    /**Processes one or more changesets into a JSON array
    representing all files that have changed in the provided changesets.
    Order is undefined.*/
    public static JSONArray processFileChangeSets(
            Iterable<ChangeLogSet<ChangeLogSet.Entry>> changeLogSets){
        List<String> list = new ArrayList<String>();
        for(ChangeLogSet<ChangeLogSet.Entry> changeLogSet : changeLogSets){
            for(ChangeLogSet.Entry entry : changeLogSet) {
                for(ChangeLogSet.AffectedFile file : entry.getAffectedFiles()) {
                    list.add(file.getPath());
                    list.add(editTypeToChar(file.getEditType()));
                }
            }
        }
        return processFileChangeList(list);
    }

    /**Processes file changes into a JSON array of undefined order.
    The provided list should alternate between file paths and status codes.*/
    public static JSONArray processFileChangeList(List<String> list){
        assert list.size() % 2 == 0;//list length must be even
        Map<String, String> changes = new HashMap<String, String>();
        String prev = "";
        String cur = "";
        String filePath;
        Iterator<String> iter = list.iterator();
        while (iter.hasNext()){
            filePath = iter.next();
            prev = changes.get(filePath);
            cur = iter.next();
            String status;
            //hard to debug, so we just threw all possible state combinations in
            if(prev == null)
                status = cur;
            else if(prev.equals(cur))
                status = cur;
            else if(prev.equals("A")) {
                if(cur.equals("M")) {status = "A";}
                else {status = null;}//cur=D
            }
            else if(prev.equals("M")) {
                status = cur;
            }
            else if(prev.equals("D")) {
                if(cur.equals("A")) {status = null;}
                else {status = "D";}
            }
            else
                throw new RuntimeException(prev);

            if(status == null)
                changes.remove(filePath);
            else
                changes.put(filePath, status);
        }

        JSONArray out = new JSONArray();

        for(Map.Entry<String, String> entry : changes.entrySet()) {
            JSONObject obj = new JSONObject();
            obj.put("name", entry.getKey());
            obj.put("status", entry.getValue());
            out.add(obj);
        }

        return out;
    }


    /**
     * Get the coverage result including line coverage, branch coverage, class coverage
     * and return a JSON object using the build number
     * @param build1 the first build number, build2 the second build number
     * @return the JSON object containging the coverage information
     */
      @JavaScriptMethod
    public JSONObject getCoverage(String build1, String build2){
        JSONObject result = new JSONObject();

        xmlParser(build1, result, 1);
        xmlParser(build2, result, 2);
        return result;
    }

    /**
     * Use java DOM parser to parse the XML data and save the coverage results in a JSON object
     * @param build the build number
     * @param result the JSON object including the line coverage, branch coverage and class coverage
     * @param num either 1 or 2, indicating the order of the two builds we are comparing
     * @return nothing
     */
    public void xmlParser(String build, JSONObject result, int num){
        try{
            // For each build number, get Run for that build
            Run file = project.getBuildByNumber(Integer.parseInt(build));

            // For each Run, using getRootDir() to get the path for that build,
            // will return "/home/<netid>/.jenkins/jobs/<projectName>/builds/<build_number>"
            File fXmlFile = new File(file.getRootDir().getAbsolutePath() + "/coverage.xml");

            //using the Java DOM XML parsing library to get the root of the XML document tree
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(fXmlFile);

            //optional, but recommended
            //read this - http://stackoverflow.com/questions/13786607/normalization-in-dom-parsing-with-java-how-does-it-work
            doc.getDocumentElement().normalize();

            //get the root of the XML DOM
            Element root = doc.getDocumentElement();

            //get these coverage data and pass in these three as arguments to javascript
            String lineRate = root.getAttribute("line-rate");
            String branchRate = root.getAttribute("branch-rate");
            String classRate = getClassRate(doc) + "";

            //save the results in JSON object
            result.put("lineRate" + num, lineRate);
            result.put("branchRate" + num, branchRate);
            result.put("classRate" + num, classRate);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * This method is intended to calculate the class coverage rate
     * by counting the covered class and total class
	 *
	 * @param doc the root of the XML document tree, which provides the primary access to the document's data
	 * @return the calculated class coverage rate
     */
    public double getClassRate(Document doc){
        int totalClass = 0;
        int coveredClass = 0;

        NodeList classList = doc.getElementsByTagName("class");

        //for each class, check whether its line-rate and branch-rate are both positive
        //if True, this class is covered in the test, otherwise not
        for(int i = 0; i < classList.getLength(); i++){
            totalClass++;

            Node class_node = classList.item(i);

            if(class_node.getNodeType() == Node.ELEMENT_NODE){
                Element class_elem = (Element) class_node;

                if(Double.parseDouble(class_elem.getAttribute("line-rate")) > 0.0
                    && Double.parseDouble(class_elem.getAttribute("branch-rate")) > 0.0){
                    coveredClass++;
                }
            }
        }

        return (coveredClass + 0.0) / totalClass;
    }

    @JavaScriptMethod
    public JSONObject getFileContents(String filename, int build1, int build2) {
        return (JSONObject) new JSONObject().put("key", "value");
    }
}
