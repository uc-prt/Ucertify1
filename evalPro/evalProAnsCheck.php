<?php
/** * File : evalProAnsCheck.php
 *
 * @package :pe-items/evalpro
 * @detail    : Responsible for answer checking
 * Last updated by   : Prabhat Kumar <prabhat.kumar@ucertify.com>
 * Last updated date : 29/July/2020
 */

// require code engine for class intailiztiozrion.
require_once ITEMLINK . 'evalPro/code-engine.php';

/**
 * Function to check the match cases
 *
 * @param array $dataAttr  : containing the xml data.
 * @param array $result    : containing the excuted code output.
 * @param array $testInput : containg the input of the question.
 * @return array
 */
function checkMatchCase( $dataAttr, $result, $testInput ) {
	$returnRes = array(
		'input'  => $testInput,
		'result' => $result,
	);
	if ( $dataAttr['case_insensitive'] && $dataAttr['case_insensitive'] == 1 && is_string( $testInput ) && is_string( $result ) ) {
		$testInput = strtolower( $testInput );
		$result    = strtolower( $result );
		$returnRes = array(
			'input'  => $testInput,
			'result' => $result,
		);
	}

	if ( $dataAttr['ignore_special_char'] && $dataAttr['ignore_special_char'] == 1 ) {
		$testInput = preg_replace( "/(\\n)|[^a-zA-Z0-9]/", '', $testInput );
		$result    = preg_replace( "/(\\n)|[^a-zA-Z0-9]/", '', $result );
		$returnRes = array(
			'input'  => $testInput,
			'result' => $result,
		);
	}

	if ( $dataAttr['partial_match'] && $dataAttr['partial_match'] == 1 ) {
		$returnRes['isPart'] = 1;
	}

	return $returnRes;
}
/**
 * Function to check the sample input
 *
 * @param array $data : containing xml data.
 * @param array $testcases : containing the test cases.
 * @return array
 */
