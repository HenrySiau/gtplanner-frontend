// Link.react.test.js
import React from 'react';
import Link from '../components/Link.ignore';
import renderer from 'react-test-renderer';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() })

test('Link changes the class when hovered', () => {
  const component = renderer.create(
    <Link page="http://www.facebook.com">Facebook</Link>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseEnter();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseLeave();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

describe('description...', () => {
  it('description...', () => {
    const wrapper = shallow(<Link />);
    const instance = wrapper.instance();
    expect(instance.myAddFunction(1,2)).toBe(3);
    expect(instance.myAddFunction(2,2)).toBe(4);

  });
  // it('should add two to the counter when the "two" value is true', () => {
  //   const wrapper = shallow(<Home />);
  //   const instance = wrapper.instance();
  //   expect(wrapper.state('counter')).toBe(0);
  //   instance.incrementCounter(true);
  //   expect(wrapper.state('counter')).toBe(2);
  // });
});