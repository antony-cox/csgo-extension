/**
 * THIS SCRIPT HANDLES THE REDDIT PART OF THE EXTENSION
 */
var loading = "<img src='../img/loading.gif' id='loading' />";

$(document).ready(function()
{
    //ATTACH FUNCTION getReddit() TO BUTTON CLICK
    //LIMIT OF 25 SO ONLY FRONT PAGE POSTS GET SHOWN
    var redditLink = document.getElementById('redditLink');
    redditLink.onclick = getReddit(25);
})

/**
 * GETS THE HOT POSTS FROM REDDIT
 * CREATES ELEMENTS TO DISPLAY THEM IN THE EXTENSION
 */
function getReddit(limit)
{
    //ACTIVATE LOADING GIF
    var tblReddit = document.getElementById('tblReddit');
    $(tblReddit).html(loading);

    //GET POSTS FROM REDDIT
    $jqhxr = $.getJSON('http://www.reddit.com/r/GlobalOffensive/hot.json');

    //HANDLE JSON REQUEST WHEN DONE
    $jqhxr.success(function(data)
    {
        //READ JSON DATA AND PUT IT INTO AN ARRAY TO WORK WITH
        var $json = $(data);
        var itemArray = [];
        for (var i = 0;i<$json[0].data.children.length;i++) {
            item = {
                author: $json[0].data.children[i].data.author,
                title: $json[0].data.children[i].data.title,
                url: $json[0].data.children[i].data.url,
                num_comments: $json[0].data.children[i].data.num_comments,
                thumb: $json[0].data.children[i].data.thumbnail,
                perma: "http://www.reddit.com" + $json[0].data.children[i].data.permalink,
            }
            itemArray.push(item)
        }

        //LOOP THROUGH ARRAY AND CREATE A TABLEROW FOR EACH POST
        //LIMIT POSTS BECAUSE ELSE TOO MANY
        var tb = document.createElement('tbody');
        for(var i = 0;i<limit;i++)
        {
            //PREPARE THUMBNAIL
            var thumb;
            if(itemArray[i].thumb == "self" || itemArray[i].thumb == "default") {
                thumb = "../img/redditDefault.png";
            } else {
                thumb = itemArray[i].thumb;
            }

            //PREPARE TITLE
            var title;
            if(itemArray[i].title.length>60) {
                title = itemArray[i].title.substring(0,56) + " ...";
            } else {
                title = itemArray[i].title
            }

            //CREATE ELEMENTS
            //CREATE FIRST TD CONTAINING THUMBNAIL AND LINK
            var img = document.createElement('img');
            $(img).attr('src', thumb)
                .attr('width', '70px')
                .attr('height', '70px');
            var a = document.createElement('a');
            $(a).attr('href', itemArray[i].url)
                .attr('target', '_blank')
                .append(img);
            var td = document.createElement('td');
            $(td).append(a);
            var tr = document.createElement('tr');
            $(tr).append(td);

            //CREATE SECOND TD CONTAINING TITLE, COMMENTS AND AUTHOR
            //TITLE
            a = document.createElement('a');
            $(a).attr('href', itemArray[i].url)
                .attr('target', '_blank')
                .addClass('redditLink')
                .text(title);
            td = document.createElement('td');
            $(td).append(a);

            //COMMENTS
            a = document.createElement('a');
            $(a).attr('href', itemArray[i].perma)
                .attr('target', '_blank')
                .addClass('redditComments')
                .text(itemArray[i].num_comments+" comments")
            var span = document.createElement('span');
            $(span).append(a)
                .append(" | ");

            //AUTHOR
            a = document.createElement('a');
            $(a).attr('href', 'http://www.reddit.com/u/'+itemArray[i].author)
                .attr('target', 'blank')
                .addClass('redditAuthor')
                .text(itemArray[i].author);
            $(span).append(a);
            $(td).append(span);

            //APPEND
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
            $(tb).append(tr);
        }

        //CREATE 'VIEW MORE STREAMS' BUTTON
        a = document.createElement('a');
        $(a).attr('id', 'moreStreams')
            .attr('target', '_blank')
            .attr('href', 'http://www.reddit.com/r/GlobalOffensive/')
            .text('View all');
        td = document.createElement('td');
        $(td).attr('colspan', '2')
            .append(a);
        tr = document.createElement('tr');
        $(tr).append(td);

        //APPEND TO TABLEBODY
        $(tb).append(tr);

        //APPEND TABLEBODY TO TABLE
        $(tblReddit).html(tb);
    });

    //HANDLE JSON REQUEST WHEN FAIL
    $jqhxr.fail(function(data)
    {
        console.log("Something went wrong while getting the posts from Reddit. Try again later. If this keeps failing contact a dev with this message:");
        console.log(data);
    });
}