function submitEvaluate( $data, $testcases ) {
	$uXML                     = $data['special_module_user_xml'];
	$user                     = getGlobalArray( 'user' );
	$data['user_guid']        = $user['user_guid'];
	$XMLNODE                  = xml2array( $uXML );
	$lineSection              = $XMLNODE[0]['attributes']['lineSection'];
	$showpre                  = is_numeric( $XMLNODE[0]['attributes']['showpre'] ) ? $XMLNODE[0]['attributes']['showpre'] : 0;
	$showeditor               = is_numeric( $XMLNODE[0]['attributes']['showeditor'] ) ? $XMLNODE[0]['attributes']['showeditor'] : 1;
	$showpost                 = is_numeric( $XMLNODE[0]['attributes']['showpost'] ) ? $XMLNODE[0]['attributes']['showpost'] : 0;
	$is_pre_tag               = is_numeric( $XMLNODE[0]['attributes']['is_pre_tag'] ) ? $XMLNODE[0]['attributes']['is_pre_tag'] : 0;
	$dataAttr['repltype']     = $XMLNODE[0]['attributes']['language'];
	$dataAttr['db_name']      = $XMLNODE[0]['attributes']['db_name'];
	$dataAttr['is_graph']     = $XMLNODE[0]['attributes']['is_graph'];
	$dataAttr['ignore_error'] = $XMLNODE[0]['attributes']['ignore_error'];
	$dataAttr['pre']          = everythingInTags( $uXML, 'pre' );
	$dataAttr['code']         = everythingInTags( $uXML, 'editor' );
	$dataAttr['post']         = everythingInTags( $uXML, 'post' );
	$dataAttr['user_guid']    = $data['user_guid'];
	$ignore_formatting        = $XMLNODE[0]['attributes']['ignore_formatting'];
	$dataAttr['func']         = 'submitEvaluate';
	if ( ! ucIsset( $data['sampleInput'] ) ) {
		$testcases           = preg_replace( "/[\n\r]/", '', $testcases );
		$testcases           = explode( '</case>', $testcases );
		$testcases           = str_replace( '<case>', '', $testcases[0] );
		$testData            = explode( '|', $testcases );
		$testcasesInput      = preg_match( '/^(\(|\[|\{|array\()[\s\S]*?(\]|\}|\))$/', $testData[0] ) ? $testData[0] : explode( ',', $testData[0] );
		$data['sampleInput'] = @strpos( $testcasesInput, "\n" ) !== false ? join( "\n", $testcasesInput ) : $testcasesInput;
	}
	$dataAttr['stdin'] = $data['sampleInput'];
	if ( $dataAttr['repltype'] == 'sql' || $dataAttr['repltype'] == 'psql' ) {
		$data['ignore_reset_db'] = isset($XMLNODE[0]['attributes']['ignore_reset_db']) ? $XMLNODE[0]['attributes']['ignore_reset_db'] : 0;
		evalProSqlDBReset( $data );
	}
	$code  = ltrim( $dataAttr['pre'] ) ? $dataAttr['pre'] : '';
	$code .= $dataAttr['code'];
	$pos   = strpos( $code, '-- Write your query here' );
	if ( $pos ) {
		$code = substr( $code, $pos );
	}
	if ( ( ( $dataAttr['repltype'] == 'sql' || $dataAttr['repltype'] == 'psql' ) && $showpost ) || ( $dataAttr['repltype'] <> 'sql' && $dataAttr['repltype'] <> 'psql' ) ) {
		$code .= $dataAttr['post'] ? $dataAttr['post'] : '';
	}
	$dataAttr['code'] = $code;
	$userret          = (array) getSphereEngine( $dataAttr );
	$error            = 0;
	$output           = $userret['output'];

	if ( $userret['status_message'] <> 'Successful' ) {
		$output     = parseLineNumber( $userret['stderr'], $dataAttr['repltype'], $lineSection, $showpre, $showeditor, $showpost );
		$is_pre_tag = 1;
		$error      = 1;
		// Handle duplicates, existence error.
		if ( $dataAttr['repltype'] == 'sql' || $dataAttr['repltype'] == 'psql' ) {
			$is_allowed = checkError( $userret['stderr'] );
			if ( $is_allowed ) {
				$userret['status_message'] = 'Successful';
			}
		}
	} elseif ( $dataAttr['repltype'] == 'sql' || $dataAttr['repltype'] == 'psql' || $dataAttr['repltype'] == 'c++' ) {
		$is_pre_tag = 1;
	} elseif ( $dataAttr['repltype'] == 'r' || $dataAttr['is_graph'] == '1' ) {
		$is_pre_tag = 2;
	}
	
	$userret['output']         = $error . '||' . $is_pre_tag . '||' . $dataAttr['stdin'] . '||' . $ignore_formatting . '||' . $output;
	$evaldata                  = array();
	$evaldata['uxml']          = $uXML;
	$evaldata['submit_output'] = $userret['output']; // Error and output.
	$userret['uxml']           = modifyUxml( $evaldata );
	return $userret;
}
/**
 * Function to check the Error in SQL for the duplicates or already exists or table doest not exist
 *
 * @param string $error : containing the error of the executed code.
 * @return integer
 */
function checkError( $error ) {
	$error_codes = array(
		'ERROR 1050 (42S01)', // Already exists.
		'ERROR 1062 (23000)', // Duplicates entry.
		'ERROR 1061 (42000)',
		'ERROR 1051 (42S02)', // DROP TABLE If not exist.
		'already exists',
	);
	foreach ( $error_codes as $error_code ) {
		if ( strpos( $error, $error_code ) !== false ) {
			return 1;
		}
	}
	return 0;
}
/**
 * Function to parse the Line number of error line
 *
 * @param string  $errorMsg : error of the executed code.
 * @param string  $language : lang of lab.
 * @param string  $lineSection : pre, post, editor line number of the code.
 * @param integer $showpre     : for the pre block visible or not.
 * @param integer $showeditor  : for the editor block visible or not.
 * @param integer $showpost    : for the post block visible or not.
 * @return string
 */
