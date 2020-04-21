import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
  
class Die extends React.Component {
    /* Add cube animations to all cubes and attach to radio buttons. */
    constructor(props) {
        super(props);
        this.index = props.index;
    }

    changeSide() {
        var cube = document.querySelectorAll('.cube');
        var pick = document.querySelectorAll('.pick-face')[this.index].value;    
        var showClass = 'show-' + pick;

        cube[this.index].classList = '';
        cube[this.index].classList.add('cube', showClass);
    }

    render() {
        return (
        <div className="col-2">
            <div className="scene" >
                <div className="cube show-A">
                    <div className="cube__face cube__face--front">A</div>
                    <div className="cube__face cube__face--back">9</div>
                    <div className="cube__face cube__face--right">K</div>
                    <div className="cube__face cube__face--left">10</div>
                    <div className="cube__face cube__face--top">Q</div>
                    <div className="cube__face cube__face--bottom">J</div>
                </div>
            </div>
            <select className="pick-face" onChange={this.changeSide.bind(this)}>
                <option name="rotate-cube-side0" value="A">A</option>
                <option name="rotate-cube-side0" value="K">K</option>
                <option name="rotate-cube-side0" value="Q">Q</option>
                <option name="rotate-cube-side0" value="J">J</option>
                <option name="rotate-cube-side0" value="10">10</option>
                <option name="rotate-cube-side0" value="9">9</option>
            </select>
        </div>
        )
    }
}

class Results extends React.Component {
    constructor(props) {
        super(props)
        this.index = props.index
        this.stats = {};
    }

    // Changes roll from ['A', 'A', 'A', 'A', 'A'] to [5, 0, 0, 0, 0, 0]
    countHand(roll) {
        let dieResults = [0, 0, 0, 0, 0, 0]
        for (let i in roll) {
            if (roll[i] === 'A')
                dieResults[0] +=  1
            if (roll[i] === 'K')
                dieResults[1] += 1
            if (roll[i] === 'Q')
                dieResults[2] += 1
            if (roll[i] === 'J')
                dieResults[3] += 1
            if (roll[i] === '10')
                dieResults[4] += 1
            if (roll[i] === '9')
                dieResults[5] += 1
        }
        return dieResults
    }

    // Check how many times a face appeared on a die, compliments checkHand
    checkNumOcurrences(dieResults, num) {
        for (let i = 0; i < 6; i++) {
            if (dieResults[i] === num) {
                return i
            }
        }
        return -1
    }
    
    // Auxiliary check to pairs in checkHand
    checkTwoPairs(dieResults, firstPair) {
        for (let i = firstPair + 1; i < 6; i++) {
            if (dieResults[i] === 2) {
                return i
            }
        }
        return -1
    }

    // Returns result string
    checkHand(dieResults) {
        let result = this.checkNumOcurrences(dieResults, 5)
        if (result > -1) {
            return 'QUINTILLA'
        }

        result = this.checkNumOcurrences(dieResults, 4)
        if (result > -1) {
            return 'POKER'
        }

        result = this.checkNumOcurrences(dieResults, 3)
        if (result > -1) {
            let fullCheck = this.checkNumOcurrences(dieResults, 2)
            if (fullCheck > -1) {
                return 'FULL'
            } else {
                return 'TERCIA'
            }
        }

        result = this.checkNumOcurrences(dieResults, 2)
        if (result > -1) {
            let twoPair = this.checkTwoPairs(dieResults, result)
            if (twoPair > -1) {
                return 'TWO PAIR'
            } else {
                return 'PAIR'
            }                
        }
        return 'PACHUCA'
    }

