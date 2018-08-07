import React from 'react';
// import GTPAvatar from '../components/appBar/GTPAvatar';
import GTPAvatar from '../components/appBar/GTPAvatar';
import renderer from 'react-test-renderer';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Store from '../Store';
import StyleWrapper from '../components/StyleWrapper';

configure({ adapter: new Adapter() })

test('Avatar without profilePictureURL', () => {
    const component = renderer.create(
        <Store>
            <StyleWrapper>
                <GTPAvatar
                />
            </StyleWrapper>
        </Store>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('Avatar with profilePictureURL', () => {
    const component = renderer.create(
        <Store>
            <StyleWrapper>
                <GTPAvatar
                profilePictureURL='/henry-XXX-UserIcon.png'
                />
            </StyleWrapper>
        </Store>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});