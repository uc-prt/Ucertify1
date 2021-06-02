import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import l from '../lib/Lang';

var self;
var helpArr = [];
helpArr[9] = "03ALw";
helpArr[0] = helpArr[1] = "03ALw";
export default class Help extends React.Component {
	constructor(props) {
	    super(props);
	    self = this;
	    this.state = {
	      open: false,
	      showHelp : ""
	    };
	}
	componentDidMount() {
		setTimeout(function() {
		//GET CONTENT 
		}.bind(this),200);
	}
	componentWillReceiveProps (nextProps) {
		if(this.props.helpToggle != nextProps.helpToggle) {
			this.setState({open:nextProps.helpToggle,showHelp:""});
		    setTimeout(function(){
			    if(helpArr[self.props.content_subtype]) {
				    $('#showHelp').show();
				    $('.help_modal').css({"padding-top":window.innerHeight/30});
			    	$.ajax({
			                url: baseUrl+'editor/index.php',
			                cache: false,
			                data: {ajax:1,action:"get_help",content_guid : content_guid},                         
			                type: 'post',
			                success: function(response) {
			                	$('#process').hide();
			                	$('.help_modal').css({"padding-top":window.innerHeight/40});
			                	var response = JSON.parse(response);
			                	self.setState({showHelp:response.content});
			    	    }
					});
				}
			}.bind(this),200);
		}
	}
	handleClose() {
		self.props.closeHelpDialog(false);
		$('#showHelp').hide();
		self.setState({open: false});	
	}
	getGuidByModule() {

	}
	render() {
	    const actions = [
	      <FlatButton
	        label="Close"
	        primary={true}
	        onClick={this.handleClose.bind(this)}
	      />	    
	    ];
	    return (
		    <div>
		        <Dialog
		          title={<div style={{height:"30px",backgroundColor:"rgb(0, 188, 212)",color:"#fff"}}><div style={{bottom:"15px",position:"relative"}}>Help</div></div>}
		          actions={actions}
		          class="help_modal"
		          contentStyle={{width:'100%',maxWidth:'90%',maxHeight:'100%'}}
		          style={{minHeight:"200px"}}
		          modal={false}
		          open={this.state.open}
		          onRequestClose={this.handleClose.bind(this)}
		          autoScrollBodyContent={true}
		        >
		        	<div id="showHelp" style={{minWidth:"500px",minHeight:"200px",margin:"25px 15px","display":"none"}}>
		        		<center id="process">
				        	<CircularProgress size={60} thickness={2} />
				        	<h3>{l.getting_help}</h3>
				        </center>
				        <div style={{minHeight:"200px"}} dangerouslySetInnerHTML={createMarkup(this.state.showHelp)}></div>
		        	</div>
		        </Dialog>
	       	</div>
	    );
	}
}