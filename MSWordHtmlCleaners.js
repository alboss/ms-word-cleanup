var cleaningArea = document.getElementById('cleaning').value;
var CleanWordHTML = function ( str )
{
str = str.replace(/<o:p>\s*<\/o:p>/g, "<p>\s*<\/p>") ;
str = str.replace(/<o:p>.*?<\/o:p>/g, "<p>\s*<\/p>") ;
str = str.replace( /\s*mso-[^:]+:[^;"]+;?/gi, "" ) ;
str = str.replace( /\s*MARGIN: 0cm 0cm 0pt\s*;/gi, "" ) ;
str = str.replace( /\s*MARGIN: 0cm 0cm 0pt\s*"/gi, "\"" ) ;
str = str.replace( /\s*TEXT-INDENT: 0cm\s*;/gi, "" ) ;
str = str.replace( /\s*TEXT-INDENT: 0cm\s*"/gi, "\"" ) ;
str = str.replace( /\s*TEXT-ALIGN: [^\s;]+;?"/gi, "\"" ) ;
str = str.replace( /\s*PAGE-BREAK-BEFORE: [^\s;]+;?"/gi, "\"" ) ;
str = str.replace( /\s*FONT-VARIANT: [^\s;]+;?"/gi, "\"" ) ;
str = str.replace( /\s*tab-stops:[^;"]*;?/gi, "" ) ;
str = str.replace( /\s*tab-stops:[^"]*/gi, "" ) ;
str = str.replace( /\s*face="[^"]*"/gi, "" ) ;
str = str.replace( /\s*face=[^ >]*/gi, "" ) ;
str = str.replace( /\s*FONT-FAMILY:[^;"]*;?/gi, "" ) ;
str = str.replace(/<(\w[^>]*) class=([^ |>]*)([^>]*)/gi, "<$1$3") ;
str = str.replace( /<(\w[^>]*) style="([^\"]*)"([^>]*)/gi, "<$1$3" ) ;
str = str.replace( /\s*style="\s*"/gi, '' ) ; 
str = str.replace( /<SPAN\s*[^>]*>\s*&nbsp;\s*<\/SPAN>/gi, '&nbsp;' ) ; 
str = str.replace( /<SPAN\s*[^>]*><\/SPAN>/gi, '' ) ; 
str = str.replace(/<(\w[^>]*) lang=([^ |>]*)([^>]*)/gi, "<$1$3") ; 
str = str.replace( /<SPAN\s*>(.*?)<\/SPAN>/gi, '$1' ) ; 
str = str.replace( /<FONT\s*>(.*?)<\/FONT>/gi, '$1' ) ;
str = str.replace(/<\\?\?xml[^>]*>/gi, "") ; 
str = str.replace(/<\/?\w+:[^>]*>/gi, "") ; 
//str = str.replace( /<H\d>\s*<\/H\d>/gi, '' ) ;
str = str.replace( /<H1([^>]*)>/gi, '<h1>' ) ;
str = str.replace( /<H2([^>]*)>/gi, '<h2>' ) ;
str = str.replace( /<H3([^>]*)>/gi, '<h3>' ) ;
str = str.replace( /<H4([^>]*)>/gi, '<h4>' ) ;
str = str.replace( /<H5([^>]*)>/gi, '<h5>' ) ;
str = str.replace( /<H6([^>]*)>/gi, '<h6>' ) ;
str = str.replace( /<\/H1>/gi, '<h1>' ) ;
str = str.replace( /<\/H2>/gi, '<h2>' ) ;
str = str.replace( /<\/H3>/gi, '<h3>' ) ;
str = str.replace( /<\/H4>/gi, '<h4>' ) ;
str = str.replace( /<\/H5>/gi, '<h5>' ) ;
str = str.replace( /<\/H6>/gi, '<h6>' ) ;
    //str = str.replace( /<\/H\d>/gi, '<br>' ) ; //remove this to take out breaks where Heading tags were 
str = str.replace( /<(U|I|STRIKE)>&nbsp;<\/\1>/g, '&nbsp;' ) ;
str = str.replace( /<(B|b)>&nbsp;<\/\b|B>/g, '' ) ;
str = str.replace( /<([^\s>]+)[^>]*>\s*<\/\1>/g, '' ) ;
str = str.replace( /<([^\s>]+)[^>]*>\s*<\/\1>/g, '' ) ;
str = str.replace( /<([^\s>]+)[^>]*>\s*<\/\1>/g, '' ) ;
//some RegEx code for the picky browsers
var re = new RegExp("(<P)([^>]*>.*?)(<\/P>)","gi") ;
str = str.replace( re, "<div$2</div>" ) ;
var re2 = new RegExp("(<font|<FONT)([^*>]*>.*?)(<\/FONT>|<\/font>)","gi") ; 
str = str.replace( re2, "<div$2</div>") ;
str = str.replace( /size|SIZE = ([\d]{1})/g, '' ) ;
    console.log(str);
return str ;
cleaningArea = str;
}

function cleanHTML(input) {
    // 1. remove line breaks / Mso classes
    var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")? ^p)/g;
    var output = input.replace(stringStripper, ' ');

    // 2. strip Word generated HTML comments
    var commentSripper = new RegExp('<!--(.*?)-->','g');
    var output = output.replace(commentSripper, '');

    // 3. remove tags leave content if any
    var tagStripper = new RegExp('<(/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>','gi');
    output = output.replace(tagStripper, '');

    // 4. Remove everything in between and including tags '<style(.)style(.)>'
    var badTags = ['style', 'script','applet','embed','noframes','noscript'];

    for (var i=0; i< badTags.length; i++) {
        tagStripper = new RegExp('<'+badTags[i]+'.*?'+badTags[i]+'(.*?)>', 'gi');
        output = output.replace(tagStripper, '');
    }

    // 5. remove attributes ' style="..."'
    var badAttributes = ['style', 'start'];
    for (var i=0; i< badAttributes.length; i++) {
        var attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"','gi');
        output = output.replace(attributeStripper, '');
    }
    console.log(output);
    cleaningArea = output;
    return output;
}

var cleanPaste = function(html) {
    // Run the standard YUI cleanHTML method
    // not useful since we don't use the YUI editor
    html = this.Editor.cleanHTML(html);

    // Remove additional MS Word content
    html = html.replace(/<(\/)*(\\?xml:|meta|link|span|font|del|ins|st1:|[ovwxp]:)((.|\s)*?)>/gi, ''); // Unwanted tags
    html = html.replace(/(class|style|type|start)=("(.*?)"|(\w*))/gi, ''); // Unwanted sttributes
    html = html.replace(/<style(.*?)style>/gi, '');   // Style tags
    html = html.replace(/<script(.*?)script>/gi, ''); // Script tags
    html = html.replace(/<!--(.*?)-->/gi, '');        // HTML comments
    
    return html;
    cleaningArea = html;
}

// tip  #1, curl-based : curl -d html=<Dirty HTML> http://wordoff.org/api/clean
// tip  #2, php-based: http://php.net/manual/fr/book.tidy.php