function parseLineNumber( $errorMsg, $language, $lineSection, $showpre = 0, $showeditor = 1, $showpost = 0 ) {
	$lineSection = explode( ',', $lineSection );
	$pre         = $lineSection[0];
	$editor      = $lineSection[1];
	$post        = $lineSection[2];
	switch ( $language ) {
		case 'java':
			$line = explode( 'Solution.java:', $errorMsg );
			if ( $line[1] ) {
				$lineNo = substr( $line[1], 0, 2 );
				$lineNo = getSectionLine( $lineNo, $pre, $editor, $post );
				$lineNo = str_replace( ':', '', $lineNo );
				if ( ( ! $showpre && ! $showeditor && ! $showpost && $lineNo > $pre && $lineNo <= $pre + $editor )
					|| ( $showpre && $lineNo <= $pre )
					|| ( $showpost && $lineNo >= $pre + $editor )
					|| ( $showeditor && $lineNo > $pre && $lineNo <= $pre + $editor )
					|| ( $showpre && $showeditor && $showpost )
					) {
					$errorMsg = preg_replace( '/ line \d*/', " line {$lineNo}", $errorMsg );
				} else {
					$errorMsg = 'Unable to execute test cases, there are issues with your code. Please fix.';
				}
			}
			break;
		case 'python':
			// In case of exception error <module> tag is coming so remove this from code.
			$is_module        = strpos( $errorMsg, '<module>' );
			$is_multiple_line = strpos( $errorMsg, 'line ', $is_module );
			if ( $is_module !== false && $is_multiple_line !== false ) {
				$errorMsg = substr( $errorMsg, $is_module + strlen( '<module>' ) );
			}
			$line = explode( 'line', $errorMsg );
			if ( $line[1] ) {
				$line[1] = trim( $line[1] );
				$lineNo  = (int) filter_var( $line[1], FILTER_SANITIZE_NUMBER_INT );
				if ( ( ! $showpre && ! $showeditor && ! $showpost && $lineNo > $pre && $lineNo <= $pre + $editor )
					|| ( $showpre && $lineNo <= $pre )
					|| ( $showpost && $lineNo >= $pre + $editor )
					|| ( $showeditor && $lineNo > $pre && $lineNo <= $pre + $editor )
					|| ( $showpre && $showeditor && $showpost )
					) {
					$lineNo   = getSectionLine( $lineNo, $pre, $editor, $post );
					$errorMsg = preg_replace( '/ line \d*/', " line {$lineNo}", $errorMsg );
				} else {
					$errorMsg = 'Unable to execute test cases, there are issues with your code. Please fix.';
				}
			}
			break;
		case 'php':
			$line = explode( $errorMsg, 'in /home/ucertify' );
			if ( $line[1] ) {
				$lineNo = explode( 'line', $line[1] );
				$lineNo = getSectionLine( $lineNo[1], $pre, $editor, $post );
				if ( ( ! $showpre && ! $showeditor && ! $showpost && $lineNo > $pre && $lineNo <= $pre + $editor )
					|| ( $showpre && $lineNo <= $pre )
					|| ( $showpost && $lineNo >= $pre + $editor )
					|| ( $showeditor && $lineNo > $pre && $lineNo <= $pre + $editor )
					|| ( $showpre && $showeditor && $showpost )
					) {
					$errorMsg = $line[0] . 'on line ' . $lineNo;
				} else {
					$errorMsg = 'Unable to execute test cases, there are issues with your code. Please fix.';
				}
			}
			break;
		case 'default':
			return $errorMsg;
	}
	return $errorMsg;
}
/**
 * Function to check the get the actual line number
 *
 * @param integer $lineNo : Line number of the error.
 * @param integer $pre : Number of line in pre block.
 * @param integer $editor : Number of line in editor block.
 * @param integer $post : Number of line in post block.
 * @return integer
 */
function getSectionLine( $lineNo, $pre, $editor, $post ) {
	if ( $lineNo <= $pre ) {
		// No need here.
		return $lineNo;
	} elseif ( $lineNo <= $pre + $editor ) {
		$lineNo = $lineNo - $pre;
	} elseif ( $lineNo <= ( $pre + $editor + $post ) ) {
		$lineNo = $lineNo - ( $pre + $editor );
	}

	return $lineNo;
}

/**
 * Function to evaluate the answer for all testcases
 *
 * @param string  $uXML     : user anser xml.
 * @param string  $user_guid : user guid.
 * @param integer $isCompiled : icCompiled.
 * @param array   $testcases : testcases of the question.
 * @return array
 */
