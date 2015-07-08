var loading = "<img src='../img/loading.gif' id='loading' />";
var eventLinks = [];
load_style();

$(document).ready(function() {
	var defaultTab = localStorage["defaultTab"];
	var homeLink = document.getElementById('homeLink');
	homeLink.onclick = getHome;
	var newsLink = document.getElementById('newsLink');
	newsLink.onclick = getNews;
	var redditLink = document.getElementById('redditLink');
	redditLink.onclick = getReddit(10);
	var streamsLink = document.getElementById('streamsLink');
	streamsLink.onclick = getStreams(10);
	var eventsLink = document.getElementById('eventsLink');
	eventsLink.onclick = getEvents;
	if(!(defaultTab == "" || defaultTab == null)) {
		load_defaultTab(defaultTab);
	}
	$("#accordion").accordion({ collapsible: true, heightStyle: "content" });
});

function saveTab() {
	var content = document.getElementById('content').children;
	for(var i = 0;i<content.length;i++) {
		if(content[i].style.display == "block") {
			localStorage["lastTab"] = content[i].id;
		}	
	}
}

function load_style() {
	var links = document.getElementsByTagName("link");
	var theme = localStorage["theme"]
	for (var i = 0;i<links.length;i++) {
		if(links[i].rel.indexOf("stylesheet") != 1 && links[i].title != "grid") {
			links[i].disabled = true
			if((theme == "") || (theme == null) && links[i].title == "dark") {
				links[i].disabled = false;
			} else if(theme == "dark" && links[i].title == "dark") {
				links[i].disabled = false;
			} else if(theme == "light" && links[i].title == "light") {
				links[i].disabled = false;
			}
		}
	}
}

function load_defaultTab(defaultTab) {
	var divs = document.getElementById("content").children;
	for(var i = 0;i<divs.length;i++) {
		divs[i].style.display = "none";
		if(defaultTab == divs[i].id) {
			divs[i].style.display = "block";
			switch(defaultTab) {
				case "":
					break;
				case null:
					break;
				case "home":
					getHome();
					setActiveIcon("Home");
					break;
				case "news":
					getNews();
					setActiveIcon("News");
					break;
				case "reddit":
					getReddit();
					setActiveIcon("Reddit");
					break;
				case "streams":
					getStreams();
					setActiveIcon("Streams");
					break;
				case "events":
					getEvents();
					setActiveIcon("Events");
					break;
			}
		}
	}
}

function setActiveIcon(title) {
	var links = document.getElementsByClassName("idTabs")[0].children;
	for(var i = 0;i<links.length;i++) {
		links[i].setAttribute("class", "");
		if(links[i].title == title) {
			links[i].setAttribute("class", "selected");
		}
	}
}

function clickTR() {
	$("tr").click(function() {
		var nodeName = event.target.nodeName;
		if(!(nodeName == "A" || nodeName == "IMG")) {
			var newURL = $(this).find("a").attr("href");
			chrome.tabs.create({ url: newURL });
		}
	});
}

function getHome() {
	
}

function getNews() {
	var tblNews = document.getElementById('tblNews');
	tblNews.innerHTML = loading;
	$jqhxr = $.get('http://www.hltv.org/news.rss.php');
	$jqhxr.done(function(data) {
		$xml = $(data);
		var itemArray = [];
		$xml.find("item").each(function() {
			var $this = $(this),
			item = {
				title: $this.find("title").text(),
				link: $this.find("link").text(),
				pubDate: $this.find("pubDate").text(),
			}
		itemArray.push(item);
		});
		
		itemArray = sortArrayByTime(itemArray);
		var html = "<tbody>";
		for(var i = 0;i<itemArray.length;i++) {
			html += "<tr><td width='185px'><a href='"+itemArray[i].link+"' class='newsLink' target='_blank'>"+itemArray[i].title+"</a><td>";
			html += "<td>"+getTimeDiff(itemArray[i].pubDate, "news")+"</td></tr>";
		}
		html += "</tbody>";
		tblNews.innerHTML = html;
		clickTR();
	});
}

function getReddit(limit) {
	var tblReddit = document.getElementById('tblReddit');
	tblReddit.innerHTML = loading;
	$jqhxr = $.getJSON('http://www.reddit.com/r/GlobalOffensive/hot.json');
	$jqhxr.done(function(data) {
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
		
		var html = "<tbody>";
		var title = "";
		var thumb = "";
		for (var i = 0;i<limit;i++) {
			if(itemArray[i].thumb == "self" || itemArray[i].thumb == "default") {
				thumb = "../img/redditDefault.png";
			} else {
				thumb = itemArray[i].thumb;
			}
			
			if(itemArray[i].title.length>60) {
				title = itemArray[i].title.substring(0,56) + " ...";
			} else {
				title = itemArray[i].title
			}
			html += "<tr><td><a href="+itemArray[i].url+" target='_blank'><img src='"+thumb+"'/></a></td>";
			html += "<td><p><a href="+itemArray[i].url+" class='redditLink' target='_blank'>"+title+"</a>";
			html += "<span><a href="+itemArray[i].perma+" class='redditComments' target='_blank'>"+itemArray[i].num_comments+" comments</a> |" 
			html += "<a href='http://www.reddit.com/u/"+itemArray[i].author+"' class='redditAuthor' target='_blank'>"+itemArray[i].author+"</a></span>";
			html += "</p></td></tr>";
		}
		html += "<tr><td colspan='2'><a id='moreStreams' target='_blank' href='http://www.reddit.com/r/GlobalOffensive/'>View more</a></td></tr>";
		html += "</tbody>";
		tblReddit.innerHTML = html;
		clickTR();
	});
}

