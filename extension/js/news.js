/**
 * THIS SCRIPT HANDLES THE NEWS PART OF THE EXTENSION
 */
var loading = "<img src='../img/loading.gif' id='loading' />";

$(document).ready(function()
{
    //ATTACH FUNCTION getNews() TO BUTTON CLICK
    var newsLink = document.getElementById('newsLink');
    newsLink.onclick = getNews();
})

/**
 * GETS THE NEWS FROM HLTV
 * CREATES ELEMENTS TO DISPLAY THEM IN THE EXTENSION
 */
function getNews()
{
    //ACTIVATE LOADING GIF
    var tblNews = document.getElementById('tblNews');
    $(tblNews).html(loading);

    //GET NEWS FROM HLTV
    $jqhxr = $.get('http://www.hltv.org/news.rss.php');

    //HANDLE JSON REQUEST WHEN DONE
    $jqhxr.success(function(data) {
        //READ JSON DATA AND PUT IT INTO AN ARRAY TO WORK WITH
        $xml = $(data);
        var itemArray = [];
        $xml.find("item").each(function () {
            var $this = $(this),
                item = {
                    title: $this.find("title").text(),
                    link: $this.find("link").text(),
                    pubDate: $this.find("pubDate").text(),
                }
            itemArray.push(item);
        });

        //SORT ARRAY BY TIME
        itemArray = sortArrayByTime(itemArray);

        //LOOP THROUGH ARRAY AND CREATE A TABLEROW FOR EACH POST
        var tb = document.createElement('tbody');
        for(var i = 0;i<itemArray.length;i++)
        {
            //CREATE FIRST TD CONTAINING TITLE AND LINK
            var a = document.createElement('a');
            $(a).attr('href', itemArray[i].link)
                .attr('target', "_blank")
                .addClass('newsLink')
                .text(itemArray[i].title);
            var td = document.createElement('td');
            $(td).append(a);
            var tr = document.createElement('tr');
            $(tr).append(td);

            //CREATE SECOND TD CONTAINING TIME DIFFERENCE
            td = document.createElement('td');
            $(td).text(getTimeDiff(itemArray[i].pubDate));
            $(tr).append(td);

            //MAKE TABLEROW CLICKABLE
            $(tr).click(function()
            {
                var nodeName = event.target.nodeName;
                if(!(nodeName == "A" || nodeName == "IMG")) {
                    var newURL = $(this).find("a").attr("href");
                    chrome.tabs.create({ url: newURL });
                }
            });

            //APPEND
            $(tb).append(tr);
        }

        $(tblNews).html(tb);
    });

    //HANDLE JSON REQUEST WHEN FAIL
    $jqhxr.fail(function(data)
    {
        console.log("Something went wrong while getting the news from HLTV. Try again later. If this keeps failing contact a dev with this message:");
        console.log(data);
    });
}

function sortArrayByTime(itemArray) {
    var swapped;
    var time1;
    var time2;
    do {
        swapped = false;
        for (var i=0; i<itemArray.length-1;i++) {
            time1 = new Date(itemArray[i].pubDate);
            time2 = new Date(itemArray[i+1].pubDate);
            if(time1 < time2) {
                var temp = itemArray[i];
                itemArray[i] = itemArray[i+1];
                itemArray[i+1] = temp;
                swapped = true;
            }
        }
    } while (swapped);

    return itemArray;
}

function getTimeDiff(strDate) {
    var str = "";
    var dateNow = new Date();
    var dateBegin = new Date(strDate);
    var timeDiff = dateBegin.getTime() - dateNow.getTime();
    var seconds = Math.floor(timeDiff / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    hours %= 24;
    minutes %= 60;
    seconds %= 60;

    if(days<1) {
        if(hours<1) {
            str = minutes + "m ago";
        } else {
            str = hours + "h ago";
        }
    } else {
        str = days + "d ago";
    }

    return str;
}