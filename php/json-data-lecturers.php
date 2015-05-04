<?
/*
 * Following code will list all the lecturers on a course
 */
 
//Enable cross domain Communication - Beware, this can be a security risk 
header('Access-Control-Allow-Origin: http://localhost:8383');

// array for JSON response
$response = array();

// include db connect class
require_once __DIR__ . '/db_connect.php';

// connecting to db
$db = new DB_CONNECT();

// get all lecturers from lecturerTable
$result = mysql_query("SELECT * FROM lecturerTable") or die(mysql_error());

// check for empty result
if (mysql_num_rows($result) > 0)
 {
    // looping through all results
    // lecturers node
    $response["lecturers"] = array();

     while ($row = mysql_fetch_array($result)) 
     {
        	// temp lecturer array
            $lecturer = array();
            $lecturer["staffNumber"] = $row["staffNumber"];
            $lecturer["firstName"] = $row["firstName"];
            $lecturer["lastName"] = $row["lastName"];
            $lecturer["moduleNo1"] = $row["moduleNo1"];
            $lecturer["moduleNo2"] = $row["moduleNo2"];
            $lecturer["email"] =$row["email"];

       // push single product into final response array
        array_push($response["lecturers"], $lecturer);
    }
    // success
    $response["success"] = 1;

    // echoing JSON response
    print (json_encode($response));
    // echo (json_encode($response));

}else {

    // no lecturers found
    $response["success"] = 0;
    $response["message"] = "No products found";

    // echo no lecturers JSON
    print (json_encode($response));
    //echo (json_encode($response));
}


?>

