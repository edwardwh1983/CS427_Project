define(["src/main/webapp/js/buildSelect.js"], function(buildSelect){
    describe("Testing Build Links", function(){
        it("should build the link properly", function(){
            expect(buildSelect.generateLink("1", "2")).toEqual("home?build1=1&build2=2");
        });
    });

    describe("Parsing a build link", function(){
        it("should return the proper object", function(){
            var buildObject = buildSelect.getBuilds("home?build1=3&build2=21");
            expect(buildObject.build1).toEqual("3");
            expect(buildObject.build2).toEqual("21");
        });    
    });
    describe("Start dropdown menu from a more recent build", function(){
        it("should return the correct dropdown elements", function(){
            var d = {"1":"12-5-15", "2":"12-6-15", "3":"12-7-15"};
            var builds = buildSelect.populateDropdownMenu(1, 3, d,1); // show from build 1 to 3
            expect(builds).toEqual(3);
        
            var e = {"1":"12-5-15", "2":"12-6-15", "3":"12-7-15", "4":"12-8-15", "5":"12-9-15", "6": "12-10-15"};
            var builds = buildSelect.populateDropdownMenu(2, 6, d,1); // show from build 2 to 6
            expect(builds).toEqual(5);
        });    
    });
});
