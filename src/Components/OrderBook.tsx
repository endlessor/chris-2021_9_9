import React, { Component } from "react";
import AskOrder from "./AskOrder";
import BidOrder from "./BidOrder";

type OrderType = {
  price: number;
  quantity: number;
};

type MainProps = {
  askOrders: Array<OrderType>;
  bidOrders: Array<OrderType>;
};

type OrderwithTotalType = {
  quantity: number;
  price: number;
  cumulative: number;
  maxCumulative: number;
};

class OrderBook extends Component<MainProps> {
  render() {
    function sumQuantities(orders: Array<OrderType>): number {
      return orders.reduce((total, order) => total + order.quantity, 0);
    }

    let totalAsks: number = sumQuantities(this.props.askOrders);
    let totalBids: number = sumQuantities(this.props.bidOrders);
    let maxCumulative: number = Math.max(totalAsks, totalBids);

    let deepCopyArrayOfObj = (arr: Array<OrderType>): Array<OrderType> =>
      arr.map((order) => Object.assign({}, order));

    // Deep copy and sort orders
    let askOrders: Array<OrderType> = deepCopyArrayOfObj(
      this.props.askOrders
    ).sort((a, b): number => {
      if (a.price > b.price) return 1;
      return -1;
    }); // ascending order
    let bidOrders: Array<OrderType> = deepCopyArrayOfObj(
      this.props.bidOrders
    ).sort((a, b) => {
      if (a.price < b.price) return 1;
      return -1;
    }); // descending order

    function renderOrders(ComponentClass: any, orders: Array<OrderType>) {
      let cumulative: number = 0;
      return orders.map((order, index) => {
        const ord: OrderwithTotalType = {
          quantity: order.quantity,
          price: order.price,
          cumulative: (cumulative += order.quantity),
          maxCumulative: maxCumulative,
        };
        return <ComponentClass key={index} {...ord} />;
      });
    }

    return (
      <div className="OrderBook">
        <h4 style={{ color: "white" }}>
          <b>OrderBook</b>
        </h4>
        <div className="order-tables">
          <table>
            <thead>
              <tr>
                <th>TOTAL</th>
                <th>SIZE</th>
                <th>PRICE</th>
              </tr>
            </thead>
            <tbody>{renderOrders(BidOrder, bidOrders)}</tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>PRICE</th>
                <th>SIZE</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>{renderOrders(AskOrder, askOrders)}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default OrderBook;
