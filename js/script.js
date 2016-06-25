
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $("#street").val();
    var cityStr = $("#city").val();
    var imageStr = "http://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + streetStr + ", " + cityStr;

    $body.append('<img class="bgimg" src="' + imageStr + '">');

    // YOUR CODE GOES HERE!

    var nytApiKey = "810fb276228b4d90b2457c67b29d6eaa";
    var nytStr = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?fq=glocations("' + cityStr + '")&api-key="' + nytApiKey;

    $.getJSON(nytStr,function(data){
        var nytJsonStr = data.response.docs;
        for (i=0; i<nytJsonStr.length;i++){
            var headlineStr = nytJsonStr[i].headline.main;
            var headlineUrl = nytJsonStr[i].web_url;
            var paragraphStr = nytJsonStr[i].lead_paragraph;
            var nytArticleElem = '<li class="article"><a href="' + headlineUrl + '">' + headlineStr + '</a><p>' + paragraphStr +'</p>';
            $nytElem.append(nytArticleElem);
        }
    }).fail(function(){
        $nytHeaderElem[0].innerText = "New York Times Articles could not be loaded";
    });
//
    var wikiStr = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&srprop=snippet&format=json&callback=wikiCallback';
    $.ajax(wikiStr, {
        // url: wikStr,
        dataType : "jsonp",
        success : function(response){
            var titles = response[1];
            var snippet = response[2];
            var url = response [3];
            for (i=0; i<titles.length;i++){
                var wikItem = '<li class="article"><a href="' + url[i] + '">' + titles[i] + '</a><p>' + snippet[i] + '</p>';
                $wikiElem.append(wikItem);
            }
        }
    })

    return false;
};

$('#form-container').submit(loadData);
