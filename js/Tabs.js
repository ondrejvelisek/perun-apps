/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Tabs(place) {
    this.tabs = [];
    this.place = place;
    
    this.addTab = function(tab) {
        if (this.containsTab(tab.name)) {
            this.removeTab(tab.name);
        }
        this.tabs.push(tab);
        this.render();
        tab.setPlace(place);
    };
    
    this.removeTab = function(name) {
        for (var id in this.tabs) {
            if (this.tabs[id].name === name) {
                this.tabs.splice(id,1);
            }
        }
        this.render();
    };
    
    this.removeSuccessors = function(name) {
        for (var id in this.tabs) {
            if (this.tabs[id].name === name) {
                this.tabs.splice(parseInt(id)+1, 1000);
            }
        }
        this.render();
    };
    
    this.show = function(name) {
        this.render();
        place.find(".nav a[href=#"+name+"]").tab("show");
    };
    
    this.render = function() {
        var html = "";
        for (var id in this.tabs) {
            html += this.tabs[id].getHtml();
            if (place.find(".tab-content #" + this.tabs[id].name).length === 0) {
                place.find(".tab-content").append(this.tabs[id].getContentHtml());
            }
        }
        place.find(".nav").html(html);
    };
    
    this.containsTab = function (name) {
        for (var id in this.tabs) {
            if (this.tabs[id].name === name) {
                return true;
            }
        }
        return false;
    };
    
    this.getTabByName = function (name) {
        for (var id in this.tabs) {
            if (this.tabs[id].name === name) {
                return this.tabs[id];
            }
        }
        return null;
    };
}

function Tab(title, name) {
    this.title = title;
    this.name = name;
    this.content = "";
    this.place;
    
    this.setPlace = function(place) {
        this.place = place.find("#" + this.name);
    };
    
    this.getHtml = function () {
        return '<li><a href="#' + this.name + '" role="tab" data-toggle="tab">' + this.title + '</a></li>';
    };
    
    this.getContentHtml = function () {
        return '<div id="' + this.name + '" class="tab-pane">' + this.content + '</div>';
    };
    
    this.addContent = function (contentToAdd) {
        this.content += contentToAdd;
        this.place.append(contentToAdd);
        //this.render();
    };
    
    this.clear = function() {
        this.content = "";
        this.render();
    }
    
    this.render = function () {
        this.place.html(this.content);
    }
}