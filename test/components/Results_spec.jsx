import React from 'react/addons';
import {List, Map, fromJS} from 'immutable';
import {Results} from '../../src/components/Results';
import reducer from '../../src/reducer';

import {expect} from 'chai';

let {renderIntoDocument, scryRenderedDOMComponentsWithClass, Simulate} = React.addons.TestUtils;

describe('Results', () => {

  it('renders entries with vote counts or zero', () => {
    let pair = List.of('Trainspotting', '28 Days Later');
    let tally = Map({'Trainspotting': 5});

    const component = renderIntoDocument(
      <Results pair={pair} tally={tally} />
    );

    const entries = scryRenderedDOMComponentsWithClass(component, 'entry');
    const [train, days] = entries.map(e => e.getDOMNode().textContent);

    expect(entries.length).to.equal(2);
    expect(train).to.contain('Trainspotting');
    expect(train).to.contain('5');
    expect(days).to.contain('28 Days Later');
    expect(days).to.contain('0');
  });

  it('invokes the next callback when next button is clicked', () => {
    let nextInvoked = false;
    let next = () => nextInvoked = true;

    let pair = List.of('Trainspotting', '28 Days Later');
    let component = renderIntoDocument(
      <Results pair={pair}
               tally={Map()}
               next={next}/>
    );
    Simulate.click(React.findDOMNode(component.refs.next));

    expect(nextInvoked).to.equal(true);
  });

  it('renders the winner when there is one', () => {

    let component = renderIntoDocument(
      <Results winner="Trainspotting"
               pair={["Trainspotting", "28 Days Later"]}
               tally={Map()} />
    );
    let winner = React.findDOMNode(component.refs.winner)
    expect(winner).to.be.ok;
    expect(winner.textContent).to.contain('Trainspotting');

  });

  it('handles VOTE by setting hasVoted', () => {
    let state = fromJS({
      vote: {
        pair: ['Trainspotting', '28 Days Later'],
        tally: {Trainspotting: 1}
      }
    });

    let action = {type: 'VOTE', entry: 'Trainspotting'};
    let nextState = reducer(state, action);

    expect(nextState).to.equal(
      fromJS({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {Trainspotting: 1}
        },
        hasVoted: 'Trainspotting'
      })
    );
  });

  it('does not set hasVoted for VOTE on invalid entry', () => {
    let state = fromJS({
      vote: {
        pair: ['Trainspotting', '28 Days Later'],
        tally: {Trainspotting: 1}
      }
    });

    let action = {type: 'VOTE', entry: 'Sunshine'};
    let nextState = reducer(state, action);

    expect(nextState).to.equal(
      fromJS({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {Trainspotting: 1}
        }
      })
    );
  });

  it('removes hasVoted on SET_STATE if pair changes', () => {
    let initialState =
      fromJS({
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {Trainspotting: 1}
        },
        hasVoted: 'Trainspotting'
      });
    let action =
      {
        type: 'SET_STATE',
        state: {
          vote: {
            pair: ['Sunshine', 'Slumdog Millionaire']
          }
        }
      };
    let nextState = reducer(initialState, action);
    expect(nextState).to.equal(
      fromJS({
        vote: {
          pair: ['Sunshine', 'Slumdog Millionaire']
        }
      })
    );

  });

})