function evalGrade( $uXML = '', $user_guid, $isCompiled = -1, $testcases = '' ) {
	$testcase_output                 = array();
	$testcase_flag                   = 0;
	$XMLNODE                         = xml2array( $uXML );
	$dataAttr['repltype']            = $XMLNODE[0]['attributes']['language'];
	$dataAttr['partial_match']       = $XMLNODE[0]['attributes']['partial_match'];
	$dataAttr['ignore_special_char'] = $XMLNODE[0]['attributes']['special_char'];
	$dataAttr['case_insensitive']    = $XMLNODE[0]['attributes']['case_sensitive'];
	$dataAttr['db_name']             = $XMLNODE[0]['attributes']['db_name'];
	$dataAttr['is_graph']            = $XMLNODE[0]['attributes']['is_graph'];
	$dataAttr['pre']                 = everythingInTags( $uXML, 'pre' );
	$dataAttr['code']                = everythingInTags( $uXML, 'editor' );
	$dataAttr['post']                = everythingInTags( $uXML, 'post' );
	$dataAttr['user_guid']           = $user_guid;
	$customFunction                  = everythingInTags( $uXML, 'qmatch' );
	if ( $testcases == '' ) {
		$testcases = everythingInTags( $uXML, 'testcases' );
	}
	$testcases        = preg_replace( "/[\n\r]/", '', $testcases );
	$testcases        = explode( '</case>', $testcases );
	$testData_arr     = array();
	$dataAttr['func'] = 'evalGrade';
	if ( $dataAttr['repltype'] == 'sql' || $dataAttr['repltype'] == 'psql' ) {
		getSphereEngine( $dataAttr );
		if ( trim( $dataAttr['post'] ) ) {
			$dataAttr['code'] = '';
		}
	}

	if ( $dataAttr['pre'] ) {
		$dataAttr['code'] = $dataAttr['pre'] . $dataAttr['code'];
	}

	if ( $dataAttr['post'] ) {
		$dataAttr['code'] = $dataAttr['code'] . $dataAttr['post'];
	}
	preg_match( '/\$__CUSTUM:/', implode( ',', $testcases ), $isCustumeOutput );
	if ( ucIsset( $customFunction ) && $customFunction != 'null' ) {
		$evdata = array();
		if ( $isCompiled != -1 ) {
			$testcases[0]      = str_replace( '<case>', '', $testcases[0] );
			$testData          = explode( '|', $testcases[0] );
			$testcasesInput    = preg_match( '/^(\(|\[|\{|array\()[\s\S]*?(\]|\}|\))$/', $testData[0] ) ? $testData[0] : explode( ',', $testData[0] );
			$dataAttr['stdin'] = @strpos( $testcasesInput, "\n" ) !== false ? join( "\n", $testcasesInput ) : $testcasesInput;
			$compret           = (array) getSphereEngine( $dataAttr );

			if ( $compret['stderr'] != '' ) {
				$evdata['detailReport'][1] = 'Failed';
			} else {
				$evdata['detailReport'][1] = 'Passed';
			}
		}

		preg_match( '/' . preg_quote( $customFunction, '/' ) . '/i', $dataAttr['code'], $customFunctionResult );
		$evdata['detailReport'][2] = 'Passed';
		if ( ! $customFunctionResult ) {
			$evdata['detailReport'][2] = 'Failed';
		}
		if ( ! $isCustumeOutput[0] ) {
			$evaldata           = $evdata;
			$evaldata['answer'] = '0';

			if ( is_array( $evaldata['detailReport'] ) ) {
				$report = array_unique( array_filter( $evaldata['detailReport'] ) );
				if ( count_uc( $report ) == 1 && $report[1] == 'Passed' ) {
					$evaldata['answer'] = '1';
				}
			}
			$evaldata['uxml'] = $uXML;
			$evaldata         = modifyUxml( $evaldata );
			return $evaldata;
		}
	}
	$test_cases_count = count_uc( $testcases );
	for ( $i = 0; $i < $test_cases_count - 1; $i++ ) {
		$testcases[ $i ] = str_replace( '<case>', '', $testcases[ $i ] );
		// Don't remove the None in case of None is defined in the testcases.
		$is_remove_none = 1;
		if ( $dataAttr['repltype'] == 'python' && strpos( $testcases[ $i ], 'None' ) !== false ) {
			$is_remove_none = 0;
		}
		$testData       = explode( '|', $testcases[ $i ] );
		$testcasesInput = preg_match( '/^(\(|\[|\{|array\()[\s\S]*?(\]|\}|\))$/', $testData[0] ) ? $testData[0] : explode( ',', $testData[0] );

		if ( strpos( json_encode( $testcasesInput ), '__sep__' ) > 0 ) {
			$testcasesInput = explode( '__sep__', $testData[0] );
		}
		$dataAttr['stdin']           = @strpos( $testcasesInput, "\n" ) !== false ? join( "\n", $testcasesInput ) : $testcasesInput;
		$EVREQ[ $dataAttr['stdin'] ] = $testData[1];
		$EVRES[ $dataAttr['stdin'] ] = (array) getSphereEngine( $dataAttr, $is_remove_none );
		if ( ( $EVRES[ $dataAttr['stdin'] ]['status'] == 3 ) && ( $testcase_flag < 3 ) ) {   // Check if execution is done.
			--$i;
			$testcase_flag++;
			continue;
		}
		// use this to remove space and new line from output.
		if ( preg_match( '/:trim:/', $EVREQ[ $dataAttr['stdin'] ] ) ) {
			$EVREQ[ $dataAttr['stdin'] ]           = preg_replace( '/:trim:/', '', $EVREQ[ $dataAttr['stdin'] ] );
			$EVREQ[ $dataAttr['stdin'] ]           = trimAnswer( $EVREQ[ $dataAttr['stdin'] ] );
			$EVRES[ $dataAttr['stdin'] ]['output'] = trimAnswer( $EVRES[ $dataAttr['stdin'] ]['output'] );
		}
		if ( ! $isCustumeOutput ) {
			if ( preg_match( '/<span class=\'hidden\'>|<span class="hidden">/', $EVRES[ $dataAttr['stdin'] ]['output'] ) ) {
				preg_match( '/<span class=\'hidden\'>[\s\S]*?<\/span>|<span class="hidden">[\s\S]*?<\/span>/', $EVRES[ $dataAttr['stdin'] ]['output'], $hidden_output );
				if ( $hidden_output ) {
					$EVRES[ $dataAttr['stdin'] ]['output'] = preg_replace( '/<span class=\'hidden\'>|<span class="hidden">|<\/span>/', '', $hidden_output[0] );
				}
			}
			array_push( $testcase_output, $EVRES[ $dataAttr['stdin'] ]['output'] );
			if ( $dataAttr['repltype'] == 'sql' || $dataAttr['repltype'] == 'psql' ) {
				$a             = preg_replace( '/\s/im', ' ', $EVRES[ $dataAttr['stdin'] ]['output'] );
				$b             = preg_replace( '/\s/im', ' ', $EVREQ[ $dataAttr['stdin'] ] );
				$oup_arr       = explode( ',', $b );
				$sql_flag      = 1;
				$oup_arr_count = count_uc( $oup_arr );
				for ( $ki = 0; $ki < $oup_arr_count; $ki++ ) {
					$oup_val    = $oup_arr[ $ki ];
					$filterData = checkMatchCase( $dataAttr, trim( $oup_val ), trim( $a ) );
					$isCorrect  = ( stripos( $filterData['input'], $filterData['result'] ) !== false );
					if ( ! $isCorrect ) {
						$sql_flag = 0;
					}
				}

				$evaldata['detailReport'][ $i ] = 'Failed';
				if ( $sql_flag == 1 ) {
					$evaldata['detailReport'][ $i ] = 'Passed';
				}
			} else {
				// checking ans if not sql type.
				$filterData = checkMatchCase( $dataAttr, trim( $EVRES[ $dataAttr['stdin'] ]['output'] ), trim( $EVREQ[ $dataAttr['stdin'] ] ) );
				if ( strpos( $filterData['result'], 'image_data:' ) !== false ) {
					$result               = explode( 'image_data:', $filterData['result'] );
					$filterData['result'] = $result[1];
				}
				$isCorrect                      = $filterData['isPart'] ? ( stripos( $filterData['input'], $filterData['result'] ) !== false || stripos( $filterData['result'], $filterData['input'] ) !== false ) : ( strcmp( $filterData['result'], $filterData['input'] ) == 0 );
				$evaldata['detailReport'][ $i ] = 'Failed';
				if ( $isCorrect ) {
					$evaldata['detailReport'][ $i ] = 'Passed';
				}
			}
		} else {
			$evaldata['detailReport'][ $i ] = executeCustumeFunc( $EVREQ, $EVRES );
		}
		array_push( $testData_arr, $testData );
	}

	if ( $isCustumeOutput && count_uc( $evdata ) > 0 ) {
		array_push( $evaldata['detailReport'], $evdata['detailReport'][2] );
	}

	if ( is_array( $evaldata['detailReport'] ) ) {
		$report = array_unique( array_filter( $evaldata['detailReport'] ) );
	}

	( count_uc( $report ) == 1 && $report[0] == 'Passed' ) ? $evaldata['answer'] = '1' : $evaldata['answer'] = '0';
	$evaldata['uxml']            = $uXML;
	$evaldata['testcase_output'] = $testcase_output;
	$evaldata['testData']        = $testData_arr;
	$evaldata                    = modifyUxml( $evaldata );
	return $evaldata;
}

