import React, { Component } from 'react';
import classes from './Table.css';
import axios from 'axios';
import Spinner from '../../components/UI/Spinner/Spinner';
import TableRow from './TableRow/TableRow';


class Table extends Component {
  state = {
    users: false
  }

  componentDidMount() {
    if (localStorage.getItem('xauth')) {
      axios.get('/usersList', {headers: {'x-auth' : localStorage.getItem('xauth')} }).then( (response) => {
        let users = response.data;
        users.sort( (a,b) => {
          if (a.points > b.points) {
            return -1;
          } else if (a.points < b.points) {
            return 1;
          } else if (a.general > b.general) {
            return -1;
          } else if (a.general < b.general) {
            return 1;
          } else if (a.exact > b.exact) {
            return -1;
          } else if (a.exact < b.exact) {
            return 1;
          } else if (a.exactGoals > b.exactGoals) {
            return -1;
          } else {
            return 1;
          }
        });
        for (let i=0; i<users.length; i++) {
          users[i].rank = i+1;
        }
        this.setState({users: users});
        }).catch((error) => {
          console.log(error);
        })
    }
  }

  userClickedHandler = (id,name) => {
    this.props.history.push({
      pathname: '/user/',
      search: '?id='+encodeURIComponent(id)+'&name='+encodeURIComponent(name)
    });
  }

  render() {
    let table = <Spinner />;

    if (this.state.users) {
      let innerTable = this.state.users.map((user)=>{
        return <TableRow
          key={user.rank}
          rank={user.rank}
          name={user.name}
          points={user.points}
          general={user.general}
          exact={user.exact}
          exactGoals={user.exactGoals}
          clicked={()=>this.userClickedHandler(user._id,user.name)} />
      });
      table = (
        <table className={classes.Table}  align="center">
          <tbody>
            <tr>
              <th>
                Pos.
              </th>
              <th>
                Name
              </th>
              <th>
                Pts.
              </th>
              <th className={classes.SmallHeader}>
                General Predictions
              </th>
              <th className={classes.SmallHeader}>
                Exact Predictions
              </th>
              <th className={classes.SmallHeader}>
                Exact Goals Predicted
              </th>
            </tr>
            {innerTable}
          </tbody>
        </table>
      );
    }
    return (
      <div className={classes.TablePage}>
        {table}
      </div>
    );
  }

}

export default Table;
