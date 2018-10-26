import React, { Component } from 'react';
import { View, Animated, PanResponder } from 'react-native';

class Deck extends Component {
    constructor(props) {
        super(props)
        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({
            // Executed anytime the user taps on the screen
            onStartShouldSetPanResponder: () => true,
            // Called anytime the user starts to drag around the screen
            onPanResponderMove: (event, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            // Finalize callback of onPanResponderMove
            onPanResponderRelease: () => {}
        });

        this.state = {panResponder, position};
    }

    renderCards() {
        return this.props.data.map(item => {
            return this.props.renderCards(item);
        });
    }

    render() {
        return (
            <Animated.View 
                style={this.state.position.getLayout()}
                {...this.state.panResponder.panHandlers}>
                {this.renderCards()}
            </Animated.View>
        );
    }
};

export default Deck;