/**
 * This function is for modifying xml for error handling
 *
 * @param array $evaldata : xml data.
 * @return array
 */
function modifyUxml( $evaldata ) {
	$uXML = $evaldata['uxml'];
	// In Case of submit input we need to update the xml.
	if ( ucIsset( $evaldata['submit_output'] ) ) {
		$uXML = preg_replace( '/<submitoutput>[\s\S]*?<\/submitoutput>/', '', $uXML );
		$uXML = preg_replace( '/<\/SMXML>/', '', $uXML );
		$uXML = $uXML . '<submitoutput>' . $evaldata['submit_output'] . '</submitoutput></SMXML>';
		return $uXML;
	}

	$result         = $evaldata['detailReport'];
	$testoutput     = $evaldata['testcase_output'];
	$result_str     = @implode( ',', $result );   // Pradeep: added @ for error/warning handling.
	$testoutput_str = implode( ';', $testoutput );
	if ( strpos( $uXML, '<result>' ) ) {
		$uXML = preg_replace( '/<testoutput>[\s\S]*?<\/testoutput>[\s\S]*?<result>[\s\S]*?<\/result><\/SMXML>/', '', $uXML );
	} else {
		$uXML = preg_replace( '/<\/SMXML>/', '', $uXML );
	}

	$evaldata['uxml'] = $uXML . '<testoutput>' . $testoutput_str . '</testoutput><result>' . $result_str . '</result></SMXML>';
	return $evaldata;
}

