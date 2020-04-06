$(function () {
	
	loadMenu();
});

function loadMenu() {
	var data = loginFull();
	let menuStr = "";	
	
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
                    var li = $("<li class='nav-item'><a href='" + this.url + "' " + getTargetWindown(this) + " class=\"nav-link\"><i class='"  +  this.css_class +  "'></i> " + this.label + "</a></li>");
                    li.appendTo(parent);
                }
            });
        }

        var buildUL = function (parent, items) {
            $.each(items, function () {
                if (this.label) {
                    let li, str;
                    if (this.items && this.items.length > 0) {
                        str = '<li class="nav-item has-treeview">' +
                            
							
							
							'<a href="#" class="nav-link">'+
							  '<i class="nav-icon ' + this.css_class + '"></i>'+
							  '<p>'  + this.label + 
								'<i class="right fa fa-angle-left"></i>'+
							  '</p>'+
							'</a>'+
			
			
                            '</li>';
                        li = $(str);
                    }else{
                        str = '<li  class="nav-item"> ' +
                        '<a href="' + this.url + '" ' + getTargetWindown(this) +' class="nav-link"> ' +
                        '   <i class="' + this.css_class + '"></i><span>' + this.label + '</span>' +
                        '</a>' +
                        '</li>';
                        li = $(str);
                    }

                    li.appendTo(parent);
                    
                    if (this.items && this.items.length > 0) {
                        let ul = $("<ul class='nav nav-treeview'></ul>");
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

}

// function setCookie(cname, cvalue, exdays) {
//     var d = new Date();
//     d.setTime(d.getTime() + (exdays*24*60*60*1000));
//     var expires = "expires="+ d.toUTCString();
//     document.cookie = cname + "=" + cvalue + ";" + expires;
// 	//document.cookie = cname + "=" + cvalue +  ";path=/";
// }

// function getCookie(cname) {
//     var name = cname + "=";
//     var ca = document.cookie.split(';');
//     for(var i = 0; i < ca.length; i++) {
//         var c = ca[i];
//         while (c.charAt(0) == ' ') {
//             c = c.substring(1);
//         }
//         if (c.indexOf(name) == 0) {
//             return c.substring(name.length, c.length);
//         }
//     }
//     return "";
// }

function getActiveItem(){
    Array.from($("#sidebar-menu").find('a')).forEach(a => {
        if($(a).attr('href') == location.pathname){
  
                $(a).addClass("active")

                $(a).parent('li').parents('li').addClass("menu-open")
                $(a).parent('li').parents('li').children('a').first().addClass("active")
            
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

function loginFull() {
	let menu = [
            {
                "id": "7",
                "level": "system-menu",
                "name": "Starter Pages 1",
                "url": "#",
                "parent_id": "-1",
                "css_class": "nav-icon fas fa-tachometer-alt",
                "authenticate": true,
                "plugin": "system"
            },
            {
                "id": "20",
                "level": "system-menu",
                "name": "Active Page 1 ",
                "url": "/home3",
                "parent_id": "7",
                "css_class": "far fa-circle nav-icon",
                "authenticate": true,
                "plugin": "system"
            },
            {
                "id": "30",
                "level": "system-menu",
                "name": "Inactive Page 2",
                "url": "/home4",
                "parent_id": "7",
                "css_class": "far fa-circle nav-icon",
                "authenticate": true,
                "plugin": "system"
            },
            {
                "id": "12",
                "level": "system-menu",
                "name": "Starter Pages",
                "url": "#",
                "parent_id": "-1",
                "css_class": "nav-icon fas fa-tachometer-alt",
                "authenticate": true,
                "plugin": "system"
            },
            {
                "id": "20",
                "level": "system-menu",
                "name": "Active Page",
                "url": "/home",
                "parent_id": "12",
                "css_class": "far fa-circle nav-icon",
                "authenticate": true,
                "plugin": "system"
            },		
			{
                "id": "30",
                "level": "system-menu",
                "name": "Inactive Page",
                "url": "/home1",
                "parent_id": "12",
                "css_class": "far fa-circle nav-icon",
                "authenticate": true,
                "plugin": "system"
            },
        ];

		
		try {
			let MenuExtStr = localStorage.getItem('menuExt');
			let menuExt = [];
			if((MenuExtStr != undefined) && (MenuExtStr != null) && (MenuExtStr != ""))
				menuExt = JSON.parse(MenuExtStr);
			
			for(let i=0; i< menuExt.length; i++) 
				menu.push(menuExt[i]);
		} catch(eex) { 
			console.dir(eex);
		}
		return menu;
}

function logoutShort() {
	return [{
							"id" : "10",
							"level" : "system-menu",
							"name" : "Dashboard",
							"url" : "/list-bot",
							"parent_id" : "-1",
							"css_class" : "fa fa-area-chart",
							"authenticate" : true,
							"plugin" : "system"		
						},
						{
							"id": "250",
							"level": "system-menu",
							"name": "Hướng dẫn sử dụng",
							"url": "/huong-dan.html",
							"parent_id": "-1",
							"css_class": "fa fa-book",
							"authenticate": true,
							"plugin": "system",
							"new_windows": "_tutorial"
						},
						{
							"id": "300",
							"level": "system-menu",
							"name": "Cộng đồng hỗ trợ",
							"url": "https://www.facebook.com/groups/messflow/",
							"parent_id": "-1",
							"css_class": "fa fa-life-ring",
							"authenticate": true,
							"plugin": "system",
							"new_windows": "_support_group"
						}];
}