//object containing several global variables
var globalStorage = {
    lecturers: [],
    modules: []
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
} )

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

//prepare lecturer's details page and switch to it
function showLecturer(index) {
    var lecturer = globalStorage.lecturers[index];
    $("#lecturerName").html(lecturer.firstName + " " + lecturer.lastName);
    $("body").pagecontainer("change", "#viewLecturerDetails");
}

//prepare module's details page and switch to it
function showModule(index) {
    var module = globalStorage.modules[index];
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
