define(["src/main/webapp/js/code_diff.js"], function(code_diff){
	describe("Test no Diff", function(){
		xit("No difference", function(){
            str1 = "abc"
            str2 = "abc"
            diff = code_diff.doDiff(str1, str2, false);
            opcodes = diff.opcodes;
			expect(opcodes).toEqual([["equal",0,1,0,1]]);
		});
	});

	describe("Some difference", function(){
		xit("should show a difference", function(){
            str1 = "abc\ndef\nghi";
            str2 = "abc\nDEF\nghi";
            diff = code_diff.doDiff(str1, str2, false);
            opcodes = diff.opcodes;
            expect(opcodes).toEqual([["equal",0,1,0,1],['replace',1,2,1,2],['equal',2,3,2,3]]);
        });	
	});
});
