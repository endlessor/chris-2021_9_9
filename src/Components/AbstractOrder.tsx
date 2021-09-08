import { Component } from "react";

type MainProps = {
  price: number;
  cumulative: number;
  maxCumulative: number;
  quantity: number;
};

class AbstractOrder extends Component<MainProps> {
  getPercentage(): number {
    let fillPercentage: number =
      (this.props.maxCumulative
        ? this.props.cumulative / this.props.maxCumulative
        : 0) * 100;
    fillPercentage = Math.min(fillPercentage, 100); // Percentage can't be greater than 100%
    fillPercentage = Math.max(fillPercentage, 0); // Percentage can't be smaller than 0%
    return fillPercentage;
  }
}

export default AbstractOrder;
