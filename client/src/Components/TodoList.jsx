import React from 'react'
import axios from 'axios'
import { Component } from 'react';


let endpoint = "http://localhost:6969"

class TodoList extends Component{
    constructor(props) {
        super(props);

        this.state = {
            task: "",
            items: [],
        };
    }
    TodoDidMount() {
        this.getTask()
    }

    onChange = (event) => {
        this.SetState({
            [event.target.name] : event.target.value
        })
    }


    render() {
        return (
            <div>
                
            </div>
        )
    }
}


export default TodoList