function getStreams(limit) {
	var tblStreams = document.getElementById('tblStreams');
	tblStreams.innerHTML = loading;
	$jqhxr = $.getJSON('https://api.twitch.tv/kraken/streams?game=Counter-Strike:+Global+Offensive&limit='+limit);
	$jqhxr.done(function(data) {
		var $json = $(data);
		var itemArray = [];
		for (var i = 0; i<$json[0].streams.length;i++) {
			item = {
				preview: $json[0].streams[i].preview.medium,
				viewers: $json[0].streams[i].viewers,
				channel: $json[0].streams[i].channel,
			}
			itemArray.push(item);
		}
		
		
		var html = "<tbody>";
		var status = "";
		var logo = "";
		var link = "";
		for (var i = 0;i<itemArray.length;i++) {
			if(itemArray[i].channel.logo == null) {
				logo = "../img/twitchDefault.png";
			} else {
				logo = itemArray[i].channel.logo;
			}
			if(itemArray[i].channel.status!=null) {
				if (itemArray[i].channel.status.length>60) {
					status = itemArray[i].channel.status.substring(0,56) + " ...";
				} else {
					status = itemArray[i].channel.status;
				}
			} else {
				status = "";
			}
			if(localStorage["twitch"] == "popout") {
				link = itemArray[i].channel.url+"/popout";
			} else {
				link = itemArray[i].channel.url;
			}
			html += "<tr><td><a href="+link+" target='_blank'><img src='"+logo+"' width='70px' height='70px'/></a></td>";
			html += "<td><p><a href="+link+" class='streamsLink' target='_blank'>"+itemArray[i].channel.display_name+"</a><div class='viewerCount'>"+itemArray[i].viewers+" Viewers</div>";
			html += "<span>"+itemArray[i].channel.status+"</span>";
			html += "</td></tr>";
		}
		if(limit=10) {
			html += "<tr><td colspan='2'><a id='moreStreams' target='_blank' href='http://www.twitch.tv/directory/game/Counter-Strike:%20Global%20Offensive'>View all</a></td></tr>";
		}		
		html += "</tbody>";	
		tblStreams.innerHTML = html;
		clickTR();
	});
}

function getEvents() {
	var tblEvents = document.getElementById('tblEvents');
	tblEvents.innerHTML = loading;
	$jqhxr = $.get('http://www.hltv.org/hltv.rss.php?pri=15');
	$jqhxr.done(function(data) {
		var $xml = $(data);
		var itemArray = [];
		$xml.find("item").each(function() {
			var $this = $(this),
            item = {
                title: $this.find("title").text(),
                link: $this.find("link").text(),
                description: $this.find("description").text(),
                pubDate: $this.find("pubDate").text(),
			}
			itemArray.push(item);
		});
		
		var html = "<tbody>";
		if (itemArray.length>0) {
			var timeDiff;
			var timeDiff_html = "";
			for(var i = 0;i<itemArray.length;i++) {
				var teams = itemArray[i].title.split(' vs ');
				timeDiff = getTimeDiff(itemArray[i].pubDate, "events");
				html += "<tr id="+i+"><td><a href="+itemArray[i].link+" target='blank'>"+itemArray[i].description+"</a><span>"+getTimeDiff(itemArray[i].pubDate, "events")+"</span>";
				html += "<div class='teams'><img id='"+i+"country' src=''/> "+teams[0]+" vs <img id='"+i+"country2' src=''/> "+teams[1]+"</td></div></tr>";
				getTeams(itemArray[i].link, i);
				eventLinks[i] = itemArray[i].link;
			}
		} else {
			html += "<td><tr>No matches scheduled at the moment. Check back here later!</tr></td>";
		}
		html += "</tbody>";
		tblEvents.innerHTML = html;
		clickTR();
	});
}

function getTeams(link, i) {
	$jqhxr = $.get(link);
	$jqhxr.done(function(data) {
		var flag1 = document.getElementById(i+"country");
		var flag2 = document.getElementById(i+"country2");
		$html = $(data);
		var $table = $html.find(".hotmatch_teams")
		try {
			var team1 = $table[0].children[0].children[0].src.split('/');
			var team2 = $table[0].children[1].children[0].src.split('/');
			var country1 = "../img/flags/"+team1[team1.length-1];
			var country2 = "../img/flags/"+team2[team2.length-1];
			flag1.src = country1;
			flag2.src = country2;
		} catch (err) {
		}
	});
}

function getTimeDiff(strDate, type) {
	var str = "";
	var dateNow = new Date();
	var dateBegin = new Date(strDate);
	if(type=="news") {
		var timeDiff = dateNow.getTime() - dateBegin.getTime();
	} else {
		var timeDiff = dateBegin.getTime() - dateNow.getTime();
	}
	var seconds = Math.floor(timeDiff / 1000);
	var minutes = Math.floor(seconds / 60);
	var hours = Math.floor(minutes / 60);
	var days = Math.floor(hours / 24);
	hours %= 24;
	minutes %= 60;
	seconds %= 60;
	
	if(type=="news") {
		if(days<1) {
			if(hours<1) {
				str = minutes + "m ago";
			} else {
				str = hours + "h ago";
			}
		} else {
			str = days + "d ago";
		}
	} else {
		if(timeDiff < 1) {
			str = "Live!"
		} else {
			if (days>0) {
				str = "Starts in " + days + " Days " + hours + " Hours " + minutes + " Minutes";
			} else {
				if (hours>0) {
					str = "Starts in " + hours + " Hours " + minutes + " Minutes";
				} else {
					if(minutes<1 && seconds>0) {
						minutes = 1;
					} 
					str = "Starts in " + minutes + " Minutes";
				}				
			}
		}
	}
	
	return str;
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