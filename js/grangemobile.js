//object containing several global variables
var globals = {
    lecturers: [],
    selectedLecturer: null,
    modules: [],
    selectedModule: null,
    students: [],
    map: null,
    mapCenter: null
}

//create DOM elements for lecturersPage and modulesPage
$(document).on( "pagebeforecreate", "#search-page", function(){
    // fetch and save data for the lecturers and modules
    $.getJSON('../php/json-data-lecturers.php', function(data){
        $('#lecturer-results').html(createLecturersList(data.lecturers));
        globals.lecturers = data.lecturers;
    });
    $.getJSON('../php/json-data-modules.php', function(data){
        $('#module-results').html(createModulesList(data.modules));
        globals.modules = data.modules;

        //use the data to populate the favorite modules list
        $("#favoritesList").html(createFavoritesList());
    });
    $.getJSON('../php/json-data-students.php', function(data){
        globals.students = data.students;
    });
} )


$(document).on("pagecontainertransition", function(event, ui) {
    // recenter map, after each transition
    if (globals.map !== null) {
        google.maps.event.trigger(globals.map, 'resize');
        globals.map.setCenter(globals.mapCenter);
    }
} );


//return HTML for lecturers' list
function createLecturersList(lecturers) {
    var html = "";
    $.each(lecturers, function(index, lecturer) {
        html += '<li onclick="showLecturer(' + index +')" class="ui-li-static ui-body-inherit ui-btn">'
             + lecturer.firstName + ' ' + lecturer.lastName + '</li>';
    });
    return html;
}

//return HTML for modules' list
function createModulesList(modules) {
    var html = "";
    $.each(modules, function(index, module) {
        html += '<li onclick="showModule(' + index +')" class="ui-li-static ui-body-inherit ui-btn">'
             + module.moduleName + '</li>';
    });
    return html;
}

//return HTML for favorite modules' list
function createFavoritesList() {
    var html = "";
    $.each(loadFavorites(), function(index) {
        html += '<li onclick="showModule(' + index +')" class="ui-li-static ui-body-inherit ui-btn">'
             + globals.modules[index].moduleName + '</li>';
    });
    return html;
}


//return HTML for students' list on module's page
function createStudentsList(students) {
    var html = "";
    $.each(students, function(index, student) {
        html += '<p>' + student.firstName + ' ' + student.lastName + '</p>';
    });
    return html;
}

function lookupModule(moduleNum) {
    var matchingModules = globals.modules.filter(function(m){
        return m.moduleNo === String(moduleNum)
    });
    if (matchingModules.length == 0) {
        return null
    } else {
        return matchingModules[0]
    }
}

//prepare lecturer's details page and switch to it
function showLecturer(index) {
    var lecturer = globals.lecturers[index];
    $("#lecturerName").html(lecturer.firstName + " " + lecturer.lastName);
    $("#staffNumber").html("Staff number: " + lecturer.staffNumber);
    $("#email").html("email: " + lecturer.email);
    $("#module01").html(lookupModule(lecturer.moduleNo1).moduleName);
    $("#module02").html(lookupModule(lecturer.moduleNo2).moduleName);

    $("body").pagecontainer("change", "#viewLecturerDetails");

}


function prepareMap(lat, long, moduleName){
    var location = new google.maps.LatLng(lat, long);
    var myOptions = {
        zoom: 15,
        center: location
    };
    var map = new google.maps.Map(document.getElementById("map"), myOptions);
    globals.map = map; // cache for later use
    globals.mapCenter = location;
    var marker = new google.maps.Marker({
        position: location,
        map: globals.map,
        title: moduleName
    });
}


//prepare module's details page and switch to it
function showModule(index) {
    globals.selectedModule = index;
    var module = globals.modules[index];

    //find module's lecturer based on module number and display it
    var lecturer = null;
    $.each(globals.lecturers, function(i, l) {
        if (l.moduleNo1 === module.moduleNo || l.moduleNo2 === module.moduleNo) {
            lecturer = l;
            lecturerIndex = i;
        }
    });

    if (lecturer === null){
        //just in case the module doesn't have a lecturer listed in the DB
        $("#moduleLecturer").html("Lecturer: Unknown");
    }else {
        $("#moduleLecturer").html('Lecturer: <a href="" onclick="showLecturer(' + lecturerIndex + ')">' + lecturer.firstName + ' ' + lecturer.lastName + '</a>');
    }
    $("#moduleName").html(module.moduleName);
    $("#moduleRoom").html("Room: " + module.room);
    $("#moduleLocation").html("Location: " + module.location);
    $("#moduleNumber").html("Module number: " + module.moduleNo);
    $("#moduleCredits").html("Credits: " + module.credits);
    $("#moduleWebsite").html('Website: <a href="http://' + module.website + '">' + module.website + '</a>');
    $('#allListedStudents').html(createStudentsList(globals.students));

    $("body").pagecontainer("change", "#viewModuleDetails");
    var map = prepareMap(module.lat, module.long, module.moduleName);
}

// ===Favorites handling functions===
function saveFavorites(favoritesArray) {
        localStorage.favorites = JSON.stringify(favoritesArray);
}

function loadFavorites() {
    // initialize if needed
    if (localStorage.getItem("favorites") === null){
        saveFavorites([]);
    }
    return JSON.parse(localStorage.favorites);
}

function removeFavorite(id) {
    var favorites = loadFavorites();
    favorites = favorites.filter(function(storedId) {return storedId != id});
    saveFavorites(favorites);
}

function addFavorite(id) {
    removeFavorite(id); // prevent double entries
    var favorites = loadFavorites();
    favorites.push(id);
    saveFavorites(favorites);
}

function toggleFavorite() {
    var favorited = $("#favorite-label").hasClass("ui-checkbox-on");
    if (favorited) {
        addFavorite(globals.selectedModule);
    } else {
        removeFavorite(globals.selectedModule);
    }
}


//checks whether user's query matches specific lecturer
function lecturerFilter(query, lecturer){
    //transforming all to lower case (making it case insensitive)
    q = query.toLowerCase();
    f = lecturer.firstName.toLowerCase();
    l = lecturer.lastName.toLowerCase();
    return (f + " " + l).indexOf(q) > -1
}

//checks whether user's query matches specific module
function moduleFilter(query, module){
    //transforming all to lower case (making it case insensitive)
    q = query.toLowerCase();
    n = module.moduleName.toLowerCase();
    return n.indexOf(q) > -1
}


// ===filters lecturers'/modules' data with user's query to check whether the query matches any of them===
function valueExistsInLecturers(query) {
    var matchingLecturers = globals.lecturers.filter(function(l){return lecturerFilter(query, l)});
    return matchingLecturers.length > 0
}

function valueExistsInModules(query) {
    var matchingmodules = globals.modules.filter(function(l){return moduleFilter(query, l)});
    return matchingmodules.length > 0
}


//grabs user's search value and checks which page to go to (lecturers or modules).
function mainSearch() {
    var query = $("#search-basic").val();
    if (valueExistsInLecturers(query)) {
        $("body").pagecontainer("change", "#lecturersPage");
        $("#lecturesList input").attr("value", query).triggerHandler("keyup");
    }else if (valueExistsInModules(query)) {
        $("body").pagecontainer("change", "#modulesPage");
        $("#modulesList input").attr("value", query).triggerHandler("keyup");
    } else {
        $("#searchErrorMessage").html("Sorry, we didn't find any lecturers or modules for your search.");
    }
}
