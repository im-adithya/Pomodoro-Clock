import React from "react"

var sec
var ss = 2

class Timer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timerSec: 0,
            session: "session"
        }
        this.handleStartStop = this.handleStartStop.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.timerSec = this.timerSec.bind(this)
        this.logger = this.logger.bind(this)
        this.second = this.second.bind(this)
        this.setterone = this.setterone.bind(this)
        this.settertwo = this.settertwo.bind(this)
    }

    second(x) {
        if (x === 1 && this.props.timerMin === 0) {
            return 0
        }
        else if (x === 0) {
            this.props.minHandler((this.props.timerMin) - 1)
            return 59
        }
        else {
            return x - 1
        }
    }

    setterone() {
        this.props.minHandler(this.props.breakLength)
        this.handleStartStop()
    }

    settertwo() {
        this.props.minHandler(this.props.sessionLength)
        this.handleStartStop()
    }

    logger() {
        if (this.props.timerMin === 0 && this.state.timerSec === 0) {
            console.log("done bitch")
            this.audioBeep.play()
            this.audioBeep.currentTime = 0
            clearInterval(sec)
            if (this.state.session === "session") {
                this.setState({
                    timerSec: 0,
                    session: "break"
                })
                setTimeout(this.setterone, 1000)
            }
            else {
                this.setState({
                    timerSec: 0,
                    session: "session"
                })
                setTimeout(this.settertwo, 1000)
            }
            ss = 2

        }
    }

    timerSec() {

        this.setState((prevState) => {
            return { timerSec: this.second(prevState.timerSec) }
        })
        console.log(this.props.timerMin, this.state.timerSec);

        if (this.props.timerMin === 0 && this.state.timerSec === 0) {
            this.logger()
        }
    }

    handleStartStop() {
        if (ss % 2 === 0) {
            sec = setInterval(this.timerSec, 1000)
        }
        else {
            clearInterval(sec)
        }
        ss++
    }

    handleReset = () => {
        this.setState(prevState => {
            return {
                timerSec: 0,
                session: "session"
            }
        })

        this.props.stateHandle(25, 5, 25)
        this.audioBeep.pause()
        this.audioBeep.currentTime = 0
        clearInterval(sec)
        ss = 2
    }

    render() {

        return (
            <div className="tim">
                <div className="timer">
                    <div id="timer-label">{this.state.session}</div>
                    <div id="time-left">
                        <span>{this.props.timerMin === 0 ? "00" : this.props.timerMin < 10 ? "0" + this.props.timerMin.toString() : this.props.timerMin.toString()}</span>
                        <span>:</span>
                        <span>{this.state.timerSec === 0 ? "00" : this.state.timerSec < 10 ? "0" + this.state.timerSec : this.state.timerSec}</span>
                    </div>
                </div>

                <div className="controls">
                    <span onClick={this.handleStartStop} id="start_stop">Start/Stop</span>
                    <span onClick={this.handleReset} id="reset">Reset</span>
                </div>

                <audio
                    id="beep"
                    preload="auto"
                    src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
                    ref={(audio) => {
                        this.audioBeep = audio;
                    }}
                />
            </div>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timerMin: 25,
            breakLength: 5,
            sessionLength: 25
        }
    }

    handleTimerMin = (x) => {
        if (x >= 0) {
            this.setState({
                timerMin: x
            })
        }
        else {
            this.setState({
                timerMin: 0
            })
        }
    }

    handleState = (one, two, three) => {
        this.setState({
            timerMin: one,
            breakLength: two,
            sessionLength: three
        })
    }

    handleBreakInc = () => {
        this.setState(prevState => {
            if (prevState.breakLength === 60) {
                return {
                    breakLength: 60,
                }
            }
            else {
                return {
                    breakLength: prevState.breakLength + 1
                }
            }
        })
    }

    handleBreakDec = () => {
        this.setState(prevState => {
            if (prevState.breakLength === 1) {
                return {
                    breakLength: 1
                }
            }
            else {
                return {
                    breakLength: prevState.breakLength - 1
                }
            }
        })
    }

    handleSessionInc = () => {
        this.setState(prevState => {
            if (prevState.sessionLength === 60) {
                return {
                    sessionLength: 60,
                    timerMin: 60
                }
            }
            else {
                return {
                    sessionLength: prevState.sessionLength + 1,
                    timerMin: prevState.timerMin + 1
                }
            }
        })
    }

    handleSessionDec = () => {
        this.setState(prevState => {
            if (prevState.sessionLength === 1) {
                return {
                    sessionLength: 1,
                    timerMin: 1
                }
            }
            else {
                return {
                    sessionLength: prevState.sessionLength - 1,
                    timerMin: prevState.timerMin - 1
                }
            }
        })
    }

    render() {
        return (
            <div>
                <div className="bs">
                    <div className="break ses">
                        <div id="break-label">Break Length</div>
                        <button onClick={this.handleBreakInc.bind(this)} id="break-increment">up</button>
                        <span id="break-length">{this.state.breakLength}</span>
                        <button onClick={this.handleBreakDec.bind(this)} id="break-decrement">down</button>
                    </div>
                    <div className="session ses">
                        <div id="session-label">Session Length</div>
                        <button onClick={this.handleSessionInc.bind(this)} id="session-increment">up</button>
                        <span id="session-length">{this.state.sessionLength}</span>
                        <button onClick={this.handleSessionDec.bind(this)} id="session-decrement">down</button>
                    </div>
                </div>
                <Timer
                    timerMin={this.state.timerMin}
                    breakLength={this.state.breakLength}
                    sessionLength={this.state.sessionLength}
                    stateHandle={this.handleState}
                    minHandler={this.handleTimerMin} />

            </div>
        )
    }

}

export default App