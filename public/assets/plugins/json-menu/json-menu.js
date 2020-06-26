$(function () {
	loadMenu();
});
async function loadMenu() {
    let data = logoutShort();
	if(menuObj == '') {
		data = logoutShort();
	} else if (menuObj == "login" && user_role == '0') {
		data = loginFull();
    }
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
        if(data != ""){
            var source = builddata();
            var ul = $("#sidebar-menu");
            buildUL(ul, source);
            getActiveItem();
        } 
}

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
                "name": "Store",
                "url": "/admin_store",
                "parent_id": "-1",
                "css_class": "nav-icon fas fa-store",
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
	return [];
}