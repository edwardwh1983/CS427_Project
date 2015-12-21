define(["src/main/webapp/js/coverageDiff.js"], function(coverageDiff){
	describe("Testing code coverage", function(){
		it("should display the code coverage difference correctly", function(){
			expect(coverageDiff.covDiff("0.75", "0.90")).toEqual('<span style="color:red;">has increased by</span> 15.00%');
			expect(coverageDiff.covDiff("0.92", "0.77")).toEqual('<span style="color:Magenta;">has decreased by</span> 15.00%');
			expect(coverageDiff.covDiff("0.60", "0.60")).toEqual('<span style="color:blue;">does not change</span>');
		});
	});

	describe("Testing floatToPercentage", function(){
		it("should display the float in correct percentage form", function(){
			expect(coverageDiff.floatToPercentage("0.721632423")).toEqual("72.16%");
			expect(coverageDiff.floatToPercentage("0.922845298")).toEqual("92.28%");
		});
	});
});