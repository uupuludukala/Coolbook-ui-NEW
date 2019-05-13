import React from "react";
import "bootstrap/dist/css/bootstrap.css";
class NumberPad extends React.Component {
  render() {
    return (
      <div>
        <div className="container py-4">
          <div className="row">
            <div className="col-auto mx-auto bg-white rounded shadow">
              <div
                className="btn-group-vertical mx-1 my-1"
                role="group"
                aria-label="Basic example"
              >
                <div className="btn-group btn-group-lg">
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-bottom-10 rounded-0"
                  >
                    1
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-bottom-0"
                  >
                    2
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-bottom-0 rounded-0"
                  >
                    3
                  </button>
                </div>
                <div className="btn-group btn-group-lg">
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-bottom-0 rounded-0"
                  >
                    4
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-bottom-0"
                  >
                    5
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-bottom-0 rounded-0"
                  >
                    6
                  </button>
                </div>
                <div className="btn-group btn-group-lg">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-0"
                  >
                    7
                  </button>
                  <button type="button" className="btn btn-outline-secondary">
                    8
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-0"
                  >
                    9
                  </button>
                </div>
                <div className="btn-group btn-group-lg">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-0"
                  >
                    *
                  </button>
                  <button type="button" className="btn btn-outline-secondary">
                    0
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-0"
                  >
                    <span className="small">#</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default NumberPad;