/**
 * Function is for checking the answer status on the bases of testcases
 *
 * @param array $req : request.
 * @param array $res : response.
 * @return string
 */
function executeCustumeFunc( $req, $res ) {
	if ( strpos( $req[''], 'contains' ) !== false ) {
		preg_match( '/contains\("(.*?)"\)/', $req[''], $contains );
		preg_match( '/' . preg_quote( end( $contains ), '/' ) . '/', $res['']['output'], $isContains );
		$isContains = $isContains ? 'Passed' : 'Failed';
		return $isContains;
	} elseif ( strpos( $req[''], 'eval' ) !== false ) {
		preg_match( '/eval\((.*?)\)$/', $req[''], $eval );
		if ( $eval ) {
			$result = strcmp( trim( $res['']['output'] ), trim( eval( end( $eval ) ) ) ) == 0 ? 'Passed' : 'Failed';
			return $result;
		}
		return 'Failed';
	}
}
/**
 * This function is called when code is need to send to online compiler and get coompiled response
 *
 * @param array   $data : xml data.
 * @param integer $is_remove_none : To check remove the print or not.
 * @return array
 */
function getSphereEngine( $data, $is_remove_none = 1 ) {
	$codeEngineObj = new codeEngine( $data['user_guid'], $data['db_name'] );
	$res           = $codeEngineObj->execute( $data, $is_remove_none );
	return $res;
}
/**
 * Function to check the evalpro answer
 *
 * @param string  $uxml : xml data.
 * @param integer $isCompiled : isComplied.
 * @param string  $user_guid : user_guid.
 * @return array
 */
