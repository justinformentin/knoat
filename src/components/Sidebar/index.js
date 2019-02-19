import React, { PureComponent } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { infoNotify } from '../../utils/notify'
import { ComposeMessage } from "../ComposeMessage";
import { ToastContainer } from 'react-toastify';
import { RenderItems } from './RenderItems'

export class Sidebar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedLabel: props.pathname
    };

    this.navigateToList = this.navigateToList.bind(this);
  }

  navigateToList(evt, labelId) {
    const label = this.props.labelsResult.labels.find(el => el.id === labelId);
    this.props.onLabelClick(label || { id: "" });
  }

  successNotification = () => {
    infoNotify();
  }

  render() {
    return (
      <nav className="d-flex flex-column text-truncate left-panel">
        <div className="compose-panel">
          <div className="d-flex justify-content-center p-2 compose-btn">
            <ComposeMessage
              successNotification={this.successNotification}
              subject=""
              to=""
            >
              <button className="btn purple-btn align-self-center w-75 font-weight-bold">
                Compose
              </button>
            </ComposeMessage>
          </div>
        </div>
        <PerfectScrollbar
          component="ul"
          className="d-flex flex-column border-0 m-0 sidebar"
        >
          <RenderItems
            labelList={this.props.labelsResult.labels}
            navigateToList={this.navigateToList}
          />
          <ToastContainer />
        </PerfectScrollbar>
      </nav>
    );
  }
}