    checkHandPop(dieResults, resulting_hands) {
        let result = this.checkNumOcurrences(dieResults, 5)
        if (result > -1) {
            resulting_hands['QUINTILLA'] += 1
            return
        }

        result = this.checkNumOcurrences(dieResults, 4)
        if (result > -1) {
            resulting_hands['POKER'] += 1
            return
        }

        result = this.checkNumOcurrences(dieResults, 3)
        if (result > -1) {
            let fullCheck = this.checkNumOcurrences(dieResults, 2)
            if (fullCheck > -1) {
                resulting_hands['FULL'] += 1
            } else {
                resulting_hands['TERCIA'] += 1
            }
            return
        }

        result = this.checkNumOcurrences(dieResults, 2)
        if (result > -1) {
            let twoPair = this.checkTwoPairs(dieResults, result)
            if (twoPair > -1) {
                resulting_hands['TWO PAIR'] += 1 
            } else {
                resulting_hands['PAIR'] += 1 
            }
            return
        }
        resulting_hands['PACHUCA'] += 1
    }

    die_combination_list(n) {
        function recursive_roll(n, roll=[]) {
            if (n === 0) {
                die_combinantion_list.push([...roll])
            } else {
                for (let i = 0; i < 6; i++) {
                    roll.push(die_faces[i])
                    recursive_roll(n-1, roll)
                    roll.pop()
                }
            }
        }
        let die_faces = ['A', 'K', 'Q', 'J', '10', '9'];
        let die_combinantion_list = [];
        recursive_roll(n)
        return die_combinantion_list    
    }

    n_die_statistics(n, roll) {
        let die_faces = ['A', 'K', 'Q', 'J', '10', '9']
        let higher_rolls = 0
        let rollCount = this.countHand(roll)
        let init_hand = this.checkHand(rollCount)
        let resulting_hands = {
            'PACHUCA': 0,
            'PAIR': 0,
            'TWO PAIR': 0,
            'TERCIA': 0,
            'FULL': 0,
            'POKER': 0,
            'QUINTILLA': 0
        }
        let beating_hands = {
            'PACHUCA': 0,
            'PAIR': 0,
            'TWO PAIR': 0,
            'TERCIA': 0,
            'FULL': 0,
            'POKER': 0,
            'QUINTILLA': 0
        }
        let hands = ['QUINTILLA', 'POKER', 'FULL', 'TERCIA', 'TWO PAIR', 'PAIR', 'PACHUCA']
    
        // Get list of all possible combinations with n-die
        let die_combinations = this.die_combination_list(n, die_faces)
        
        // Check what each combination is classified as
        for (let i in die_combinations) {
            let rolling_hand = this.countHand(die_combinations[i])
            let comboResult = this.checkHand(rolling_hand)
            if (rollCount === rolling_hand) {
                resulting_hands[comboResult] += 1
                continue
            } else if (comboResult === init_hand) {
                let max_ind_comb = comboResult.indexOf(Math.max(comboResult))
                let max_ind_init = init_hand.indexOf(Math.max(init_hand))

                if (init_hand === 'TWO PAIR') {
                    if (max_ind_init === max_ind_comb) {
                        max_ind_comb = comboResult.slice(max_ind_init).indexOf(Math.max(comboResult.slice(max_ind_init)))
                        max_ind_init = init_hand.slice(max_ind_comb).indexOf(Math.max(init_hand.slice(max_ind_comb)))
                        if (max_ind_init === max_ind_comb) {
                            if (rolling_hand > rollCount) {
                                higher_rolls += 1
                            }
                        } else if (max_ind_comb > max_ind_init) {
                            higher_rolls += 1
                        } 
                    } else if (max_ind_comb > max_ind_init) {
                        higher_rolls += 1  
                    } 
                } else {
                    if (max_ind_init === max_ind_comb) {
                        if (rolling_hand > rollCount) {
                            higher_rolls += 1
                        } else if (max_ind_comb > max_ind_init) {
                            higher_rolls += 1  
                        }
                    }
                }
            } else {
                if (hands.indexOf(comboResult) < hands.indexOf(init_hand)) {
                    higher_rolls += 1
                }
            }
            resulting_hands[comboResult] += 1

        }
        return [resulting_hands, higher_rolls, init_hand]
    }

