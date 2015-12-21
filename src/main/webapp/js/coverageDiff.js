define(function(){
	return {
		/**
		 * Calculate the test coverage difference between two builds using their test coverage data
		 * @param cov1 the coverage data for the first build
		 * @param cov2 the coverage data for the second build
		 */
		covDiff: function(cov1, cov2){
			var cov1 = parseFloat(cov1);
			var cov2 = parseFloat(cov2);

			var cov_diff = Math.abs((cov2 - cov1) * 100);
			var cov_change = "";
			if(cov1 < cov2){
				cov_change = '<span style="color:red;">has increased by</span> ' + cov_diff.toFixed(2) + "%";
			} else if(cov1 > cov2){
				cov_change = '<span style="color:Magenta;">has decreased by</span> ' + cov_diff.toFixed(2) + "%";
			} else {
				cov_change = '<span style="color:blue;">does not change</span>';
			}
			return cov_change;
		},

		/**
		 * Convert the float number to percentage
		 */
		floatToPercentage: function(cov){
			var cov = parseFloat(cov) * 100;
			return cov.toFixed(2) + "%";
		},

		/**
		 * Display the test coverage data for two builds and their coverage difference results on home page
		 */
		displayChange: function(line_cov1, branch_cov1, class_cov1, line_cov2, branch_cov2, class_cov2, line_change, branch_change, class_change, build1, build2){
			var cov_build1 = "<p style='font-family:Patua One;font-size:15px;'><b>Build " + build1 +
							"</b>: Line coverage is " + line_cov1 +
							", branch coverage is " + branch_cov1 +
							", class coverage is " + class_cov1 + "</p>";
			var cov_build2 = "<p style='font-family:Patua One;font-size:15px;'><b>Build " + build2 +
							"</b>: Line coverage is " + line_cov2 +
							", branch coverage is " + branch_cov2 +
							", class coverage is " + class_cov2 + "</p>";
			var cov_diff = "<p style='font-family:Patua One;font-size:15px;'>From <b>Build " + build1 +
						"</b> to <b>Build " + build2 +
						"</b>: Line coverage " + line_change + ", branch coverage " + branch_change +
						", class coverage " + class_change + "</p>";
			$j("#coverageContent").append(cov_build1);
			$j("#coverageContent").append(cov_build2);
			$j("#coverageContent").append(cov_diff);
		}
	};
});