function checkAnsEvalPro( $uxml = '', $isCompiled = -1, $user_guid ) {
	$t = evalGrade( $uxml, $user_guid, $isCompiled );
	return $t['answer'] == '1' ? true : false;
}
/**
 * Function to trim the answer
 *
 * @param string $answer : code executed output.
 * @return string
 */
function trimAnswer( $answer ) {
	$answer = preg_replace( "/\s|\n|<br\/>/", '', trim( $answer ) ); // to replace space, nextline and<br>.
	$answer = preg_replace( '/[^A-Za-z0-9\-]/', '', trim( $answer ) ); // To replace special symbols.
	return $answer;
}

/**
 * Generate report of answer in test
 *
 * @param array $test_detail : Test details of the answer. correct or incorrect.
 * @return string
 */
function getReviewEvalProHtml1( $test_detail ) {
	global $theme;
	$ans_status = $test_detail['answer'] == '1' ? 'correct' : 'Incorrect';
	$theme->assign( 'data', $test_detail );
	$theme->assign( 'answer_status', $ans_status );
	$html = $theme->fetch( dirname( __DIR__ ) . '/clsSMEval/eval_review_html.tpl' );
	return $html;
}

/**
 * Called to evaluate the answer from test
 *
 * @param string  $uxml : xml data.
 * @param integer $isCompiled : isCompiled.
 * @param string  $user_guid : user guid.
 * @param integer $is_hide_table : To show hide the print.
 * @param  array   $test_cases : testcases of the question.
 * @return array
 */
function evalAnsEvalPro( $uxml = '', $isCompiled = -1, $user_guid, $is_hide_table = 1, $test_cases ) {
	$test_detail               = evalGrade( $uxml, $user_guid, $isCompiled, $test_cases );
	$test_detail['hide_table'] = $is_hide_table;
	$ret['answer']             = $test_detail['answer'] == '1' ? true : false;
	$ret['html']               = getReviewEvalProHtml1( $test_detail );
	$ret['uxml']               = $test_detail['uxml'];
	return $ret;
}

/**
 * This function is to reset the user database
 *
 * @param array $data : xml data.
 * @return array
 */
function evalProSqlDBReset( $data ) {
	$where    = array();
	$language = '';
	if ( $data['special_module_user_xml'] ) {
		$XMLNODE          = xml2array( $data['special_module_user_xml'] );
		$language         = $XMLNODE[0]['attributes']['language'];
		$ignore_reset_db         = isset($XMLNODE[0]['attributes']['ignore_reset_db']) ? $XMLNODE[0]['attributes']['ignore_reset_db'] : 0;
		$where['db_name'] = $XMLNODE[0]['attributes']['db_name'];
	} else {
		$language         = $data['language'];
		$where['db_name'] = $data['db_name'];
		$ignore_reset_db         = isset($data['ignore_reset_db']) ? $data['ignore_reset_db'] : 0;
	}
	
	$where['content_guid'] = getGlobalArray( 'data', 'content_guid' );
	if ( ( $language == 'sql' || $language == 'psql' ) && $ignore_reset_db <> '1' ) {
		$where['user_guid'] = $data['user_guid'];
		$where['resetDB']   = $language == 'psql' ? 3 : 1;
		$codeEngineObj      = new codeEngine( $where['user_guid'], $where['db_name'] );
		$where['language']  = $codeEngineObj->getLang( $language );
		$res                = $codeEngineObj->send( $where );
		return $res;
	}
	return 'true';
}

/**
 * Prepare xml for processing data
 *
 * @param array $QXML : xml data.
 * @return array
 */
