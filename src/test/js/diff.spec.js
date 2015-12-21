define([
        "src/main/webapp/js/diff.js",
    ], function(diff){
        
        describe("diff.createDomFileChanges tests", function(){
            it("empty", function(){
                var div = document.createElement("div");
                div.innerHTML = diff.createDomFileChanges([]);
                var ps = div.getElementsByTagName("p");
                expect(ps.length).toBe(1);
                expect(ps.length).toBe(div.childNodes.length);//ensure no children besides <p>
                var p = ps[0];
                expect(p.innerHTML).toMatch(/No[\s\S]*change/);
            });
            
            it("basic", function(){
                var basic = [
                    {name: "add", status: "A"},
                    {name: "change", status: "M"},
                    {name: "del", status: "D"}
                ];
                var div = document.createElement("div");
                div.innerHTML = diff.createDomFileChanges(basic);
                var lis = div.getElementsByTagName("li");
                expect(lis.length).toBe(3);
                expect(lis.length).toBe(div.childNodes.length);
                expect(lis[0].innerHTML).toMatch(/alphaAdded[\s\S]*[+][\s\S]*add/);
                expect(lis[1].innerHTML).toMatch(/alphaModified[\s\S]*[M][\s\S]*change/);
                expect(lis[2].innerHTML).toMatch(/alphaDeleted[\s\S]*[-][\s\S]*del/);
            });
            
            
            /*The JS code should be simple, with only display logic.
            It shouldn't notice this conflict.*/
            it("conflict-similar", function(){
                var arr = [
                    {name: "same", status: "M"},
                    {name: "whatever", status: "D"},
                    {name: "same", status: "A"}
                ];
                var div = document.createElement("div");
                div.innerHTML = diff.createDomFileChanges(arr);
                var lis = div.getElementsByTagName("li");
                expect(lis.length).toBe(3);
                expect(lis.length).toBe(div.childNodes.length);
                expect(lis[0].innerHTML).toMatch(/alphaModified[\s\S]*[M][\s\S]*same/);
                expect(lis[1].innerHTML).toMatch( /alphaDeleted[\s\S]*[-][\s\S]*whatever/);
                expect(lis[2].innerHTML).toMatch(   /alphaAdded[\s\S]*[+][\s\S]*same/);
            });
            
            
            /*The JS code should be simple, with only display logic.
            It shouldn't notice this conflict.*/
            it("conflict-identical", function(){
                var arr = [
                    {name: "same", status: "A"},
                    {name: "middle", status: "M"},
                    {name: "same", status: "A"}
                ];
                var div = document.createElement("div");
                div.innerHTML = diff.createDomFileChanges(arr);
                var lis = div.getElementsByTagName("li");
                expect(lis.length).toBe(3);
                expect(lis.length).toBe(div.childNodes.length);
                expect(lis[0].innerHTML).toMatch(   /alphaAdded[\s\S]*[+][\s\S]*same/);
                expect(lis[1].innerHTML).toMatch(/alphaModified[\s\S]*[M][\s\S]*middle/);
                expect(lis[2].innerHTML).toMatch(   /alphaAdded[\s\S]*[+][\s\S]*same/);
            });
        });
});
