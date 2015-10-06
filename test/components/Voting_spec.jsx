import React from 'react/addons';
import {List} from 'immutable';
import {Voting} from '../../src/components/Voting';
import {expect} from 'chai';

let { renderIntoDocument,
      scryRenderedDOMComponentsWithTag,
      Simulate  } = React.addons.TestUtils;

describe('test', () => {

  it('renders a pair of buttons', () => {

    let component = renderIntoDocument(
      <Voting pair={["Trainspotting", "28 Days Later"]} />
    );
    let buttons = scryRenderedDOMComponentsWithTag(component, 'button');
    expect(buttons.length).to.equal(2);
    expect(buttons[0].getDOMNode().textContent).to.equal('Trainspotting');
    expect(buttons[1].getDOMNode().textContent).to.equal('28 Days Later');
  });

  it('invokes callback when a button is clicked', () => {
    let votedWith;
    let vote = ( entry ) => votedWith = entry;

    let component = renderIntoDocument(
      <Voting pair={["Trainspotting", "28 Days Later"]}
              vote={vote}/>
    );

    let buttons = scryRenderedDOMComponentsWithTag(component, 'button');
    Simulate.click(buttons[0].getDOMNode());

    expect(votedWith).to.equal('Trainspotting');

  });

  it('disables buttons when user has voted', () => {

    let component = renderIntoDocument(
      <Voting pair={["Trainspotting", "28 Days Later"]}
              hasVoted="Trainspotting" />
    );
    let buttons = scryRenderedDOMComponentsWithTag(component, 'button');

    expect(buttons[0].getDOMNode().hasAttribute('disabled')).to.equal(true);
    expect(buttons[1].getDOMNode().hasAttribute('disabled')).to.equal(true);

  });

  it('adds label to the voted entry', () => {

    let component = renderIntoDocument(
      <Voting pair={["Trainspotting", "28 Days Later"]}
              hasVoted="Trainspotting" />
    );
    let buttons = scryRenderedDOMComponentsWithTag(component, 'button');

    expect(buttons[0].getDOMNode().textContent).to.contain('Voted');

  });

  it('renders just the winner when there is one', () => {

    let component = renderIntoDocument(
      <Voting winner="Trainspotting" />
    );
    const buttons = scryRenderedDOMComponentsWithTag(component, 'button');
    expect(buttons.length).to.equal(0);

    const winner = React.findDOMNode( component.refs.winner );
    expect(winner).to.be.ok;
    expect(winner.textContent).to.contain('Trainspotting');

  });

  it('renders as a pure component', () => {

    const pair = ['Trainspotting', '28 Days Later'];
    const component = renderIntoDocument(
      <Voting pair={pair} />
    );
    let firstButton = scryRenderedDOMComponentsWithTag(component, 'button')[0];
    expect(firstButton.getDOMNode().textContent).to.equal('Trainspotting');

    pair[0] = 'Sunshine';
    component.setProps({pair: pair});
    firstButton = scryRenderedDOMComponentsWithTag(component, 'button')[0];
    expect(firstButton.getDOMNode().textContent).to.equal('Trainspotting');

  });

  it('does update DOM when prop changes', () => {
    const pair = List.of('Trainspotting', '28 Days Later');
    const component = renderIntoDocument(
      <Voting pair={pair} />
    );

    let firstButton = scryRenderedDOMComponentsWithTag(component, 'button')[0];
    expect(firstButton.getDOMNode().textContent).to.equal('Trainspotting');

    const newPair = pair.set(0, 'Sunshine');
    component.setProps({pair: newPair});
    firstButton = scryRenderedDOMComponentsWithTag(component, 'button')[0];
    expect(firstButton.getDOMNode().textContent).to.equal('Sunshine');
  });

})
