package org.jenkinsci.plugins.testresultanalyzer;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertArrayEquals;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;

import org.jenkinsci.plugins.testresultsanalyzer.*;
import org.jvnet.hudson.test.ExtractChangeLogParser;
import org.jvnet.hudson.test.ExtractChangeLogSet;
import org.jvnet.hudson.test.JenkinsRule;
import hudson.model.AbstractBuild;
import hudson.model.AbstractProject;
import hudson.model.Project;
import hudson.model.FreeStyleBuild;
import hudson.model.FreeStyleProject;
import hudson.scm.ChangeLogSet;

import java.io.IOException;
import java.lang.ref.WeakReference;
import java.lang.reflect.Field;
import java.util.*;
import java.util.concurrent.ExecutionException;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


/**Tests for the code that finds which files have changed and how (user story 3).*/
public class TestFileDiff {
    @Test
    public void testEmpty(){
        JSONArray result = TestResultsAnalyzerAction.processFileChangeList(new ArrayList<String>());
        assertEquals(0, result.size());
    }
    
    
    @Test
    public void testSimple(){
        List<String> list = Arrays.asList("new.txt", "A", "changed.txt", "M");
        JSONArray result = TestResultsAnalyzerAction.processFileChangeList(list);
        
        assertEquals(2, result.size());
        JSONObject obj = result.getJSONObject(0);
        boolean reversed;//needed because the order of the result is undefined
        if(obj.getString("name").equals("new.txt")) {
            reversed = false;
            assertEquals("A", obj.getString("status"));
        } else {
            reversed = true;
            assertEquals("changed.txt", obj.getString("name"));
            assertEquals("M", obj.getString("status"));
        }
        
        obj = result.getJSONObject(1);
        assertEquals(reversed ? "new.txt" : "changed.txt", obj.getString("name"));
        assertEquals(reversed ? "A" : "M", obj.getString("status"));
    }
    
    
    @Test
    public void testConflict(){
        List<String> list = Arrays.asList("nope", "A", "nope", "D", 
                "killed", "M", "killed", "D");
        JSONArray result = TestResultsAnalyzerAction.processFileChangeList(list);
        
        assertEquals(1, result.size());
        JSONObject obj = result.getJSONObject(0);
        assertEquals("killed", obj.getString("name"));
        assertEquals("D", obj.getString("status"));
    }
    
    
    @Test
    public void testConflict2(){
        List<String> list = Arrays.asList("killed", "M", "nope", "A", "nope", "D",
                "killed", "D");
        JSONArray result = TestResultsAnalyzerAction.processFileChangeList(list);
        
        assertEquals(1, result.size());
        JSONObject obj = result.getJSONObject(0);
        assertEquals("killed", obj.getString("name"));
        assertEquals("D", obj.getString("status"));
    }
}