function parseData( $QXML ) {
	$XMLNODE 				  = xml2array( $QXML );
	$evalPro['lang']          = $XMLNODE[0]['attributes']['language'];
	$evalPro['out_place']     = $XMLNODE[0]['attributes']['out_place'];
	$evalPro['editor'] 	      = everythingInTags( $QXML, 'editor' );
	$evalPro['pre'] 	      = everythingInTags( $QXML, 'pre' );
	$evalPro['post'] 	      = everythingInTags( $QXML, 'post' );
	$evalPro['qmatch']	 	  = everythingInTags( $QXML, 'qmatch' );
	$evalPro['testcases']     = everythingInTags( $QXML, 'testcases' );
	$evalPro['caseDisplay']   = $XMLNODE[0]['attributes']['caseDisplay'];
	$evalPro['disableline']   = isset( $XMLNODE[0]['attributes']['disableline'] ) ? $XMLNODE[0]['attributes']['disableline'] : 0;
	$evalPro['enableline']    = everythingInTags( $QXML, 'enableline' );
	$testcases  			  = everythingInTags( $QXML, 'testcases' );
	$testcases 				  = preg_replace( "/[\n\r]/", '', $testcases );
	$testcases 				  = explode( '</case>', $testcases );
	$testcases[0] 			  = str_replace( '<case>', '', $testcases[0] );
	$testData 	   			  = explode( '|', $testcases[0] );
	$testcasesInput  	 	  = preg_match( '/^(\(|\[|\{|array\()[\s\S]*?(\]|\}|\))$/', $testData[0] ) ? $testData[0] : explode( ',', $testData[0] );
	$testCase['stdin']	      = @strpos( $testcasesInput, "\n" ) !== false ? join( "\n", $testcasesInput ) : $testcasesInput;
	$evalPro['input']         = $testCase['stdin'];
	$evalPro['evalSamOutput'] = $testData[1];
	return $evalPro;
}

/**
 * Generate Answer report in editor area
 *
 * @param sting $uxml : xml data.
 * @return string
 */
function getReport( $uxml ) {
	global $theme;
	$test_output        = everythingInTags( $uxml, 'testoutput' );
	$testoutputArr      = explode( ';', $test_output );
	$result             = everythingInTags( $uxml, 'result' );
	$pre_code           = everythingInTags( $uxml, 'pre' );
	$editor_code        = everythingInTags( $uxml, 'editor' );
	$post_code          = everythingInTags( $uxml, 'post' );
	$resultArr          = explode( ',', $result );
	$testcases          = everythingInTags( $uxml, 'testcases' );
	$testcases          = preg_replace( '/<\/case>[\s\S]*?<case>/m', "\n", $testcases );
	$testcases          = preg_replace( '/<\/case>|<case>/m', '', $testcases );
	$testcases          = trim( $testcases );
	$testcasesArr       = explode( "\n", $testcases );
	$testcase_arraysize = count_uc( $testcasesArr );
	for ( $i = 0; $i < $testcase_arraysize; $i++ ) {
		$testcasesArr[ $i ] = explode( '|', $testcasesArr[ $i ] );
	}
	if ( is_array( $resultArr ) ) {
		$theme->assign( 'pre_code', $pre_code );
		$theme->assign( 'editor_code', $editor_code );
		$theme->assign( 'post_code', $post_code );
		$theme->assign( 'resultCode', $resultArr );
		$theme->assign( 'testcase_array', $testcasesArr );
		$theme->assign( 'userOutput', $testoutputArr );
		$theme->assign( 'testcase_arraysize', $testcase_arraysize );
		$html = $theme->fetch( dirname( __DIR__ ) . '/clsSMEval/eval_get_report.tpl' );
	}
	return $html;
}

/**
 * Function to get the testcases.
 *
 * @param string $content_guid : content guid of the question.
 * @return array
 */
function getTestCases( $content_guid ) {
	$where_c                 = array();
	$where_c['content_guid'] = $content_guid;
	$where_c['columns']      = 'content_text';
	$content_data            = getAPIDataJ( 'cat2.item_content_get', $where_c );
	$content_data            = array_shift( $content_data );
	$content_data            = json_decode_uc( $content_data['content_text'], true );
	$testcases               = everythingInTags( $content_data['special_module_xml'], 'testcases' );
	return $testcases;
};
