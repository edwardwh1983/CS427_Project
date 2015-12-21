package org.jenkinsci.plugins.testresultanalyzer;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertArrayEquals;
import org.junit.Test;
import org.junit.Rule;
import org.junit.Before;
import org.jenkinsci.plugins.testresultsanalyzer.*;
import org.jvnet.hudson.test.JenkinsRule;
import java.io.FileNotFoundException;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

import java.io.PrintWriter;

public class TestSCMCommandsUtil {
	private void writeFile(String fileName, String str) throws FileNotFoundException, IOException{
		PrintWriter writer = new PrintWriter(fileName, "UTF-8");
		writer.println(str);
		writer.close();

	}
    @Test
    public void testReadFile() throws FileNotFoundException, IOException{
		String expected = "Hey hey what is going on?!";
		String fileName = "testingfile.txt";
		writeFile(fileName,expected);
        assertTrue(SCMCommandsUtil.readFile(fileName).equals(expected + "\n"));
    }
    @Test
    public void testGetFileURL() throws FileNotFoundException, IOException{
		String expected = "http://somethingthatlooks/like/a/url/523";
		String fileName = "testingrevision.txt";
		writeFile(fileName,expected);
        assertTrue(SCMCommandsUtil.getFileURL("",fileName).equals("http://somethingthatlooks/like/a/url/@523"));
        assertTrue(SCMCommandsUtil.getFileURL("someFile",fileName).equals("http://somethingthatlooks/like/a/url/someFile@523"));
        assertTrue(SCMCommandsUtil.getFileURL("a/url/someFile",fileName).equals("http://somethingthatlooks/like/a/url/someFile@523"));
        assertTrue(SCMCommandsUtil.getFileURL("/a/url/someFile",fileName).equals("http://somethingthatlooks/like/a/url/someFile@523"));
    }

    @Test
    public void testRunCommand(){
		assertTrue(SCMCommandsUtil.runCommand("echo testThisThing").equals("testThisThing\n"));
    }


}
