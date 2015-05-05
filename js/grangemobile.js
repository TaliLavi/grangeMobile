//object containing several global variables
var globalStorage = {
    lecturers: null,
    modules: null
}

//create DOM elements for lecturersPage and modulesPage
$(document).on("pagebeforecreate", function(){
    var lecturerHtml = createLecturersList(getLecturers());
    $('#lecturer-results').html(lecturerHtml);
    var moduleHtml = createModulesList(getModules());
    $('#module-results').html(moduleHtml);
} )

//if global var is null, cache it with lecturers data
function getLecturers() {
    if (globalStorage.lecturers === null) {
        //making a synchronous request because we need the data for page load
        globalStorage.lecturers  = $.parseJSON(
            $.ajax({url: '../php/json-data-lecturers.php', async: false, dataType: 'json'}
            ).responseText).lecturers;
    }
    return globalStorage.lecturers
}

//if global var is null, cache it with modules data
function getModules() {
    if (globalStorage.modules === null) {
        //making a synchronous request because we need the data for page load
        globalStorage.modules  = $.parseJSON(
            $.ajax({url: '../php/json-data-modules.php', async: false, dataType: 'json'}
            ).responseText).modules;
    }
    return globalStorage.modules
}

//return HTML for lecturers' list
function createLecturersList(lecturers) {
    var html = "";
    $.each(lecturers, function(index, lecturer) {
        html += '<li onclick="showLecturer(' + index +')" class="ui-btn">'
             + lecturer.firstName + ' ' + lecturer.lastName + '</li>';
    });
    return html;
}

//return HTML for modules' list
function createModulesList(modules) {
    var html = "";
    $.each(modules, function(index, module) {
        html += '<li onclick="showModule(' + index +')" class="ui-btn">'
            + module.moduleName + '</li>';
    });
    return html;
}

//prepare lecturer's details page and switch to it
function showLecturer(index) {
    var lecturer = getLecturers()[index];
    $("#lecturerName").html(lecturer.firstName + " " + lecturer.lastName);
    $("body").pagecontainer("change", "#viewLecturerDetails");
}


//prepare module's details page and switch to it
function showModule(index) {
    var module = getModules()[index];
    $("#moduleName").html(module.moduleName);
    $("body").pagecontainer("change", "#viewModuleDetails");
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
