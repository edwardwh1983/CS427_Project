define(function(){
    return {
        generateLink: function(build1, build2){
            var build1 = parseInt(build1);
            var build2 = parseInt(build2);

            var url;
            if(build1< build2){
                url = "home?build1=" + build1 + "&build2=" + build2;
            }
            else{
                url = "home?build1=" + build2 + "&build2=" + build1;
            }
            return url;
        },
        getBuilds: function(url){
            var build1 = url.substring(url.indexOf("build1=") + "build1=".length, url.indexOf("&"));
            var build2 = url.substring(url.indexOf("build2=") + "build2=".length);
            
            return {
                build1: build1,
                build2: build2
            };
        },
        populateDropdownMenu: function(startFrom, numberOfBuilds, date, test){
            if (test!=1){ 
                for(var i=startFrom; i<= numberOfBuilds; i++){
                        $j('#build1').append($j('<option></option>').attr('value', i).text('#' + i + ", " + date[i.toString()])); 
                        $j('#build2').append($j('<option></option>').attr('value', i).text('#' + i + ", " + date[i.toString()]));         
                }
            }
            
            return (numberOfBuilds - startFrom + 1);
        }
    };
});
