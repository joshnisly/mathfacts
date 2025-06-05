

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


class AnswersSection extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    _onClick(clicked_answer) {
        if (clicked_answer === (this.props.problem[0] + this.props.problem[1]))
            this.props.on_correct();
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
                        <span className="answer" key={answer} onClick={() => this._onClick(answer)}>
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
        let num_problems = 20;
        let max_part = 10;
        let problems = [];
        for (let i = 0; i < num_problems; i++)
        {
            problems.push([this._randInRange(0, max_part), this._randInRange(0, max_part)])
        }
        this.state = {
            'max': max_part,
            'problems': problems,
            'current': 0
        };
    }
    _randInRange(min, max)
    {
        let range = max - min;
        return min + Math.floor(Math.random() * (range + 1));
    }

    _onCorrect()
    {
        this.setState({
            'current': this.state.current + 1
        });
    }


    // //////////////// Render
    render() {
        return (
            <div>
                <ProgressBar
                    progress={this.state.current / this.state.problems.length}
                />
                <ProblemSection
                    problem={this.state.problems[this.state.current]}
                />
                <AnswersSection
                    max={this.state.max*2}
                    problem={this.state.problems[this.state.current]}
                    on_correct={() => this._onCorrect()}
                />
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
  <AppUI />,
  document.getElementById('lesson-wrapper')
);
