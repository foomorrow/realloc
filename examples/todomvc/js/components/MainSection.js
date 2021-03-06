
import React, {Component, PropTypes} from 'react'
import TodoItem from './TodoItem'

import {toggleAllCompleted} from '../actions'
import {visibilityFilters} from '../constants'


export default class MainSection extends Component {
  constructor(props, context){
    super(props, context)
    this._onToggleCompleteAll = this._onToggleCompleteAll.bind(this)
  }
  _onToggleCompleteAll(){
    toggleAllCompleted()
  }
  render(){
    let {allTodos, visibility} = this.props;
    if (allTodos.length < 1) {
      return null;
    }
    let predict = visibilityFilters[visibility] || visibilityFilters['all']
    return (
      <section className="main">
        <input
          className="toggle-all"
          type="checkbox"
          onChange={this._onToggleCompleteAll}
          defaultChecked={allTodos.every((t) => t.completed)}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {
            allTodos.filter(predict).map((todo) => {
              return (
                <TodoItem key={todo.id} todo={todo} />
              )
            })
          }
        </ul>
      </section>
    )
  }
}
