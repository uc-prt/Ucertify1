<?php
/**
 *  Filename    : code-engine.php
 *
 *  @author     : Prabhat Kumar <prabhat.kumar@ucertify.com>
 *  @version    : 1.0
 *  @package    : code-engine
 *  Interface file for code compiler
 * Updated By   : Prabhat Kumar
 * Updated Date : 10-Aug-2020
 */

// define('EVAL_URL', 'http://66.220.10.174:2021/online_compiler/index.php');     // Evalpro Testing server.
//define('EVAL_URL', 'http://72.52.75.194:2025/online_compiler/index.php');     // Evalpro h0 server.
define( 'EVAL_URL', 'http://72.52.75.194:2021/online_compiler/index.php' );  // New Evalpro backup server
// define( 'EVAL_URL', 'http://72.52.75.205:3031/online_compiler/index.php' ); // Evalpro Production backup server.
// define( 'EVAL_URL', 'http://72.52.75.205:2021/online_compiler/index.php' );   // Evalpro Production server.

/**
 * Class for the code engine.
 */
class codeEngine {
	/**
	 * Variable: access token.
	 *
	 * @var string
	 */
	protected $access_token;

	/**
	 * Variable: default language.
	 *
	 * @var integer : language id.
	 */
	public $language_id = 1;

	/**
	 * Variable: url of web service.
	 *
	 * @var string : base url
	 */
	protected $baseurl = '';

	/**
	 * Variable: database name.
	 *
	 * @var string : database name.
	 */
	public $db_name = 'myDBs';

	/**
	 * Variable: User guid
	 *
	 * @var boolean : in case of not given user guid.
	 */
	public $user_guid = false;

	/**
	 * Constructor function.
	 *
	 * @param string $user_guid : user guid.
	 * @param string $db_name : database name.
	 */
	public function __construct( $user_guid = '', $db_name = 'myDBs' ) {
		$this->user_guid    = $user_guid;
		$this->db_name      = $db_name;
		$this->baseurl      = EVAL_URL;
		$this->access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJBUElLZXkiOiIwRkk1LTM0RlctNDVUNS04N0tFIn0.6KzGt9aiIjkk-a9M8OXXBpazqEs5E7WodqMKoo7ciow';
	}

	/**
	 * Set default language.
	 *
	 * @param  integer $language id of the language.
	 */
	public function setLanguageId( $language ) {
		$this->language_id = $language;
	}

	/**
	 * Function to get the language id from language name given.
	 *
	 * @param string  $language : language name.
	 * @param boolean $all : all language name.
	 * @return integer
	 */
	public function getLang( $language, $all = false ) {
		$lang_list            = array();
		$lang_list['php']     = 1;
		$lang_list['python']  = 2;
		$lang_list['python3'] = 3;
		$lang_list['perl']    = 4;
		$lang_list['c']       = 5;
		$lang_list['c++']     = 6;
		$lang_list['java']    = 7;
		$lang_list['c#']      = 8;
		$lang_list['node.js'] = 9;
		$lang_list['ruby']    = 10;
		$lang_list['sql']     = 11;
		$lang_list['MSSQL']   = 12;
		$lang_list['psql']    = 13;
		$lang_list['r']       = 14;
		$default_language     = $lang_list['php'];

		if ( $all ) {
			return $lang_list;
		}

		$ret = $lang_list[ $language ];
		if ( $ret ) {
			return $ret;
		}
		return $default_language;
	}

