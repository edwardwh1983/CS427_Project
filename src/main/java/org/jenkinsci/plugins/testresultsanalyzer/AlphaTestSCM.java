package org.jenkinsci.plugins.testresultsanalyzer;

import hudson.FilePath;
import hudson.Launcher;
import hudson.model.*;
import hudson.scm.ChangeLogParser;
import hudson.scm.PollingResult;
import hudson.scm.SCM;
import hudson.scm.SCMRevisionState;

import java.io.File;
import java.io.IOException;
import java.util.*;


/**An attempt to build an SCM that would let us specify changed files manually,
allowing us to test the get-files-changed code with full JenkinsRule tests.
The attempt failed; the API we're looking for
is the best-hidden secret in the history of the universe.
(Approach--trying to create a replacement for the SVN SCM--suggested by Farah in email.)

When Projects/Builds throw checked exceptions,
this class always converts them to RuntimeExceptions.*/
public class AlphaTestSCM extends SCM {
    /**Counter used to generate build IDs. Counts up.*/
    private int idCounter = 1;
    private final FreeStyleProject project;
    
    /**Maps builds to their IDs.*/
    private final Map<Run<?,?>, Integer> buildIds = new HashMap<Run<?,?>, Integer>();
    /**Maps build IDs to revision states.*/
    private final Map<Integer, SCMRevisionState> revisionStates =
            new HashMap<Integer, SCMRevisionState>();
    
    
    /**Sets up a test SCM with a project.
    Will notify the project that this is its new SCM.*/
    public AlphaTestSCM(FreeStyleProject project) {
        this.project = project;
        try{project.setScm(this);}
        catch(Exception ex){throw new RuntimeException(ex);}
    }
    
    
    
    /**Creates a new build in the project originally passed to this object's constructor
    and returns it.*/
    public FreeStyleBuild build() {
        FreeStyleBuild build;
        try{build = project.scheduleBuild2(0).get();}
        catch(Exception ex){throw new RuntimeException(ex);}
        buildIds.put(build, idCounter++);
        return build;
    }
    
    
    /**The name sounds close to what we want to be able to do
    (specify what changes have occurred between 2 revisions/builds),
    but the API is just wrong.
    Only 1 build is specified via param; the second build is implicitly the current/latest.
    This means this is not the code that is used to show differences between 2 arbitrary
    (or even 2 adjacent) builds, and is therefore not what we need.*/
    @Override public PollingResult compareRemoteRevisionWith(Job<?,?> project,
            Launcher launcher, FilePath workspace, TaskListener listener, 
            SCMRevisionState baseline) throws IOException, InterruptedException {
        if(project != this.project)
            throw new IllegalStateException();
        
        throw new UnsupportedOperationException();//TODO
    }
    
    
    @Override public void checkout(Run<?,?> build, Launcher launcher, FilePath workspace,
            TaskListener listener, File changelogFile, SCMRevisionState baseline) 
            throws IOException, InterruptedException {
        throw new UnsupportedOperationException();
    }
    
    
    /**No idea what this does, but apparently we have to implement it.*/
    @Override public SCMRevisionState calcRevisionsFromBuild(Run<?,?> build,
            FilePath workspace, Launcher launcher, TaskListener listener)
            throws IOException, InterruptedException {
        Integer id = buildIds.get(build);
        if(id == null)
            return null;
        return revisionStates.get(id);
    }
    
    
    @Override public ChangeLogParser createChangeLogParser() {
        throw new UnsupportedOperationException();
    }
}
