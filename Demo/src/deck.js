import React, { Component } from 'react';
import { 
    View, 
    Animated, 
    PanResponder,
    Dimensions,
    LayoutAnimation,
    UIManager
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE = 1.8;
const SWIPE_THRESHOLD = 0.20 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
    static defaultProps = {
        onSwipeRight: () => {},
        onSwipeLeft: () => {}
    };

    constructor(props) {
        super(props)

        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe('left');
                } else {
                    this.resetPosition();
                }                
            }
        });

        this.state = { panResponder, position, deckIndex: 0 };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data !== this.props.data) {
            this.setState({ deckIndex: 0 });
        }
    }

    /*componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }*/

    forceSwipe(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(this.state.position, {
            toValue: {x, y: 0},
            duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete(direction));
    }

    onSwipeComplete(direction) {
        const { onSwipeLeft, onSwipeRight, data} = this.props;
        const item = data[this.state.deckIndex];
        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
        this.state.position.setValue({x: 0, y: 0});
        this.setState({deckIndex: this.state.deckIndex + 1 });
    }

    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: { x: 0, y: 0 }
        }).start();
    }

    getCardStyle() {
        const { position } = this.state;        
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * SCALE, 0, SCREEN_WIDTH * SCALE],
            outputRange: ['-120deg','0deg', '120deg']
        });
        
        return {
            ...position.getLayout(),
            transform: [{ rotate }]
        };
    }

    renderCards() {
        if (this.state.deckIndex >= this.props.data.length) {
            return this.props.renderNoMoreCards();
        }

        return this.props.data.map((item, index) => {
            if(index < this.state.deckIndex) { return null; }

            if (index === this.state.deckIndex) {
                return (
                    <Animated.View
                        key={item.id}
                        style={[this.getCardStyle(), styles.cardStyle]}
                        {...this.state.panResponder.panHandlers}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }

            return (
                <Animated.View 
                    key={item.id}
                    style={[styles.cardStyle, { top: 10 * (index - this.state.deckIndex)}]}
                >
                    {this.props.renderCard(item)}
                </Animated.View>                
            );
        }).reverse();
    }

    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        );
    }
};

const styles = {
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH
    }
};

export default Deck;