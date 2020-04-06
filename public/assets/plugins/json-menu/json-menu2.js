$(function () {
	
	loadMenu();
});

function loadMenu() {
	var data = null;
	let menuStr = "";
	data = getMenu();
	
	
	var builddata = function () {
            var source = [];
            var items = [];

            for (i = 0; i < data.length; i++) {
                var item = data[i];

                var label = item["name"];
                var parentid = item["parent_id"];
                var id = item["id"];
                var url = item["url"];
                var css_class = item["css_class"];

                if (items[parentid]) {
                    var item = {
                        parentid: parentid,
                        label: label,
                        url: url,
                        css_class: css_class,
                        item: item
                    };
                    if (!items[parentid].items) {
                        items[parentid].items = [];
                    }
                    items[parentid].items[items[parentid].items.length] = item;
                    items[id] = item;
                } else {
                    items[id] = {
                        parentid: parentid,
                        label: label,
                        url: url,
                        css_class: css_class,
                        item: item
                    };
                    source[id] = items[id];
                }
            }
            return source;
        }

        var buildSubUL = function (parent, items) {
            $.each(items, function () {
                if (this.label) {
                    // var li = $("<li>" + "<a class='fa fa-area-chart' href='" + this.url + "'>" + this.label + "</a></li>");
                    var li = $("<li><a href='" + this.url + "' " + getTargetWindown(this) + " class=\"nav-link\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa fa-circle-o'></i> " + this.label + "</a></li>");
                    li.appendTo(parent);
                }
            });
        }

        var buildUL = function (parent, items) {
            $.each(items, function () {
                if (this.label) {

                    str = '<li  class="nav-item"> ' +
                        '<a href="' + this.url + '" ' + getTargetWindown(this) +' class="nav-link"> ' +
                        '   <i class="' + this.css_class + '"></i> <span>' + this.label + '</span>' +
                        '</a>' +
                        '</li>';
                    var li = $(str);

                    if (this.items && this.items.length > 0) {
                        str = '<li class="nav-item has-treeview">' +
                            
							
							
							'<a href="#" class="nav-link">'+
							  '<i class="nav-icon ' + this.css_class + '"></i>'+
							  '<p>' + this.label + 
								'<i class="right fa fa-angle-left"></i>'+
							  '</p>'+
							'</a>'+
			
			
                            '</li>';
                        li = $(str);
                    }

                    li.appendTo(parent);
                    
                    if (this.items && this.items.length > 0) {
                        var ul = $("<ul class='nav nav-treeview'></ul>");
                        ul.appendTo(li);
                        buildSubUL(ul, this.items);
                    }
                }
            });
        }

        var source = builddata();
        var ul = $("#sidebar-menu");
        buildUL(ul, source);
        getActiveItem();
		
		setCookie("menu", menuStr, 1);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires;
	//document.cookie = cname + "=" + cvalue +  ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getActiveItem(){
    Array.from($(".sidebar-menu").find('a')).forEach(a => {
        if($(a).attr('href') == location.pathname){
            if($(a).parent('li').parent('ul').hasClass('sidebar-menu')){
                $(a).css({
                    'color': "white",
                })
                $(a).parent('li').css({
                    'background-color': '#1E282C',
                    'border-left':'3px solid #3C8DBC'
                })
            }else{
                $(a).css({
                    'color': "white",
                })
                
                $(a).parent('li').parents('ul').css({
                    'display':'block'
                })

                $(a).parent('li').parents('li').css({
                    'background-color': '#1E282C',
                    'border-left':'3px solid #3C8DBC',
                })
                $(a).parent('li').parents('li').children('a').first().css({
                    'color':'white'
                })
            }
        }
    })
}

function getTargetWindown(obj) {
	try {
		if((obj.item.new_windows != undefined) && (obj.item.new_windows != null)) {
			return "target=\"" +  obj.item.new_windows + "\"";
		} else {
			return "";
		}
	}catch(ex) {
		return "";
	}
}


function getMenu() {
	return [{
							"id" : "10",
							"level" : "system-menu",
							"name" : "Danh sách Bot",
							"url" : "/root_bot_list_new",
							"parent_id" : "-1",
							"css_class" : "fa fa-area-chart",
							"authenticate" : true,
							"plugin" : "system"		
						},
						{
							"id": "250",
							"level": "system-menu",
							"name": "Danh sách user",
							"url": "/root_user_list_new",
							"parent_id": "-1",
							"css_class": "fa fa-book",
							"authenticate": true,
							"plugin": "system",
							"new_windows": "_tutorial"
						}];
}