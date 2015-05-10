//object containing several global variables
var globalStorage = {
    lecturers: [],
    modules: [],
    students: [],
    map: null,
    mapCenter: null
}

//create DOM elements for lecturersPage and modulesPage
$(document).on("pagebeforecreate", function(){
    // fetch and save data for the lecturers and modules
    $.getJSON('../php/json-data-lecturers.php', function(data){
        $('#lecturer-results').html(createLecturersList(data.lecturers));
        globalStorage.lecturers = data.lecturers;
    });
    $.getJSON('../php/json-data-modules.php', function(data){
        $('#module-results').html(createModulesList(data.modules));
        globalStorage.modules = data.modules;
    });
    $.getJSON('../php/json-data-students.php', function(data){
        globalStorage.students = data.students;
    });
} )

$(document).on("pagecontainertransition", function(event, ui) {
    // recenter map, after each transition
    if (globalStorage.map !== null) {
        google.maps.event.trigger(globalStorage.map, 'resize');
        globalStorage.map.setCenter(globalStorage.mapCenter);
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

//return HTML for students' list on module's page
function createStudentsList(students) {
    var html = "";
    $.each(students, function(index, student) {
        html += '<p>' + student.firstName + ' ' + student.lastName + '</p>';
    });
    return html;
}


//prepare lecturer's details page and switch to it
function showLecturer(index) {
    var lecturer = globalStorage.lecturers[index];
    $("#lecturerName").html(lecturer.firstName + " " + lecturer.lastName);
    $("body").pagecontainer("change", "#viewLecturerDetails");
}

function prepareMap(lat, long, moduleName){
    var location = new google.maps.LatLng(lat, long);
    var myOptions = {
        zoom: 15,
        center: location
    };
    var map = new google.maps.Map(document.getElementById("map"), myOptions);
    globalStorage.map = map; // cache for later use
    globalStorage.mapCenter = location;
    var marker = new google.maps.Marker({
        position: location,
        map: globalStorage.map,
        title: moduleName
    });
}


//prepare module's details page and switch to it
function showModule(index) {
    var module = globalStorage.modules[index];

    //find module's lecturer based on module number and display it
    var lecturer = null;
    $.each(globalStorage.lecturers, function(i, l) {
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
    $('#allListedStudents').html(createStudentsList(globalStorage.students));

    $("body").pagecontainer("change", "#viewModuleDetails");
    var map = prepareMap(module.lat, module.long, module.moduleName);
}

//grabs user's search value and injects it to the filter (input) element on the list page
function grabSearchValue() {
    var query = $("#search-basic").val();
    $("body").pagecontainer("change", "#lecturersPage");
    $("#lecturesList input").attr("value", query).trigger("keyup");
}




////checks whether user's query matches specific lecturer
//function lecturerFilter(query, lecturer){
//    //transforming all to lower case (making it case insensitive)
//    q = query.toLowerCase();
//    f = lecturer.firstName.toLowerCase();
//    l = lecturer.lastName.toLowerCase();
//    return (q == f || q == l || q == f + " " + l || q == l + " " + f)
//}
//
//
////filters lecturers' data with user's query and returns html for display
//function lookupLecturers (query, lecturers){
//    var matchingLecturers = lecturers.filter(function(l){return lecturerFilter(query, l)});
//
//    //leave function early if there are no matching results, don't even start building a list for results
//    if (matchingLecturers.length == 0) {
//        return ""
//    }
//
//    '<li>' + lecturer.firstName+ '</li>' +
//    '<li>' + lecturer.lastName+ '</li>' +
//    '<li>' + lecturer.studentID+ '</li>'
//}
