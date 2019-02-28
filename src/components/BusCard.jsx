import React, { Component } from "react";
import BusStop from "./BusStop";
import ls from "local-storage";

class BusCard extends Component {
  state = {
    nearbyCode: []
  };

  componentDidMount() {
    fetch(
      "https://busg-232902.appspot.com/api/nearby?userLat=" +
        this.props.userLat +
        "&userLon=" +
        this.props.userLon
    )
      .then(response => response.json())
      .then(data => {
        let sortable = [];
        for (let distance in data) {
          sortable.push([distance, data[distance]]);
        }

        sortable.sort(function(a, b) {
          return a[1] - b[1];
        });

        let nearbyCode = sortable.map(e => {
          return e[0];
        });
        if (ls.get("favourites")) {
          let favsString = ls.get("favourites");
          let favsData = favsString.split(",");
          favsData.map(e => {
            nearbyCode.unshift(e.toString());
          });
          let uniq = [...new Set(nearbyCode)];
          this.setState({
            nearbyCode: uniq
          });
        } else {
          this.setState({
            nearbyCode
          });
        }
      });
  }
  render() {
    return (
      <div className="container bus-card">
        {this.state.nearbyCode.map(e => {
          return <BusStop stopID={e} />;
        })}
      </div>
    );
  }
}

export default BusCard;
