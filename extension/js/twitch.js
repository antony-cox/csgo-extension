/**
 * THIS SCRIPT HANDLES THE STREAM BROWSER PART OF THE EXTENSION
 **/
var loading = "<img src='../img/loading.gif' id='loading' />";

$(document).ready(function()
{
    //ATTACH FUNCTION getStreams() TO BUTTON CLICK
    var streamsLink = document.getElementById('streamsLink');
    streamsLink.onclick = getStreams();
})

/**
 * GETS A LIST OF STREAMS FROM TWITCH
 * CREATES ELEMENTS TO DISPLAY THEM IN THE EXTENSION
 */
function getStreams()
{
    //ACTIVATE LOADING GIF
    var tblStreams = document.getElementById('tblStreams');
    tblStreams.innerHTML = loading;

    //GET LIST OF STREAMS FROM TWITCH
    $jqhxr = $.getJSON('https://api.twitch.tv/kraken/streams?game=Counter-Strike:+Global+Offensive');

    //HANDLE JSON REQUEST WHEN DONE
    $jqhxr.done(function(data) {
        //READ JSON DATA AND PUT IT INTO AN ARRAY TO WORK WITH
        var $json = $(data);
        var itemArray = [];
        for (var i = 0; i < $json[0].streams.length; i++) {
            item = {
                preview: $json[0].streams[i].preview.medium,
                viewers: $json[0].streams[i].viewers,
                channel: $json[0].streams[i].channel,
            }
            itemArray.push(item);
        }

        //LOOP THROUGH ARRAY AND CREATE A TABLEROW FOR EACH STREAM
        var tb = document.createElement('tbody');
        for(var  i = 0;i<itemArray.length;i++)
        {
            //PREPARE STREAMER LOGO
            var logo;
            if(itemArray[i].channel.logo == null) {
                logo = "../img/twitchDefault.png";
            } else {
                logo = itemArray[i].channel.logo;
            }

            //PREPARE LINK FROM USER OPTIONS
            var link;
            if(localStorage["twitch"] == "popout") {
                link = itemArray[i].channel.url+"/popout";
            } else {
                link = itemArray[i].channel.url;
            }

            //PREPARE STREAM DESCRIPTION
            var description = "";
            if(itemArray[i].channel.status!=null) {
                if (itemArray[i].channel.status.length>60) {
                    description = itemArray[i].channel.status.substring(0,56) + " ...";
                } else {
                    description = itemArray[i].channel.status;
                }
            }

            //CREATE ELEMENTS
            //CREATE FIRST TD
            //CONTAINING IMAGE & LINK
            var img = document.createElement('img');
            $(img).attr('src', logo)
                .attr('width', '70px')
                .attr('height', '70px');
            var a = document.createElement('a');
            $(a).attr('href', link)
                .attr('target', '_blank')
                .append(img);
            var td = document.createElement('td');
            $(td).append(a);
            var tr = document.createElement('tr');
            $(tr).append(td);

            //CREATE SECOND TD
            //CONTAINING TITLE, VIEWERCOUNT AND DESCRIPTION
            //NAME DIV
            a = document.createElement('a');
            $(a).attr('href', link)
                .addClass('streamsLink')
                .attr('target', '_blank')
                .text(itemArray[i].channel.display_name);
            var spanName = document.createElement('span');
            $(spanName).addClass('streamName')
                .append(a);
            var spanViewers = document.createElement('span');
            $(spanViewers).addClass('viewerCount')
                .text(itemArray[i].viewers + " Viewers");
            var divTitle = document.createElement('div');
            $(divTitle).addClass('streamTitle')
                .append(spanName)
                .append(spanViewers);

            //DESCRIPTION DIV
            var divDesc = document.createElement('div')
            $(divDesc).addClass('streamDesc')
                .text(description)

            //APPEND
            td = document.createElement('td');
            $(td).append(divTitle)
                .append(divDesc);
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
            .attr('href', 'http://www.twitch.tv/directory/game/Counter-Strike:%20Global%20Offensive')
            .text('View all');
        td = document.createElement('td');
        $(td).attr('colspan', '2')
            .append(a);
        tr = document.createElement('tr');
        $(tr).append(td);

        //APPEND TO TABLEBODY
        $(tb).append(tr);

        //APPEND TABLEBODY TO TABLE
        $(tblStreams).html(tb);
    });

    //HANDLE JSON REQUEST WHEN FAIL
    $jqhxr.fail(function(data)
    {
        console.log("Something went wrong while getting a list from twitch.tv. Try again later. If this keeps failing contact a dev with this message:");
        console.log(data);
    });
}