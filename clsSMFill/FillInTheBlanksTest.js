import React from 'react';
var self;
export default class FillInTheBlanksTest extends React.Component {
	constructor(props) {
		super(props);
		this.checkAns = this.checkAns.bind(this);
		this.state = this.props.passState;

	}
	checkAns() {
		console.log(this.props.correctAns[0][0]);
		console.log($('#mm').find('#0').val());
		if(this.props.correctAns[0][0] == $('#mm').find('#0').val()) 
		{
			console.log("Correct");
		}else{
			console.log("Incorrect");
		}
	}
	render() {
		//console.log(this.props.text)
		return(
			<div>
			<div>Title {this.props.title}</div>
			<div>Stem {this.props.stem}</div>
			<div style={{lineHeight:"40px"}} id="mm"></div>
			<button type="button" onClick={this.checkAns}>Check Answer</button>
			</div>
		);
	}
}