    // // Print results and statistics.
    // print("Number of dice:\n   ", n)
    // print()
    // print("Probability of beating: {}\n   ".format(faces_roll), "{:.2%}".format(higher_rolls / pow(6, n)))
    // print()
    // print("Overall Statistics: ")
    // for i in resulting_hands:
    //     print_n_die_statistics(resulting_hands, i, n)
    // probs = 0
    // print()
    // for i in resulting_hands:
    //     probs = print_higher_than_stats(resulting_hands, i, n, probs)
    // }



    getValues() {
        let pickedValues = document.querySelectorAll('.game')[5-this.index].querySelectorAll('.pick-face')
        let dieValues = []

        for (let i = 0; i < pickedValues.length; i++) {
            dieValues.push(pickedValues[i].value)
        }

        let resultsDiv = document.querySelectorAll(`.results-${this.index}`)
        //resultsDiv.innerHTML = this.checkHand(this.countHand(dieValues))
        
        const dieCombinations = this.die_combination_list(this.index);
        const stats = this.n_die_statistics(this.index, dieValues)
        
        resultsDiv[0].innerHTML = ""
        resultsDiv[1].innerHTML = ""

        let elem = document.createElement('h5')
        elem.innerHTML = 'P( beating ' + dieValues + ' ) = ' + (stats[1] / 6**this.index * 100).toFixed(2) + '%'
        resultsDiv[1].appendChild(elem)

        elem = document.createElement('h5')
        elem.innerHTML = 'You rolled a ' + stats[2]

        resultsDiv[0].appendChild(elem)

        let count = 1.00000000000001
        for (let i in stats[0]) {
            elem = document.createElement('div')
            count -= stats[0][i] / 6**this.index;
            elem.innerHTML = 'P( beating ' + i.toLowerCase() + ' ) = ' + (count*100).toFixed(2) + '%'
            resultsDiv[0].appendChild(elem)

            elem = document.createElement('div')
            elem.innerHTML = 'P( ' + i.toLowerCase() + ' ) = ' + (stats[0][i] / 6**this.index * 100).toFixed(2) + '%'
            resultsDiv[1].appendChild(elem)
        }
    }
    
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-4 col-md-3 col-lg-2 align-self-center">
                        <button type="submit" className="submit" onClick={this.getValues.bind(this)}>Get Results</button>
                    </div>
                    <div className="col-1"></div>
                    <div className={`results-${this.index} col-4`}></div>
                    <div className={`results-${this.index} col-4`}></div>
                </div>
            </div>
        )
    }
}
  
class App extends React.Component {
    render() {
      return (
        <div>
            <div className="container">
                <h2>Five Dice Probability</h2>
                <div className="game row ">
                    <Die index="0"/>
                    <Die index="1"/>
                    <Die index="2"/>
                    <Die index="3"/>
                    <Die index="4"/>
                </div>
                <Results index="5"/>
            </div>
            <hr/>
            <div className="container">
                <h2>Four Dice Probability</h2>
                <div className="game row ">
                    <Die index="5"/>
                    <Die index="6"/>
                    <Die index="7"/>
                    <Die index="8"/>
                </div>
                <Results index="4"/>
            </div>
            <hr/>
            <div className="container">
                <h2>Three Dice Probability</h2>
                <div className="game row">
                    <Die index="9"/>
                    <Die index="10"/>
                    <Die index="11"/>
                </div>
                <Results index="3"/>
            </div>
            <hr/>
            <div className="container">
                <h2>Two Dice Probability</h2>
                <div className="game row ">
                    <Die index="12"/>
                    <Die index="13"/>
                </div>
                <Results index="2"/>
            </div>
            <hr/>
            <div className="container">
                <h2>One Die Probability</h2>
                <div className="game row ">
                    <Die index="14"/>
                </div>
                <Results index="1"/>
            </div>
        </div>
      );
    }
}
  
  // ========================================
  
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
  
