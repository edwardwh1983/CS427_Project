 package org.jenkinsci.plugins.testresultsanalyzer;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import hudson.Extension;
import hudson.model.AbstractProject;
import hudson.model.AbstractBuild;
import hudson.model.Action;
import hudson.model.TransientBuildActionFactory;

@Extension
public class TestResultsAnalyzerBuildExtension extends TransientBuildActionFactory{


	@Override
	public Collection<? extends Action> createFor(@SuppressWarnings("rawtypes") AbstractBuild target) {

		final List<TestResultsAnalyzerAction> buildActions = target.getProject()
                .getActions(TestResultsAnalyzerAction.class);

        final ArrayList<Action> actions = new ArrayList<Action>();
        if (buildActions.isEmpty()) {
            final TestResultsAnalyzerAction newAction = new TestResultsAnalyzerAction(target.getProject());
            actions.add(newAction);

            return actions;
        } else {
            return buildActions;
        }

	}

}
