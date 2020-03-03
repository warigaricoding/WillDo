/** @jsx React.DOM */
var path = require('path');

module.exports = {
    entry: './src/main/js/app.js',
    devtool: 'sourcemaps',
    cache: true,
    mode: 'development',
    output: {
        path: (__dirname),
        filename: './src/main/resources/static/built/bundle.js'
    },
    modules: {
        rules: [
            {
                test: path.join(__dirname, '.'),
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }]
            }
        ]
    }
};
const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {task: []};
    }
    componentDidMount() {
        client({method: 'GET', path: '/tasks'}).done(response =>{
           this.setState({task: response.entity._embedded.task})
        });
    }
    render() {
        return (
            <TaskList task = {this.state.task}/>
        )
    }
}
class TaskList extends React.Component{
    render() {
        const task = this.props.task.map(task =>
            <Task key ={task._links.self.href} task={task}/>
        );
        return (
            <table>
                <tbody>
                    <tr>
                        <th>Summary</th>
                        <th>Description</th>
                        <th>Date</th>
                    </tr>
                    {task}
                </tbody>
            </table>
        )
    }
}


