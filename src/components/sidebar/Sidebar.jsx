import React, { PureComponent } from "react";
import { infoNotify } from '../notifications/notify'

import ComposeMessage from "../compose-message/ComposeMessage";
import PerfectScrollbar from "react-perfect-scrollbar";
import { ToastContainer } from 'react-toastify';

import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";

import "../notifications/notify.scss"
import "./sidebar.scss";
import { RenderCategories } from "./renders/RenderCategories";
import { RenderFolders } from "./renders/RenderFolders";
import { RenderLabels } from "./renders/RenderLabels";

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

  renderItems(labelList) {
    if (labelList.length === 0) {
      return <div />;
    }

    const labels = labelList.reduce((acc, el) => {
      acc.push(el);
      return acc;
    }, []);

    const labelGroups = groupBy(labels, "type");

    const visibleLabels = labelGroups.user.filter(
      el =>
        !el.labelListVisibility || true
    );

    const sortedLabels = sortBy(visibleLabels, "name");

    return (
      <React.Fragment>
        <RenderFolders
          labels={labelGroups.system}
          navigateToList={this.navigateToList}
        />
        <RenderCategories
          labels={labelGroups.system}
          navigateToList={this.navigateToList}
        />
        <RenderLabels
          labels={sortedLabels}
          navigateToList={this.navigateToList}
        />
      </React.Fragment>
    );
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
          {this.renderItems(this.props.labelsResult.labels)}
          <ToastContainer />
        </PerfectScrollbar>
      </nav>
    );
  }
}

export default Sidebar;
