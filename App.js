import React from 'react';
import {StyleSheet} from 'react-native';
import {
    Root,
    Container,
    Header,
    Content,
    Text,
    Button,
    Left,
    Right,
    Body,
    Icon,
    Title,
    View,
    Form,
    Picker,
    Item,
    Label,
    Input,
    CheckBox
} from 'native-base'
import {Font, AppLoading} from "expo";

const brands = [
    'Hyundai',
    'Ford',
    'Jaguar',
    'Renault',
    'Seat'
];
const yearsPerBrand = {
    'Hyundai': [2001, 2010, 2012, 2017],
    'Ford': [2003, 2009, 2001, 2018],
    'Jaguar': [2017, 2018, 2019],
    'Renault': [2005, 2006, 2017],
    'Seat': [1995, 1996, 1997, 1998]
};

const speedPerBrand = {
    'Hyundai': {
        false: [50, 100],
        true: [65, 130]
    },
    'Ford': {
        false: [50, 120],
        true: [68, 140]
    },
    'Jaguar': {
        false: [30, 200],
        true: [70, 150]
    },
    'Renault': {
        false: [50, 128],
        true: [45, 160]
    },
    'Seat': {
        false: [60, 175],
        true: [20, 100]
    }
};


export default class App extends React.Component {
    renderLoader = () => {
        return (
            <Root>
                <AppLoading/>
            </Root>
        );

    }
    state = {
        screenActivites: [this.renderLoader],
        activities: [],
        currentBrand: brands[0],
        onHighway: false,
        currentSpeed: null,
        currentYear: null

    };

    async componentWillMount() {
        await Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
        });
        // this.addEventListener(this.state.activities,this.onActivitiesChanged);
        this.setState({screenActivites: [this.renderBasic]});
    }

    goodToGo = () => {
        return (<Label>You're good to go!</Label>);
    }

    componentDidUpdate(prevProps, prevState) {
        const {activities,currentSpeed,currentYear} = this.state;

        if ((!activities || activities.length === 0) && currentSpeed != null && currentYear != null) {

            this.setState({activities: [this.goodToGo]});

        } else if (activities.length > 1 && activities.includes(this.goodToGo)) {

            const newActivities = activities.filter(it => it !== this.goodToGo);

            this.setState({activities: newActivities});
        }
    }

    onActivitiesChanged = () => {
        console.log('activities changed!');
    };

    deActivateActivityOne = (index) => {
        console.log(`deActivateActivityOne  ${index}`);
        const {activities} = this.state;
        activities.splice(index, 1);
        this.setState({activities});
    };
    activityOneRender = (index) => {
        console.log("activityOneRender");
        return (
            <Button onPress={() => this.deActivateActivityOne(index)}>
                <Text>Activity1! {index}</Text>
            </Button>
        );
    };
    onButtonClicked = () => {
        console.log("onButtonClicked");
        const {activities} = this.state;
        activities.push(this.activityOneRender);
        this.setState({activities});
    };
    renderHeader = () => {
        return (
            <Header>
                <Left>
                    <Button transparent>
                        <Icon name='menu'/>
                    </Button>
                </Left>
                <Body>
                <Title>Car safety validator</Title>
                </Body>
                <Right/>
            </Header>
        );
    };

    onItemPickerChange(value: string) {
        console.log(`onItemPickerChange ${value}`);
        this.setState({
            currentBrand: value
        });
    }

    invalidDate = () => {
        return (<Label>Invalid date!</Label>);
    };
    inexistantDate = () => {
        return (<Label>the current car does not have this model</Label>);
    };
    toSlow = () => {
        return (<Label>Too slow!!</Label>);
    };
    toFast = () => {
        return (<Label>Too fast!!</Label>);
    };

    onYearChanged = (currentYear) => {
        const {currentBrand, activities} = this.state;
        console.log(`current brand ${currentBrand}`);
        const errorActivites = [];
        const allErrorActivities = [this.invalidDate, this.inexistantDate];

        if (!currentYear || currentYear < 1995 || currentYear > 2019) {
            console.log('invalidDate');
            errorActivites.push(this.invalidDate);
        } else {
            if (!yearsPerBrand[currentBrand].includes(Number(currentYear))) {
                console.log(`inexistantDate`);
                errorActivites.push(this.inexistantDate);

            }
        }

        const newActivities = activities
            .filter(it => !allErrorActivities.includes(it))
            .concat(errorActivites);
        this.setState({activities: newActivities, currentYear});
    };
    onSpeedChanged = (input) => {
        const {onHighway, currentBrand, activities, currentSpeed} = this.state;
        const errorActivities = [];
        const newSpeed = input || currentSpeed;
        const allErrorActivities = [this.toSlow, this.toFast];
        if (speedPerBrand[currentBrand][onHighway][0] > newSpeed)
            errorActivities.push(this.toSlow);

        else if (speedPerBrand[currentBrand][onHighway][1] < newSpeed)
            errorActivities.push(this.toFast);

        const newActivities = activities.filter(it => !allErrorActivities.includes(it)).concat(errorActivities);
        this.setState({activities: newActivities, currentSpeed: newSpeed});


    }
    renderBasic = () => {
        const {activities} = this.state;
        console.log('renderBasic.activites', activities);
        return (
            <Container style={styles.container}>
                {this.renderHeader()}
                <Content padder>
                    <View>
                        <Form>
                            <Item picker>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down"/>}
                                    style={{width: undefined}}
                                    placeholder="Select your Brand"
                                    placeholderStyle={{color: "#bfc6ea"}}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.currentBrand}
                                    onValueChange={this.onItemPickerChange.bind(this)}
                                >
                                    {brands.map((it, index) => <Picker.Item key={`${it}_${index}`} label={it}
                                                                            value={it}/>)}
                                </Picker>
                            </Item>
                        </Form>
                        <Item inlineLabel>
                            <Label>Year</Label>
                            <Input onChangeText={this.onYearChanged}/>
                        </Item>
                        <Item inlineLabel>
                            <Label>currentSpeed</Label>
                            <Input onChangeText={this.onSpeedChanged}/>
                        </Item>
                        <Item>
                            <Body>
                            <Text>Are you on a highway? </Text>
                            </Body>
                            <CheckBox checked={this.state.onHighway}
                                      onPress={() => this.setState({onHighway: !this.state.onHighway}, this.onSpeedChanged)}/>

                        </Item>
                    </View>
                    <View>
                        {activities.map((currentActivity, index) => currentActivity(index))}
                    </View>
                </Content>

            </Container>
        );
    };
    render = () => {
        const {screenActivites} = this.state;
        return (
            screenActivites.map((it) => it())
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    button: {
        marginBottom: 10
    }
});
