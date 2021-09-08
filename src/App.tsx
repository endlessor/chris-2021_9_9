import React, { Component } from "react";
import OrderBook from "./Components/OrderBook";
import "./App.css";

const tickers: string[] = ["XBTUSD", "ETHUSD"];
const actions: string[] = ["subscribe", "unsubscribe"];
const tickerFeed: string = "book_ui_1";

type OrderType = {
  price: number;
  quantity: number;
};

type MainState = {
  instrument: string;
  askOrders: Array<OrderType>;
  bidOrders: Array<OrderType>;
  loading: boolean;
};

type MessageType = {
  feed: string;
  bids: Array<Array<number>>;
  asks: Array<Array<number>>;
  product_id: string;
};

class App extends Component<{}, MainState> {
  state: MainState = {
    instrument: tickers[0],
    askOrders: [],
    bidOrders: [],
    loading: true,
  };

  socket: WebSocket = new WebSocket("wss://www.cryptofacilities.com/ws/v1");

  componentDidMount = (): void => {
    // Connection opened
    this.socket.addEventListener("open", () => {
      this.socket.send(
        JSON.stringify({
          event: actions[0],
          feed: tickerFeed,
          product_ids: [`PI_${tickers[0]}`],
        })
      );
      this.setState({ loading: false });
    });
    // Listen for messages
    this.socket.addEventListener("message", (event) => {
      this.handleData(event.data);
    });
  };

  handleData = (rawData: string): void => {
    const { askOrders, bidOrders } = this.state;
    const showNum: number = 15;
    let data: MessageType = JSON.parse(rawData);
    if (data.feed !== tickerFeed) {
      return;
    }

    data.asks = data.asks || [];
    data.bids = data.bids || [];

    let newAsks: Array<OrderType> = data.asks.map((ask) => ({
      price: ask[0],
      quantity: ask[1],
    }));

    let newBids: Array<OrderType> = data.bids.map((bid) => ({
      price: bid[0],
      quantity: bid[1],
    }));

    const nasks: Array<OrderType> = [...askOrders, ...newAsks];
    const nbids: Array<OrderType> = [...bidOrders, ...newBids];

    this.setState({
      askOrders: nasks.slice(Math.max(nasks.length - showNum, 0)),
      bidOrders: nbids.slice(Math.max(nbids.length - showNum, 0)),
    });
  };

  onToggleFeed = () => {
    const { instrument } = this.state;
    this.socket.send(
      JSON.stringify({
        event: actions[1],
        feed: tickerFeed,
        product_ids: [`PI_${instrument}`],
      })
    );
    const newInstr: string =
      instrument === tickers[0] ? tickers[1] : tickers[0];
    this.socket.send(
      JSON.stringify({
        event: actions[0],
        feed: tickerFeed,
        product_ids: [`PI_${newInstr}`],
      })
    );
    this.setState({ instrument: newInstr });
  };

  render() {
    const { loading } = this.state;
    return (
      <div className="App">
        <h1 className="instrument">{this.state.instrument}</h1>
        {loading && (
          <div className="toggle-block">
            <h3>
              <b>Loading...</b>
            </h3>
          </div>
        )}
        {!loading && (
          <React.Fragment>
            <OrderBook
              askOrders={this.state.askOrders}
              bidOrders={this.state.bidOrders}
            />
            <div className="toggle-block">
              <button onClick={this.onToggleFeed}>Toggle Feed</button>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default App;
