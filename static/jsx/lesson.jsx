

class ProgressBar extends React.Component {
    constructor()
    {
        super();
    }

    render() {
        return <div id="progress-bar" style={{
            width: this.props.progress * 100 + '%'
        }}></div>
    }
}

class ProblemSection extends React.Component {
    constructor()
    {
        super();
        this.state = {}
    }

    render() {
        return <div id="problem-wrapper">
            {this.props.problem[0]} + {this.props.problem[1]}
        </div>;
    }
}

class HistorySection extends React.Component {
    constructor()
    {
        super();
        this.state = {}
    }

    render() {
        let last_two = this.props.problems.slice(-2);
        last_two.reverse();
        return <div id="history-wrapper">
            {last_two.map((problem) => <div>{problem[0]} + {problem[1]} = {problem[0] + problem[1]}</div>)}
        </div>;
    }
}


class AnswersSection extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    _onClick(event, clicked_answer) {
        event.preventDefault();

        if (clicked_answer === (this.props.problem[0] + this.props.problem[1]))
            this.props.on_correct();
        else
            this.props.on_incorrect();
    }

    render() {
        let answers = [];
        for (let i = 0; i <= this.props.max; i++)
            answers.push(i);

        return <div id="answers-wrapper">
            <div>
            {answers.map((answer) => {
                return (
                    <React.Fragment>
                        <span className="answer" key={answer} onClick={(event) => this._onClick(event, answer)}>
                            {answer}
                        </span>
                    </React.Fragment>
                )
            })}
            </div>
        </div>;
    }
}


class AppUI extends React.Component {
    constructor() {
        super();

        /*$.ajax({
            url: data_url,
            success: (oResponse) => {
                this._load(oResponse);
            },
            error: () => {
                window.alert('Failure!')
            },
            dataType: 'json',
            method: 'GET',
            contentType: 'application/json'
        });*/
        // TODO: do problem generation server-side
        let iVersion = 1;
        let problems = loadFromBrowser('problems', [], iVersion);
        let max_part = 10;
        if (!problems.length)
        {
            let num_problems = 20;
            for (let i = 0; i < num_problems; i++)
                problems.push([this._randInRange(0, max_part), this._randInRange(0, max_part)])
            saveToBrowser('problems', problems, iVersion);
        }
        this._success = new window.Audio(success_url);
        this._failure = new window.Audio(failure_url);
        this.state = {
            'max': max_part,
            'problems': problems,
            'current': loadFromBrowser('current_problem', 0, 1)
        };

        this.asked_for_fullscreen = false;
    }
    _randInRange(min, max)
    {
        let range = max - min;
        return min + Math.floor(Math.random() * (range + 1));
    }

    _onCorrect()
    {
        if (this.state.success)
            return;

        if (!this.asked_for_fullscreen)
        {
            document.body.requestFullscreen();
            this.asked_for_fullscreen = true;
        }

        this._success.play();
        window.setTimeout(() => {
            this._success.pause();
            this._success.currentTime = 0;
        }, 1500);
        this.setState({
            'success': true
        });
        window.setTimeout(() => {
            if (this.state.current === this.state.problems.length-1)
            {
                saveToBrowser('problems', [], 1);
                saveToBrowser('current_problem', 0, 1);
                window.location.reload();
                return;
            }

            saveToBrowser('current_problem', this.state.current + 1, 1);
            this.setState({
                'success': false,
                'current': this.state.current + 1
            });
        }, 500);
    }

    _onIncorrect()
    {
        if (this.state.success)
            return;

        this._failure.play();
    }


    // //////////////// Render
    render() {
        return (
            <React.Fragment>
                <div id="lesson-wrapper" style={{
                    'backgroundColor': this.state.success ? '#287528' : 'transparent'
                }}>
                    <ProgressBar
                        progress={this.state.current / this.state.problems.length}
                    />
                    <ProblemSection
                        problem={this.state.problems[this.state.current]}
                    />
                    <HistorySection
                        problems={this.state.problems.slice(0, this.state.current)}
                    />
                    <AnswersSection
                        max={this.state.max*2}
                        problem={this.state.problems[this.state.current]}
                        on_correct={() => this._onCorrect()}
                        on_incorrect={() => this._onIncorrect()}
                    />

                </div>
                <button id="refresh-btn" onClick={() => window.location.reload() }>Refresh</button>
            </React.Fragment>
        );
    }
}

// ========================================

ReactDOM.render(
  <AppUI />,
  document.getElementById('lesson-wrapper')
);
