// This will parse a delimited string into an array of
    // arrays. The default delimiter is the comma, but this
    // can be overriden in the second argument.



$(document).ready(function(jQuery){


 localstore();
 $("#tmpl").change(localstoresave)
 $("#csv").change(localstoresave)
 $("#tmplemail").change(localstoresave)
 $("#tmplsubject").change(localstoresave)


parser=function(){
var complete, output, delimeter, data,text,output,outputEmail,outputSub,email,sub

    $(".next").removeClass("on");


    delimeter=","
    data=CSVToArray ( $("#csv").val(), delimeter )


    //alert(data[0])

    keys=data[0]
    $("#result").html("")
    for (var i = data.length - 1; i >= 1; i--) {
        var view=keyCombine(data[i],keys)

        textTMPL=$("#tmpl").val()
        textTMPL = textTMPL.replace(/\n\r?/g, '<br />');

        emailTMPL=$("#tmplemail").val()
        subjectTMPL=$("#tmplsubject").val()

        output = Mustache.render(textTMPL, view);
        outputEmail = Mustache.render(emailTMPL, view);
        outputSub = Mustache.render(subjectTMPL, view);
        email=$('<div class="email">').text("To: "+outputEmail)
        sub=$('<div class="subject">').text("Subject: "+outputSub)

        complete=$("<div>")
            .append(output)
            .attr("contenteditable","true")
            .attr("onclick","document.execCommand('selectAll',false,null)")
            .addClass("output")

        completeHolder=$("<div>")
            .append(email)
            .append(sub)
            .append(complete)
            .addClass("holder")
            .append('<a class="maillink" href="mailto:'+outputEmail+'?body='+htmlEscape(output)+'&subject='+outputSub+'">send this email</a>')
            .append("<hr>")
            $("#result").prepend( completeHolder )

    };
    $("#renderCount").html((data.length-1)+" emails created")


}


$("#parse").click(parser);
$("#reset").click(resetLocal);




});

function htmlEscape(str) {
    return str.replace(new RegExp("<br />", 'g'),"%0D%0A")

}

keyCombine=function(data, keys){
    output={}
    for (var i = keys.length - 1; i >= 0; i--) {
        
        if ( keys[i] && data[i] )
        output[ keys[i] ]=data[i]

    }
    return output

}


localstore=function(){
    // if(typeof(Storage)!=="undefined" && !localStorage.emailTMPL)
    //     resetLocal();
    if(typeof(Storage)!=="undefined")
      {
        if (localStorage.tmpl) $("#tmpl").val(localStorage.tmpl)
        if (localStorage.csv) $("#csv").val(localStorage.csv)
        if (localStorage.emailTMPL) $("#tmplemail").val(localStorage.emailTMPL)
        if (localStorage.subjectTMPL) $("#tmplsubject").val(localStorage.subjectTMPL)
      }
  // else
  //    resetLocal();
}

localstoresave=function(){
    if(typeof(Storage)!=="undefined")
      {
        localStorage.tmpl=$("#tmpl").val()
        localStorage.csv=$("#csv").val()
        localStorage.emailTMPL=$("#tmplemail").val()
        localStorage.subjectTMPL=$("#tmplsubject").val()
      }
}


resetLocal=function(){
    $(".next").addClass("on");
    emailTMPL='{{email}}'
    subjectTMPL='Hello {{name}}'
    tmpl="{{name}}, \r\n \r\nYou're a {{job}}!\r\n \r\n Regards, \r\n John"
    csv='"name","job","email"\r\n"George","bassist","dev@sfdevlabs.com"\r\n"Ringo","drummer","contact@sfdevlabs.com"\r\n"Paul","guitarist","press@sfdevlabs.com"'

    if (localStorage)
    localStorage.emailTMPL=emailTMPL,
    localStorage.subjectTMPL=subjectTMPL,
    localStorage.tmpl=tmpl,
    localStorage.csv=csv;

    $("#tmpl").val(tmpl)
    $("#csv").val(csv)
    $("#tmplemail").val(emailTMPL)
    $("#tmplsubject").val(subjectTMPL)

}






    function CSVToArray( strData, strDelimiter ){
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
            );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                (strMatchedDelimiter != strDelimiter)
                ){

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );

            }


            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                var strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                    );

            } else {

                // We found a non-quoted value.
                var strMatchedValue = arrMatches[ 3 ];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        // Return the parsed data.
        return( arrData );
    }



