import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';

import './SeekerReg.css'
const seeker = require('../../images/seeker.png')


class SeekerReg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first:'',
      last:'',
      password:'',
      picture_url:'',
      description:'',
      email: '',
      clicked:false
    }
    this.handleChangebySetState=this.handleChangebySetState.bind(this);
    this.handleSubmitbyPost=this.handleSubmitbyPost.bind(this);
  }

  handleChangebySetState = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  
  handleSubmitbyPost = (event) => {
    event.preventDefault();
    const {first, last, password, picture_url, description, email } = this.state;
    const name = first.concat(" ",last);
    const data = { name, password, picture_url, description, email };
    const success = this.props.handleReg(data);
    this.setState({
      first:'',
      last:'',
      password:'',
      picture:'',
      description:'',
      email: ''
    })
    if(success){
      this.setState({
        clicked:true
      })
      setTimeout(()=>{
        this.props.history.push('/seeker/browse')
      },1200);
    }
  }

  render(){
    return (
      <div id="seekerReg">
        <div
            id="seekerRegSeekerWord"
            style={
              this.state.clicked?(
                {
                  left:"-20%",
                  opacity:"0"
                }
              ):(
                {left:"30%"}
              )
            }
          >Seeker
        </div>
        <img
            id="genSeekerImage"
            src={seeker}
            style={
              this.state.clicked?(
                {
                  left:"-37%",
                  opacity:"0"
                }
              ):(
                {left:"13%"}
              )
            }
          />
          <div
            id="seekerRegReg"
            style={
              this.state.clicked?(
                {
                  right:"-20%",
                  opacity:"0"
                }
              ):(
                {right:"30%"}
              )
            }
          >Create An Account</div>
          <form
            id="seekerRegForm"
            style={
              this.state.clicked?(
                {
                  right:"-20%",
                  opacity:"0"
                }
              ):(
                {right:"30%"}
              )
            }
          >
            <input 
              name='first'
              placeholder='First Name'
              value={this.state.first} 
              onChange={this.handleChangebySetState} 
            />
            <br />
            <input 
              name='last'
              placeholder='Last Name'
              value={this.state.last} 
              onChange={this.handleChangebySetState} 
            />
            <br />
            <input 
              name='password'
              type='password'
              placeholder='Password'
              value={this.state.password} 
              onChange={this.handleChangebySetState} 
            />
            <br />
            <input 
              name='picture_url'
              placeholder='Picture'
              value={this.state.picture_url} 
              onChange={this.handleChangebySetState} 
            />
            <br />
            <input 
              name='description'
              placeholder='Description'
              value={this.state.description} 
              onChange={this.handleChangebySetState} 
            />
            <br />
            <input 
              name='email'
              placeholder='Email'
              value={this.state.email} 
              onChange={this.handleChangebySetState} 
            />
            <br />
            <button
              id="seekerRegSubmit"
              onClick={(event) => this.handleSubmitbyPost(event)}>
              Start Looking!
            </button>
          </form>
      </div>
    );
  }
}
export default withRouter(SeekerReg);