<?php
/**
 * file              : index.php
 *
 * @author           : Prabhat Kumar <prabhat.kumar>
 * @detail           : Responsible for answer checking of the evalpro
 * Last updated by   : Prabhat Kumar <prabhat.kumar@ucertify.com>
 * Last updated date : 10-Aug-2020
 */
$is_mincall = 1;
require_once '../../../../../prepengine-header.php';
require_once 'evalProAnsCheck.php';

if ( isset( $data['in_native'] ) ) {
	header( 'Access-Control-Allow-Origin: *' );
	header( 'Access-Control-Allow-Methods: POST' );
	header( 'Access-Control-Allow-Credentials: true' );
	header( 'Access-Control-Allow-Headers: X-Requested-With, Content-Type' );
	$user['user_guid'] = '00iXi';
	$ret               = nativeLogin( $data['native_user'], $data['native_pwd'], $data['isBySocial'] );
	if ( ! $ret ) {
		displaycontent( $ret );
	}
}

check_user( $user );
if ( ucIsset( $data['resetDB'], 1 ) || ucIsset( $data['resetDB'], 2 ) || ucIsset( $data['resetDB'], 3 ) ) {
	print( evalProSqlDBReset( $data ) );
	exit();
}

if ( ucIsset( $data['show_db'], 1 ) ) {
	$codeEngineObj = new codeEngine( $data['user_guid'], $data['db_name'] );
	$res           = $codeEngineObj->send( $data );
	print( $res );
	exit();
}

if ( ucIsset( $data['get_answer'], 1 ) ) {
	$ret = array();
	( checkAnsEvalPro( $data['uxml'], -1, $user['user_guid'] ) == 1 ) ? $ret['userans'] = 'A' : $ret['userans'] = '';
	displaycontent( json_encode( $ret ) );
}



if ( $data['execute_testcases'] == 1 ) {
	// TODO: discuss this code with above code $data['get_answer'] - @sneh both are been used differently
	$ret = checkAnsEvalPro( $data['user_code'], $data['isCompiled'], $user['user_guid'] ) ? 1 : 0; // @sneh - check eval user_guid
	displaycontent( $ret );
}

// to get output when user press RUN button from anywhere
if ( isset( $data['run_code'] ) ) {
	$data['func'] = 'runCode';
	$ret          = getSphereEngine( $data );
	$ret          = json_encode( $ret );
	displaycontent( $ret );
}

// called on click of save and close in authoring mode
if ( $data['qxml'] != '' && $data['ajax'] ) {
	displaycontent( 1 );
}

// on click of save and close in test mode and also from editor remidiation
if ( $data['uxml'] && $data['ajax'] ) {
	$response            = evalGrade( $data['uxml'], $user['user_guid'], -1, '' );
	$response['html']    = getReport( $response['uxml'] );
	$response['ajaxRes'] = 1;
	displaycontent( json_encode( $response ) );
}