	/**
	 * Function to execute the code on compiler.
	 *
	 * @param array   $cdata : send array data to compiler.
	 * @param integer $is_remove_none : is remove or not.
	 * @return array
	 */
	public function execute( $cdata, $is_remove_none = 1 ) {
		$lang = $this->getLang( $cdata['repltype'] );
		if ( $lang > 0 ) {
			$this->setLanguageId( $lang );
		}
		if ( $cdata['db_name'] <> '' ) {
			$this->db_name = $cdata['db_name'];
		}

		$content_guid = getGlobalArray( 'data', 'content_guid' );
		$data         = array(
			'source_code'  => $this->get( $cdata['code'], '' ),
			'input'        => $this->get( $cdata['stdin'], '' ),
			'language'     => intval( $this->language_id ),
			'access_token' => $this->access_token,
			'user_guid'    => $this->user_guid,
			'db_name'      => $this->db_name,
			'content_guid' => $content_guid,
			'is_graph'     => isset( $cdata['is_graph'] ) ? $cdata['is_graph'] : 0,
		);
		
		$res = $this->send( $data, 'POST' );
		$ret = json_decode( $res, true );
		
		if ( $cdata['ignore_error'] == '1' && $ret['output'] <> '' ) {
			$ret['status_message'] = 'Successful';
		}
		// @prabhat: Need to update the logs for query and query output, in case of any error.
		if ( $ret['status_message'] <> 'Successful' ) {
			$where = array();
			unset( $data['access_token'] );
			$where['redis_key']   = 'eval:' . $data['user_guid'] . ':' . $content_guid . ':' . time();
			$where['redis_value'] = 'func: ' . $cdata['func'] . ', query: ' . json_encode( $data ) . ', output: ' . $res;
			$where['expiry']      = date( 'Y-m-d G:i:s', time() + ( 3 * 86400 ) ); // Expiry time for 3 days.
			getAPIDataJ( 'cat2.ucertify_redis_data_update', $where );
		}
		// To remove the file name from the error code in case of python.
		if ( ( $data['language'] == 2 || $data['language'] == 3 ) && $ret['stderr'] <> '' ) {
			$start_str     = 'File ';
			$end_str       = 'py", ';
			$match_str     = findtextnew_withouttrim( $ret['stderr'], $start_str, $end_str );
			$match_str     = $start_str . $match_str . $end_str;
			$ret['stderr'] = str_replace( $match_str, '', $ret['stderr'] );
		}
		// In case of return when print is written the None is coming as default so remove that values.
		if ( $is_remove_none == '1' && $cdata['repltype'] == 'python' && preg_match( '/None$/', $ret['output'] ) ) {
			$ret['output'] = str_replace( 'None', '', $ret['output'] );
		}
		$ret['output'] = $data['language'] == '13' ? $this->compressHtmlcode( $ret['output'] ) : $ret['output'];
		return $ret ? $ret : 'ERROR: timeout or other exception';
	}

	/**
	 * Function to compress the html code.
	 *
	 * @param string $codedata : output get from compiler.
	 * @return string
	 */
	public function compressHtmlcode( $codedata ) {
		$searchdata = array(
			'/\>[^\S ]+/s', // remove whitespaces after tags.
			'/[^\S ]+\</s', // remove whitespaces before tags.
			'/(\s)+/s', // remove multiple whitespace sequences.
			'/(&nbsp;)/s',
		);

		$replacedata = array( '>', '<', '\\1' );
		$codedata    = preg_replace( $searchdata, $replacedata, $codedata );
		return $codedata;
	}

	/**
	 * Function to send the code to compiler.
	 *
	 * @param array  $data : global data array.
	 * @param string $type : type of the form data method.
	 * @return string
	 */
	public function send( $data = array(), $type = 'POST' ) {
		// Remove this code later.
		// if ( ($data['language'] == '14' || $data['is_graph'] == '1') ) {
		// $this->baseurl = 'http://66.220.10.174:2021/online_compiler/index.php';
		// }
		// if ( ($data['language'] == '11' ) ) { // For mysql
		// $this->baseurl = 'http://72.52.75.194:2021/online_compiler/index.php';
		// }
		$options = array(
			'http' => array(
				'method'  => $type,
				'content' => http_build_query( $data ),
			),
		);
		$context = stream_context_create( $options );
		$response = @file_get_contents( $this->baseurl, false, $context );
		$http_response_header_val = ucIsset( $http_response_header[0] ) ? substr( $http_response_header[0], 9, 3 ) : '';
		if ( $http_response_header_val <> 200 || $response === false) {
			$extra_info = " R:" . $http_response_header_val . ' U:' . $data['user_guid'] . ' C:' . $data['content_guid'] . ' T:' . date("H:i:s");
			storeModuleError('EP', '-10', $extra_info);
			$ret['status_message'] = 'Error';
			$ret['output'] = 'ERROR: timeout or other exception';
			$ret['stderr'] = 'Unable to execute the command. Please try again.';
			$ret['time'] = '0';
			$response = json_encode($ret);
		}
		return $response;
	}

	/**
	 * Function to return the value if set.
	 *
	 * @param array  $var : array variable.
	 * @param string $val : value.
	 * @return array
	 */
	private function get( $var, $val ) {
		if ( isset( $var ) ) {
			return $var;
		}
		return $val;
	}
}