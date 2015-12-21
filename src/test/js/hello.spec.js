define(["src/main/webapp/js/hello.js"],function(hello){
    describe("Hello world", function() {
     it("says hello", function() {
        expect(hello.hello()).toEqual("Hello world!");
    });
    });
});
