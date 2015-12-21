define(["src/main/webapp/js/buildDuration.js"], function(buildDuration){
	describe("Testing build duration", function(){
		it("should display ms", function(){
			expect(buildDuration.durationString(0)).toEqual("0 ms");
			expect(buildDuration.durationString(5)).toEqual("5 ms");
			expect(buildDuration.durationString(500)).toEqual("500 ms");
			expect(buildDuration.durationString(376)).toEqual("376 ms");
			expect(buildDuration.durationString(803)).toEqual("803 ms");
			expect(buildDuration.durationString(999)).toEqual("999 ms");
		});
		it("should display min", function(){
			expect(buildDuration.durationString(60*1000)).toEqual("1 min");
			expect(buildDuration.durationString(2*60*1000)).toEqual("2 min");
			expect(buildDuration.durationString(2.5*60*1000)).toEqual("2.5 min");
			expect(buildDuration.durationString(59.3*60*1000)).toEqual("59.3 min");
			expect(buildDuration.durationString(59.3252*60*1000)).toEqual("59.3 min");
		});
		it("should display hr", function(){
			expect(buildDuration.durationString(60*60*1000)).toEqual("1 hr");
			expect(buildDuration.durationString(2*60*60*1000)).toEqual("2 hr");
			expect(buildDuration.durationString(2.5*60*60*1000)).toEqual("2.5 hr");
			expect(buildDuration.durationString(100.7*60*60*1000)).toEqual("100.7 hr");
		});
	});
});