$(function () {
	loadMenu();
});
async function loadMenu() {
    let data = logoutShort();
	if(menuObj == '') {
		data = logoutShort();
	} else if (menuObj == "login" && user_role == '0') {
		data = loginFull();
    } else if (menuObj == "active" && user_role == '0') {
		data = activeFull();
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
                    var li = $("<li class='nav-item'><a href='" + this.url + "' " + getTargetWindown(this) + " class=\"nav-link\"><i class='"  +  this.css_class +  "'></i><p> " + this.label + "</p></a></li>");
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
                        '   <i class="' + this.css_class + '"></i><p>' + this.label + '</p>' +
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
                "name": "Cửa Hàng",
                "url": "/admin_store",
                "parent_id": "-1",
                "css_class": "nav-icon fas fa-store ",
            },
			{
                "id": "8",
                "name": "Quản Lý",
                "url": "#",
                "parent_id": "-1",
                "css_class": "nav-icon fas fa-tasks ",
            },
            {
                "id": "9",
                "name": "Nhân Viên",
                "url": "/admin_employees",
                "parent_id": "8",
                "css_class": "nav-icon far fa-circle",
            },
			{
                "id": "10",
                "name": "Nhà Cung Cấp",
                "url": "/admin_supplier",
                "parent_id": "8",
                "css_class": "nav-icon far fa-circle",
            },
            {
                "id": "11",
                "name": "Dịch Vụ - Sản Phẩm",
                "url": "/admin_product_service",
                "parent_id": "8",
                "css_class": "nav-icon far fa-circle",
            },
            {
                "id": "12",
                "name": "Nhập Hàng",
                "url": "/admin_store_stocks",
                "parent_id": "8",
                "css_class": "nav-icon far fa-circle",
            },
			{
                "id": "13",
                "name": "Chuyển hàng",
                "url": "/admin_tranfer_stocks",
                "parent_id": "8",
                "css_class": "nav-icon far fa-circle",
            },
            {
                "id": "14",
                "name": "Thu/Chi",
                "url": "/admin_cash_book",
                "parent_id": "8",
                "css_class": "nav-icon far fa-circle",
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
function activeFull() {
	let menu = [
            {
                "id": "7",
                "name": "Cửa Hàng",
                "url": "#",
                "parent_id": "-1",
                "css_class": "nav-icon fas fa-store ",
            },
			{
                "id": "8",
                "name": "Chọn Cửa Hàng",
                "url": "/admin_store",
                "parent_id": "7",
                "css_class": "nav-icon far fa-circle",
            },
			{
                "id": "9",
                "name": "Sửa Thông Tin",
                "url": "/admin_store_edit",
                "parent_id": "7",
                "css_class": "nav-icon far fa-circle",
            },
			{
                "id": "10",
                "name": "Quản Lý",
                "url": "#",
                "parent_id": "-1",
                "css_class": "nav-icon fas fa-tasks ",
            },
            {
                "id": "11",
                "name": "Nhân Viên",
                "url": "/admin_employees",
                "parent_id": "10",
                "css_class": "nav-icon far fa-circle",
            },
			{
                "id": "12",
                "name": "Nhà Cung Cấp",
                "url": "/admin_supplier",
                "parent_id": "10",
                "css_class": "nav-icon far fa-circle",
            },
            {
                "id": "13",
                "name": "Dịch Vụ - Sản Phẩm",
                "url": "/admin_product_service",
                "parent_id": "10",
                "css_class": "nav-icon far fa-circle",
            },
            {
                "id": "14",
                "name": "Nhập Hàng",
                "url": "/admin_store_stocks",
                "parent_id": "10",
                "css_class": "nav-icon far fa-circle",
            },
			{
                "id": "15",
                "name": "Chuyển hàng",
                "url": "/admin_tranfer_stocks",
                "parent_id": "10",
                "css_class": "nav-icon far fa-circle",
            },
            {
                "id": "16",
                "name": "Thu/Chi",
                "url": "/admin_cash_book",
                "parent_id": "10",
                "css_class": "nav-icon far fa-circle",
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